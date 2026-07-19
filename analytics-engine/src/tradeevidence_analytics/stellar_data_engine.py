"""
stellar_data_engine.py
----------------------
Structured TradeEvidence data engine.

Inputs expected from Thinkorswim CSV/watchlist export:
- Symbol
- Last                 (used as Price)
- StellarEvDaily
- StellerEvWeekly     (TOS column name currently misspelled)
- StellarEvMonthly
- StellarOrDaily
- StellerOrWeekly     (TOS column name currently misspelled)
- ADX
- Impl Vol
- sma200
- sma50
- ema21

The engine computes:
- % from 21 EMA, 50 SMA, 200 SMA
- Trend structure
- Market location
- Opportunity-first verdict
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import csv
import math
import re

from .stellar_strategy import rank_strategies


ENGINE_VERSION = "TradeEvidence Decision Engine v1.1"
RULESET_VERSION = "Opportunity-First + Location Rules v1.2"

MISSING_VALUES = {"", "loading", "nan", "none", "null", "n/a", "na", "--", "-", "#n/a", "#value!"}

# ---------------------------------------------------------------------------
# Scoring weights (bullish/"LONG" opportunity path only — bearish path TBD).
#
# These are hand-tuned right now, not fit against realized outcomes. Pulling
# them into one place doesn't make them "validated" — it just means that once
# forward-return data exists (did a YES-verdict stock actually move favorably
# over the following N days?), tuning is a one-block edit instead of a hunt
# through the scoring function. Treat every value below as a hypothesis.
# ---------------------------------------------------------------------------
WEIGHTS = {
    # Daily setup quality
    "daily_prime": 30,
    "daily_positive_setup": 20,       # positive setup, not yet "prime"
    "daily_expansion_underway": 5,    # no active setup, but expansion already underway
    # Daily momentum
    "daily_fresh_turn": 18,           # CROSSOVER / BUY-WATCH ("Momentum Improving")
    "daily_positive_momentum": 12,    # already-established BUY ("Momentum Positive")
    # Weekly context
    "weekly_bearish": -30,
    "weekly_positive": 15,
    "weekly_neutral": 3,
    # Monthly context
    "monthly_positive_setup": 8,
    # Trend structure
    "trend_bull_aligned": 10,
    "trend_bull_short_or_recovery": 4,
    "trend_bearish": -15,             # bear_aligned or below_short
    # Directional strength (ADX)
    "adx_strong_or_very_strong": 12,
    "adx_healthy": 8,
    "adx_emerging": 2,
    "adx_weak": -10,
    # Entry zone / location
    "location_near_21": 8,
    "location_healthy_extension": 5,
    "location_extended": -8,
    "location_very_extended": -18,
    "location_below_or_pullback": -5,
}

# Theoretical bounds of the additive formula above (sum of best-case and
# worst-case branches). Used only to give the "NO" tier a readable, ordered
# display score instead of every negative raw score flattening to 0/100.
_RAW_SCORE_FLOOR = -75
_RAW_SCORE_CEILING = 105


def _clean_key(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", (s or "").strip().lower())


def _to_float(value) -> Optional[float]:
    if value is None:
        return None
    s = str(value).strip()
    if s.lower() in MISSING_VALUES:
        return None
    s = s.replace("%", "").replace("$", "").replace(",", "")
    # TOS sometimes exports -.42
    if s.startswith("-."):
        s = "-0" + s[1:]
    if s.startswith("+."):
        s = "+0" + s[1:]
    try:
        return float(s)
    except Exception:
        return None


def _fmt_num(value, digits=0, default="n/a") -> str:
    """Safely format optional numbers for report text."""
    if value is None:
        return default
    try:
        return f"{float(value):.{digits}f}"
    except Exception:
        return default


def _norm_text(value) -> str:
    if value is None:
        return ""
    s = str(value).strip()
    if s.lower() in MISSING_VALUES:
        return ""
    return s


def _safe_label(value, default="Unknown") -> str:
    """Return a non-empty string for labels used in report text."""
    s = _norm_text(value)
    return s if s else default


def _find_header_line(path: Path) -> int:
    """TOS exports may include a title/preamble before the actual CSV header."""
    lines = path.read_text(encoding="utf-8-sig", errors="replace").splitlines()
    for i, line in enumerate(lines):
        if line.strip().lower().startswith("symbol,"):
            return i
    raise ValueError("Could not find CSV header line starting with Symbol,")


def _read_csv_with_preamble(path: Path) -> List[Dict[str, str]]:
    header_line = _find_header_line(path)
    lines = path.read_text(encoding="utf-8-sig", errors="replace").splitlines()[header_line:]
    reader = csv.DictReader(lines)
    return list(reader)


def _col(row: Dict[str, str], *names: str) -> str:
    lookup = {_clean_key(k): v for k, v in row.items()}
    for name in names:
        key = _clean_key(name)
        if key in lookup:
            return lookup[key]
    return ""


def parse_setup(raw: str) -> Tuple[str, str]:
    """
    Returns (setup_signal, expansion_state)
    signal: BUY, BUY-WATCH, NO, UNKNOWN
    expansion: PENDING, UNDERWAY, UNKNOWN
    """
    s = _norm_text(raw).upper().replace("BUY WATCH", "BUY-WATCH")
    if not s:
        return "UNKNOWN", "UNKNOWN"

    if "BUY-WATCH" in s or "WATCH" in s:
        signal = "BUY-WATCH"
    elif "BUY" in s:
        signal = "BUY"
    elif "NO" in s:
        signal = "NO"
    else:
        signal = "UNKNOWN"

    if "CD" in s:
        expansion = "PENDING"
    elif "BO" in s:
        expansion = "UNDERWAY"
    else:
        expansion = "UNKNOWN"

    return signal, expansion


def parse_momentum(raw: str) -> str:
    """
    Normalized momentum/trend values.
    """
    s = _norm_text(raw).upper().replace("_", "-")
    if not s:
        return "UNKNOWN"
    if "CROSSOVER" in s:
        return "CROSSOVER"
    if "CROSSUNDER" in s:
        return "CROSSUNDER"
    if "BUY-WATCH" in s:
        return "BUY-WATCH"
    if s == "BUY" or "BULL" in s:
        if "UP" in s:
            return "BULL-UP"
        if "FLAT" in s:
            return "BULL-FLAT"
        return "BUY"
    if "SHORT-WATCH" in s:
        return "SHORT-WATCH"
    if "SHORT" in s or "BEAR" in s:
        if "DOWN" in s:
            return "BEAR-DOWN"
        if "FLAT" in s:
            return "BEAR-FLAT"
        return "SHORT"
    return s


def setup_display(signal: str, expansion: str) -> str:
    if signal == "BUY" and expansion == "PENDING":
        return "Prime Setup"
    if signal == "BUY" and expansion == "UNDERWAY":
        return "Active Momentum"
    if signal == "BUY-WATCH" and expansion == "PENDING":
        return "Developing Setup"
    if signal == "BUY-WATCH" and expansion == "UNDERWAY":
        return "Developing Momentum"
    if signal == "NO" and expansion == "PENDING":
        return "No Active Setup — Expansion Pending"
    if signal == "NO" and expansion == "UNDERWAY":
        return "No Active Setup — Expansion Underway"
    if signal == "NO":
        return "No Active Setup"
    return "Unknown"


def momentum_display(momentum: str, timeframe: str) -> str:
    tf = timeframe.lower()
    if momentum == "CROSSOVER":
        return "Momentum Turning Up" if tf == "daily" else "Trend Turning Up"
    if momentum in {"BULL-UP", "BUY"}:
        return "Momentum Positive" if tf == "daily" else "Trend Positive"
    if momentum == "BULL-FLAT":
        return "Momentum Stable" if tf == "daily" else "Trend Stable"
    if momentum == "BUY-WATCH":
        return "Momentum Improving" if tf == "daily" else "Trend Improving"
    if momentum == "SHORT-WATCH":
        return "Momentum Weakening" if tf == "daily" else "Trend Weakening"
    if momentum in {"SHORT", "BEAR-DOWN", "CROSSUNDER"}:
        return "Momentum Bearish" if tf == "daily" else "Trend Bearish"
    if momentum == "BEAR-FLAT":
        return "Momentum Soft" if tf == "daily" else "Trend Soft"
    return "Trend Unclear" if tf == "weekly" else "Momentum Unclear"


def directional_strength(adx: Optional[float]) -> Tuple[str, str]:
    if adx is None:
        return "Unknown", "unknown"
    if adx < 15:
        return "Weak", "weak"
    if adx < 20:
        return "Emerging", "emerging"
    if adx < 30:
        return "Healthy", "healthy"
    if adx < 40:
        return "Strong", "strong"
    return "Very Strong", "very_strong"


def option_premium(iv: Optional[float]) -> Tuple[str, str]:
    if iv is None:
        return "Unknown", "unknown"
    if iv < 20:
        return "Very Low", "very_low"
    if iv < 30:
        return "Low", "low"
    if iv < 40:
        return "Medium", "medium"
    if iv < 60:
        return "High", "high"
    return "Very High", "very_high"


def pct_from(price: Optional[float], avg: Optional[float]) -> Optional[float]:
    if price is None or avg is None or avg == 0:
        return None
    return ((price - avg) / avg) * 100.0


def market_location(pct21: Optional[float]) -> Tuple[str, str]:
    if pct21 is None:
        return "Unknown", "unknown"
    if pct21 < -5:
        return "Below 21 EMA", "below_21"
    if pct21 < -2:
        return "Pullback below 21 EMA", "pullback_below"
    if abs(pct21) <= 2:
        return "Near 21 EMA", "near_21"
    if pct21 <= 5:
        return "Healthy extension", "healthy_extension"
    if pct21 <= 10:
        return "Extended", "extended"
    return "Very Extended", "very_extended"


def trend_structure(price, ema21, sma50, sma200) -> Tuple[str, str]:
    vals = [price, ema21, sma50, sma200]
    if any(v is None for v in vals):
        return "Unknown", "unknown"
    if price > ema21 > sma50 > sma200:
        return "Bull trend: Price > 21 EMA > 50 SMA > 200 SMA", "bull_aligned"
    if price > ema21 and ema21 > sma50:
        return "Bullish short-term structure", "bull_short"
    if price > sma200 and ema21 < sma50:
        return "Recovery / mixed structure", "recovery_mixed"
    if price < ema21 < sma50 < sma200:
        return "Bear trend: Price < 21 EMA < 50 SMA < 200 SMA", "bear_aligned"
    if price < ema21:
        return "Below short-term trend", "below_short"
    return "Mixed structure", "mixed"


@dataclass
class TradeRow:
    symbol: str
    last: Optional[float]
    net_change: Optional[float]
    pct_change: Optional[float]

    daily_setup_signal: str
    daily_expansion: str
    weekly_setup_signal: str
    weekly_expansion: str
    monthly_setup_signal: str
    monthly_expansion: str

    daily_momentum: str
    weekly_momentum: str

    adx: Optional[float]
    iv: Optional[float]

    ema21: Optional[float]
    sma50: Optional[float]
    sma200: Optional[float]

    pct_from_ema21: Optional[float]
    pct_from_sma50: Optional[float]
    pct_from_sma200: Optional[float]
    market_location: str
    market_location_code: str
    trend_structure: str
    trend_structure_code: str


@dataclass
class TradeResult:
    symbol: str
    verdict: str
    score: int
    confidence: str
    market_story: str
    decision_summary: str
    reasoning: List[str]
    risk_flags: List[str]
    strategies: List[dict]
    data: dict

    def to_json(self) -> dict:
        return asdict(self)


def load_trade_rows(path: Path) -> List[TradeRow]:
    raw_rows = _read_csv_with_preamble(path)
    out: List[TradeRow] = []

    for raw in raw_rows:
        symbol = _norm_text(_col(raw, "Symbol"))
        if not symbol:
            continue

        last = _to_float(_col(raw, "Last", "Price"))
        net_change = _to_float(_col(raw, "Net Chng", "Net Change"))
        pct_change = _to_float(_col(raw, "%Change", "% Change"))
        adx = _to_float(_col(raw, "ADX"))
        iv = _to_float(_col(raw, "Impl Vol", "Implied Vol", "IV"))
        ema21 = _to_float(_col(raw, "ema21", "EMA21", "21 EMA"))
        sma50 = _to_float(_col(raw, "sma50", "SMA50", "50 SMA"))
        sma200 = _to_float(_col(raw, "sma200", "SMA200", "200 SMA"))

        ds, de = parse_setup(_col(raw, "StellarEvDaily"))
        ws, we = parse_setup(_col(raw, "StellerEvWeekly", "StellarEvWeekly"))
        ms, me = parse_setup(_col(raw, "StellarEvMonthly"))
        dm = parse_momentum(_col(raw, "StellarOrDaily"))
        wm = parse_momentum(_col(raw, "StellerOrWeekly", "StellarOrWeekly"))

        p21 = pct_from(last, ema21)
        p50 = pct_from(last, sma50)
        p200 = pct_from(last, sma200)
        ml, ml_code = market_location(p21)
        ts, ts_code = trend_structure(last, ema21, sma50, sma200)

        out.append(
            TradeRow(
                symbol=symbol,
                last=last,
                net_change=net_change,
                pct_change=pct_change,
                daily_setup_signal=ds,
                daily_expansion=de,
                weekly_setup_signal=ws,
                weekly_expansion=we,
                monthly_setup_signal=ms,
                monthly_expansion=me,
                daily_momentum=dm,
                weekly_momentum=wm,
                adx=adx,
                iv=iv,
                ema21=ema21,
                sma50=sma50,
                sma200=sma200,
                pct_from_ema21=p21,
                pct_from_sma50=p50,
                pct_from_sma200=p200,
                market_location=ml,
                market_location_code=ml_code,
                trend_structure=ts,
                trend_structure_code=ts_code,
            )
        )
    return out


def _is_positive_setup(signal: str) -> bool:
    return signal in {"BUY", "BUY-WATCH"}


def _is_prime_setup(signal: str, expansion: str) -> bool:
    return signal == "BUY" and expansion == "PENDING"


def _is_positive_momentum(m: str) -> bool:
    return m in {"CROSSOVER", "BULL-UP", "BULL-FLAT", "BUY", "BUY-WATCH"}


def _is_fresh_turn(m: str) -> bool:
    return m in {"CROSSOVER", "BUY-WATCH"}


def _is_bearish_momentum(m: str) -> bool:
    return m in {"CROSSUNDER", "SHORT", "SHORT-WATCH", "BEAR-DOWN"}


def _confidence(score: int, risk_flags: List[str]) -> str:
    if score >= 80 and len(risk_flags) <= 1:
        return "High"
    if score >= 68:
        return "Moderate"
    if score >= 55:
        return "Speculative"
    return "Low"


def _score_row(row: TradeRow) -> Tuple[int, float, str, List[str], List[str]]:
    score = 0
    reasons: List[str] = []
    risks: List[str] = []

    daily_prime = _is_prime_setup(row.daily_setup_signal, row.daily_expansion)
    daily_positive_setup = _is_positive_setup(row.daily_setup_signal)
    daily_positive_momentum = _is_positive_momentum(row.daily_momentum)
    daily_fresh_turn = _is_fresh_turn(row.daily_momentum)
    weekly_positive = _is_positive_momentum(row.weekly_momentum)
    weekly_bearish = _is_bearish_momentum(row.weekly_momentum)
    monthly_setup_positive = _is_positive_setup(row.monthly_setup_signal)

    ds_label = setup_display(row.daily_setup_signal, row.daily_expansion)
    ws_label = setup_display(row.weekly_setup_signal, row.weekly_expansion)
    ms_label = setup_display(row.monthly_setup_signal, row.monthly_expansion)
    dm_label = momentum_display(row.daily_momentum, "daily")
    wm_label = momentum_display(row.weekly_momentum, "weekly")
    adx_label, adx_code = directional_strength(row.adx)

    # Data quality notes. Thinkorswim sometimes exports custom columns before they finish calculating.
    unknown_fields = []
    if row.daily_setup_signal == "UNKNOWN":
        unknown_fields.append("daily setup")
    if row.weekly_setup_signal == "UNKNOWN":
        unknown_fields.append("weekly setup")
    if row.monthly_setup_signal == "UNKNOWN":
        unknown_fields.append("monthly setup")
    if row.daily_momentum == "UNKNOWN":
        unknown_fields.append("daily momentum")
    if row.weekly_momentum == "UNKNOWN":
        unknown_fields.append("weekly trend")
    if row.adx is None:
        unknown_fields.append("directional strength")
    if row.iv is None:
        unknown_fields.append("option premium")
    if row.last is None or row.ema21 is None or row.sma50 is None or row.sma200 is None:
        unknown_fields.append("entry zone")
    if unknown_fields:
        risks.append("Some exported fields were unavailable/loading: " + ", ".join(unknown_fields) + ".")

    if daily_prime:
        score += WEIGHTS["daily_prime"]
        reasons.append("Daily setup is Prime: buy conditions are aligned before a potential volatility expansion.")
    elif daily_positive_setup:
        score += WEIGHTS["daily_positive_setup"]
        reasons.append(f"Daily setup is {ds_label}, making it constructive but not fully mature.")
    elif row.daily_setup_signal == "NO" and row.daily_expansion == "UNDERWAY":
        score += WEIGHTS["daily_expansion_underway"]
        reasons.append("Daily expansion is already underway, which can support continuation but may be later in the move.")

    if daily_fresh_turn:
        score += WEIGHTS["daily_fresh_turn"]
        reasons.append(f"Daily momentum is {dm_label}, suggesting a fresh or improving bullish shift.")
    elif daily_positive_momentum:
        score += WEIGHTS["daily_positive_momentum"]
        reasons.append(f"Daily momentum is {dm_label}, supporting entry timing.")

    if weekly_bearish:
        score += WEIGHTS["weekly_bearish"]
        risks.append(f"Weekly trend is {wm_label}; this can veto or weaken bullish setups.")
    elif weekly_positive:
        score += WEIGHTS["weekly_positive"]
        reasons.append(f"Weekly trend is {wm_label}, adding higher-timeframe support.")
    else:
        score += WEIGHTS["weekly_neutral"]
        reasons.append("Weekly trend is neutral/unclear rather than outright bearish, so it does not automatically veto the daily opportunity.")

    if monthly_setup_positive:
        score += WEIGHTS["monthly_positive_setup"]
        reasons.append(f"Monthly setup is {ms_label}, adding higher-timeframe context.")

    if row.trend_structure_code == "bull_aligned":
        score += WEIGHTS["trend_bull_aligned"]
        reasons.append("Trend structure is bullishly aligned: price is above the 21 EMA, 50 SMA, and 200 SMA.")
    elif row.trend_structure_code in {"bull_short", "recovery_mixed"}:
        score += WEIGHTS["trend_bull_short_or_recovery"]
        reasons.append(f"Trend structure is {row.trend_structure.lower()}.")
    elif row.trend_structure_code in {"bear_aligned", "below_short"}:
        score += WEIGHTS["trend_bearish"]
        risks.append(f"Trend structure is {row.trend_structure.lower()}.")

    if adx_code in {"strong", "very_strong"}:
        score += WEIGHTS["adx_strong_or_very_strong"]
        reasons.append(f"Directional strength is {adx_label.lower()} with ADX {_fmt_num(row.adx, 2)}.")
    elif adx_code == "healthy":
        score += WEIGHTS["adx_healthy"]
        reasons.append(f"Directional strength is healthy with ADX {_fmt_num(row.adx, 2)}.")
    elif adx_code == "emerging":
        score += WEIGHTS["adx_emerging"]
        reasons.append(f"Directional strength is emerging with ADX {_fmt_num(row.adx, 2)}.")
    elif adx_code == "weak":
        score += WEIGHTS["adx_weak"]
        risks.append("Directional strength is weak; price may remain range-bound or take longer to move.")

    # Location / extension logic
    if row.market_location_code == "near_21":
        score += WEIGHTS["location_near_21"]
        reasons.append("Entry zone is near the 21 EMA, which can provide a more balanced entry zone.")
    elif row.market_location_code == "healthy_extension":
        score += WEIGHTS["location_healthy_extension"]
        reasons.append(f"Entry zone is a healthy extension: {_fmt_num(row.pct_from_ema21, 1)}% above the 21 EMA.")
    elif row.market_location_code == "extended":
        score += WEIGHTS["location_extended"]
        risks.append(f"Price is extended: {_fmt_num(row.pct_from_ema21, 1)}% above the 21 EMA. Chasing risk is elevated.")
    elif row.market_location_code == "very_extended":
        score += WEIGHTS["location_very_extended"]
        risks.append(f"Price is very extended: {_fmt_num(row.pct_from_ema21, 1)}% above the 21 EMA. Pullback risk is elevated.")
    elif row.market_location_code in {"below_21", "pullback_below"}:
        score += WEIGHTS["location_below_or_pullback"]
        risks.append(f"Price is below the 21 EMA ({_fmt_num(row.pct_from_ema21, 1)}%), so timing may need confirmation.")

    # Outright bearish overrides
    # NOTE: verdict decisions below use `score`, the raw (unclamped) additive
    # total. This is unchanged from before — clamping only ever affected the
    # *displayed* number, never the YES/WATCH/NO decision itself.
    if weekly_bearish and not (daily_prime and daily_fresh_turn):
        verdict = "NO"
    elif score >= 62 and not weekly_bearish:
        # Weak directional strength should not automatically stay YES unless there is exceptional support.
        if adx_code == "weak" and not (daily_prime and monthly_setup_positive and daily_fresh_turn):
            verdict = "WATCH"
        else:
            verdict = "YES"
    elif score >= 45:
        verdict = "WATCH"
    else:
        verdict = "NO"

    # Extended names should remain actionable only with high-quality confirmation, but never hide risk.
    if verdict == "YES" and row.market_location_code == "very_extended":
        verdict = "WATCH"
        risks.append("Very extended location demoted the setup from YES to WATCH.")

    raw_score = score
    display_score = _display_score(raw_score)
    return display_score, raw_score, verdict, reasons, risks


def _display_score(raw_score: float) -> int:
    """
    Convert the raw additive score into a 0-100 display value.

    Previously this was `max(0, min(100, round(raw_score)))`. That hard floor
    collapsed every row with a negative raw score onto exactly 0 — in a real
    261-row watchlist, roughly a quarter of all rows landed on precisely 0,
    even though their underlying raw scores varied widely (some barely
    missed, some were uniformly bad). That made the NO tier's numeric score
    meaningless for comparing "how bad."

    Fix: scores >= 0 are unchanged (0-100, same as before — YES/WATCH scores
    are untouched). Scores < 0 are linearly compressed into a small distinct
    band (0-9) based on where they fall between the formula's theoretical
    floor and zero, so two very-negative rows and one barely-negative row no
    longer read identically. This does not change any verdict — verdicts are
    decided from raw_score before this function runs.
    """
    if raw_score >= 0:
        # Unchanged from the original behavior for non-negative scores.
        return int(round(min(100, raw_score)))
    span = 0 - _RAW_SCORE_FLOOR
    clamped = max(_RAW_SCORE_FLOOR, raw_score)
    frac = (clamped - _RAW_SCORE_FLOOR) / span  # 0.0 at the floor, 1.0 at zero
    return int(round(frac * 9))


def _market_story(row: TradeRow, verdict: str, score: int, strategies: List[dict]) -> str:
    adx_label, _ = directional_strength(row.adx)
    iv_label, _ = option_premium(row.iv)
    ds = _safe_label(setup_display(row.daily_setup_signal, row.daily_expansion)).lower()
    wm = _safe_label(momentum_display(row.weekly_momentum, "weekly")).lower()
    dm = _safe_label(momentum_display(row.daily_momentum, "daily")).lower()
    best = _safe_label(strategies[0].get("name") if strategies else "No strategy")

    location = _safe_label(row.market_location)
    if row.pct_from_ema21 is not None:
        location += f" ({_fmt_num(row.pct_from_ema21, 1)}% from 21 EMA)"

    trend = _safe_label(row.trend_structure).lower()
    adx_display = _fmt_num(row.adx, 0)
    iv_display = _fmt_num(row.iv, 0)

    return (
        f"{row.symbol} shows {ds} on the daily view with {dm}. "
        f"The weekly view is {wm}. Directional Strength is {adx_label} "
        f"({adx_display}) and Option Premium is {iv_label} ({iv_display}%). "
        f"Entry Zone is {location}, and trend structure is {trend}. "
        f"Based on this evidence, {best} is currently ranked as the best-fitting strategy."
    )


def _decision_summary(row: TradeRow, verdict: str, score: int, strategies: List[dict]) -> str:
    conf = _confidence(score, [])
    best = strategies[0]["name"] if strategies else "No strategy"
    action = "actionable" if verdict == "YES" else ("worth monitoring" if verdict == "WATCH" else "not currently attractive")
    return (
        f"{row.symbol} scores {score}/100 and is classified as {action}. "
        f"The engine considered setup quality, daily momentum, weekly trend context, "
        f"directional strength, option premium, entry zone, and trend structure. "
        f"{best} ranks highest because it best matches the current evidence profile."
    )


def score_rows(rows: List[TradeRow]) -> List[TradeResult]:
    results: List[TradeResult] = []

    for row in rows:
        score, raw_score, verdict, reasons, risks = _score_row(row)

        data = asdict(row)
        data.update(
            {
                "daily_setup_display": setup_display(row.daily_setup_signal, row.daily_expansion),
                "weekly_setup_display": setup_display(row.weekly_setup_signal, row.weekly_expansion),
                "monthly_setup_display": setup_display(row.monthly_setup_signal, row.monthly_expansion),
                "daily_momentum_display": momentum_display(row.daily_momentum, "daily"),
                "weekly_momentum_display": momentum_display(row.weekly_momentum, "weekly"),
                "directional_strength_display": directional_strength(row.adx)[0],
                "option_premium_display": option_premium(row.iv)[0],
                # Unclamped additive total. Not shown as "the score" anywhere,
                # but kept here for future analysis/backtesting since it's
                # more granular than the compressed 0-100 display value.
                "score_raw": raw_score,
            }
        )

        strategies = rank_strategies(data, score, verdict)
        confidence = _confidence(score, risks)
        story = _market_story(row, verdict, score, strategies)
        summary = _decision_summary(row, verdict, score, strategies)

        if not risks:
            risks = ["No major structured risk flags detected."]

        results.append(
            TradeResult(
                symbol=row.symbol,
                verdict=verdict,
                score=score,
                confidence=confidence,
                market_story=story,
                decision_summary=summary,
                reasoning=reasons,
                risk_flags=risks,
                strategies=strategies,
                data=data,
            )
        )

    # Sort by verdict then score
    order = {"YES": 0, "WATCH": 1, "NO": 2}
    results.sort(key=lambda r: (order.get(r.verdict, 9), -r.score, r.symbol))
    return results
