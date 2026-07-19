"""
stellar_strategy.py
-------------------
Strategy ranking logic for TradeEvidence structured data.

Design note (rewrite):
-----------------------
The previous version gave all 9 strategies a shared flat baseline (30) and
then pushed every strategy through the same five bonus blocks (setup,
momentum, ADX, IV, location) with different point deltas. In practice, that
meant Bull Call Debit Spread collected a bonus in almost every block
simultaneously and won the #1 slot ~90% of the time across a real 261-stock
watchlist; Put Credit Spread won the other ~10% (purely on IV crossing a
threshold); the other 7 strategies never won even once.

This version gives each strategy its own scoring function built from the
conditions that actually make that specific strategy a good idea (its own
"ideal profile"), instead of routing everything through shared bonus blocks.
Each function is independently scaled 0-100, so multiple strategies have a
real, principled path to ranking #1 depending on the setup — not just the
two that happened to dominate the shared-block math.

Still bullish/neutral-only (matches the current ruleset). Bearish strategies
are a separate, deferred piece of work.
"""

from __future__ import annotations

from typing import Dict, List


def _fit_label(score: int) -> str:
    if score >= 80:
        return "Excellent"
    if score >= 70:
        return "Very Good"
    if score >= 60:
        return "Good"
    if score >= 50:
        return "Fair"
    return "Poor"


def _clip(x: float) -> int:
    return int(round(max(0, min(100, x))))


def _base_strategies() -> Dict[str, dict]:
    return {
        "Bull Call Debit Spread": {
            "capital": "Low-Medium",
            "risk": "Moderate",
            "risk_detail": "Can lose full debit paid if the move does not occur.",
            "pros": "Defined risk, cheaper than long calls, reduced theta and IV exposure.",
            "cons": "Upside is capped; requires realistic target selection.",
            "description": "Fits bullish directional setups with defined risk and controlled premium outlay.",
        },
        "Long Call": {
            "capital": "Low",
            "risk": "High",
            "risk_detail": "Can lose 100% of premium paid; needs directional move before expiration.",
            "pros": "Defined risk, leveraged upside, much less capital than owning shares.",
            "cons": "Time decay works against the trade; IV contraction can hurt.",
            "description": "Fits bullish momentum when IV is low or moderate and a directional move is expected.",
        },
        "Long Stock": {
            "capital": "High",
            "risk": "High",
            "risk_detail": "Large dollar risk if the stock reverses; position sizing matters.",
            "pros": "No expiration, full upside participation, simplest bullish expression.",
            "cons": "Requires the most capital and exposes the trader to full downside in shares.",
            "description": "Fits high-conviction bullish setups when capital commitment is acceptable, especially when options premium is too rich to buy.",
        },
        "Put Credit Spread": {
            "capital": "Low-Medium",
            "risk": "Moderate",
            "risk_detail": "Gap-down risk remains; credit must justify spread width.",
            "pros": "Defined risk, benefits from time decay, can profit even if slightly wrong directionally.",
            "cons": "Limited reward; poor if credit is too small.",
            "description": "Fits bullish-to-neutral setups when option premium provides reasonable credit.",
        },
        "Covered Call": {
            "capital": "High",
            "risk": "Moderate-High",
            "risk_detail": "Stock decline can overwhelm premium collected.",
            "pros": "Generates income, lowers cost basis, works well for bullish-to-neutral continuation.",
            "cons": "Caps upside and still carries downside stock ownership risk.",
            "description": "Fits bullish-to-neutral continuation when income and cost-basis reduction are desired.",
        },
        "Cash Secured Put": {
            "capital": "High",
            "risk": "Moderate-High",
            "risk_detail": "Downside risk approaches stock ownership below the strike.",
            "pros": "Generates income and can acquire stock at a lower effective price.",
            "cons": "Requires cash and can result in owning shares during a decline.",
            "description": "Fits bullish-to-neutral names when willing to own shares lower, especially on a pullback.",
        },
        "Call Calendar / Diagonal": {
            "capital": "Low-Medium",
            "risk": "Moderate",
            "risk_detail": "Can underperform if price moves too fast or IV shifts adversely.",
            "pros": "Useful when direction is bullish but move may take time; can benefit from near-term theta.",
            "cons": "More complex and sensitive to term structure and strike selection.",
            "description": "Fits developing bullish setups where timing flexibility matters and the move may need patience.",
        },
        "Poor Man's Covered Call": {
            "capital": "Medium",
            "risk": "Moderate",
            "risk_detail": "Long call can lose value quickly if trend fails or IV drops.",
            "pros": "Lower-capital alternative to covered calls using long-dated calls.",
            "cons": "More complex; sensitive to diagonal structure and IV changes.",
            "description": "Fits sustained bullish trends when lower capital than stock ownership is preferred.",
        },
        "Iron Condor": {
            "capital": "Low-Medium",
            "risk": "Moderate",
            "risk_detail": "Can lose if trend accelerates beyond short strikes.",
            "pros": "Defined-risk income trade for range-bound names.",
            "cons": "Poor fit for strong directional breakout candidates.",
            "description": "Fits range-bound conditions when directional strength is weak and option premium is elevated.",
        },
    }


class _Ctx:
    """Parsed, normalized inputs shared by every strategy scorer."""

    def __init__(self, data: dict):
        daily_setup = data.get("daily_setup_display", "")
        daily_mom = data.get("daily_momentum_display", "")

        self.prime = daily_setup == "Prime Setup"
        self.developing = daily_setup in {"Developing Setup", "Developing Momentum"}
        self.active_momentum = daily_setup == "Active Momentum"
        self.fresh_turn = "Improving" in daily_mom or "Turning Up" in daily_mom
        self.momentum_positive = "Positive" in daily_mom  # already-established, not fresh
        self.momentum_weak_or_bearish = ("Weakening" in daily_mom) or ("Bearish" in daily_mom)

        self.adx_code = data.get("directional_strength_display", "").lower().replace(" ", "_")
        self.adx = data.get("adx")
        self.iv_code = data.get("option_premium_display", "").lower().replace(" ", "_")
        self.iv = data.get("iv")
        self.location_code = data.get("market_location_code", "unknown")
        self.pct_from_ema21 = data.get("pct_from_ema21")
        self.trend_code = data.get("trend_structure_code", "unknown")

        wm = data.get("weekly_momentum_display", "")
        ws = data.get("weekly_setup_display", "")
        ms = data.get("monthly_setup_display", "")
        self.weekly_support = ("Positive" in wm) or (ws not in {"No Active Setup", "Unknown", ""} and "No Active Setup" not in ws)
        self.monthly_support = ms not in {"No Active Setup", "Unknown", ""} and "No Active Setup" not in ms


# ---------------------------------------------------------------------------
# One scoring function per strategy. Each starts from its own baseline and is
# pushed by the specific conditions that make *that* strategy attractive —
# not a shared block of bonuses applied uniformly to all nine.
# ---------------------------------------------------------------------------

def _score_bull_call_debit_spread(c: _Ctx) -> float:
    s = 40.0
    if c.prime: s += 20
    elif c.developing: s += 12
    elif c.active_momentum: s += 6
    if c.fresh_turn: s += 10
    elif c.momentum_positive: s += 6
    s += {"very_strong": 12, "strong": 14, "healthy": 8, "emerging": 2, "weak": -8}.get(c.adx_code, 0)
    s += {"very_low": 14, "low": 14, "medium": 6, "high": -8, "very_high": -16}.get(c.iv_code, 0)
    s += {"near_21": 10, "healthy_extension": 4, "extended": -8, "very_extended": -16,
          "pullback_below": -4, "below_21": -6}.get(c.location_code, 0)
    s += {"bull_aligned": 6, "bull_short": 2, "recovery_mixed": 2, "below_short": -6, "mixed": 0}.get(c.trend_code, 0)
    return _clip(s)


def _score_long_call(c: _Ctx) -> float:
    s = 28.0
    if c.prime: s += 16
    elif c.developing: s += 8
    if c.fresh_turn: s += 16
    elif c.momentum_positive: s += 8
    s += {"very_strong": 16, "strong": 16, "healthy": 8, "emerging": 0, "weak": -12}.get(c.adx_code, 0)
    s += {"very_low": 20, "low": 12, "medium": 0, "high": -14, "very_high": -26}.get(c.iv_code, 0)
    s += {"near_21": 10, "healthy_extension": 2, "extended": -10, "very_extended": -20,
          "pullback_below": -6, "below_21": -8}.get(c.location_code, 0)
    return _clip(s)


def _score_long_stock(c: _Ctx) -> float:
    s = 35.0
    if c.prime: s += 12
    elif c.developing: s += 6
    if c.fresh_turn or c.momentum_positive: s += 10
    s += {"very_strong": 14, "strong": 14, "healthy": 6, "emerging": 0, "weak": -6}.get(c.adx_code, 0)
    s += {"bull_aligned": 12, "bull_short": 4, "recovery_mixed": 4, "below_short": -10, "mixed": 0}.get(c.trend_code, 0)
    s += {"near_21": 8, "healthy_extension": 4, "extended": -4, "very_extended": -10,
          "pullback_below": 0, "below_21": -4}.get(c.location_code, 0)
    # Rich premium makes buying options relatively less attractive vs owning shares outright.
    s += {"very_high": 8, "high": 5}.get(c.iv_code, 0)
    return _clip(s)


def _score_put_credit_spread(c: _Ctx) -> float:
    s = 34.0
    if c.prime or c.developing or c.active_momentum: s += 8
    if c.fresh_turn or c.momentum_positive: s += 6
    s += {"very_strong": 6, "strong": 6, "healthy": 6, "emerging": 2, "weak": -2}.get(c.adx_code, 0)
    s += {"very_high": 24, "high": 18, "medium": 6, "low": -6, "very_low": -12}.get(c.iv_code, 0)
    s += {"near_21": 8, "healthy_extension": 8, "extended": 4, "very_extended": 0,
          "pullback_below": -2, "below_21": -4}.get(c.location_code, 0)
    s += {"bull_aligned": 6, "bull_short": 4, "recovery_mixed": 2, "below_short": -6, "mixed": 0}.get(c.trend_code, 0)
    return _clip(s)


def _score_covered_call(c: _Ctx) -> float:
    s = 34.0
    s += {"bull_aligned": 8, "bull_short": 6, "recovery_mixed": 6, "below_short": -4, "mixed": 2}.get(c.trend_code, 0)
    # A strong runner is a poor fit — capping upside on a breakout defeats the point of holding it.
    s += {"very_strong": 0, "strong": 3, "healthy": 7, "emerging": 5, "weak": 3}.get(c.adx_code, 0)
    s += {"very_high": 10, "high": 15, "medium": 8, "low": -4, "very_low": -8}.get(c.iv_code, 0)
    s += {"near_21": 6, "healthy_extension": 6, "extended": 2, "very_extended": -2,
          "pullback_below": 2, "below_21": 0}.get(c.location_code, 0)
    return _clip(s)


def _score_cash_secured_put(c: _Ctx) -> float:
    s = 32.0
    # This is fundamentally a "get paid to wait for a better entry" trade.
    s += {"pullback_below": 12, "below_21": 8, "near_21": 8, "healthy_extension": 2,
          "extended": -4, "very_extended": -8}.get(c.location_code, 0)
    s += {"very_high": 10, "high": 14, "medium": 6, "low": -6, "very_low": -10}.get(c.iv_code, 0)
    if c.weekly_support: s += 8
    if c.monthly_support: s += 4
    s += {"bull_aligned": 6, "bull_short": 5, "recovery_mixed": 5, "below_short": -6, "mixed": 0}.get(c.trend_code, 0)
    return _clip(s)


def _score_call_calendar(c: _Ctx) -> float:
    s = 32.0
    if c.developing: s += 16
    elif c.prime: s += 6
    elif c.active_momentum: s += 8
    s += {"weak": 10, "emerging": 9, "healthy": 3, "strong": -4, "very_strong": -8}.get(c.adx_code, 0)
    s += {"low": 8, "medium": 8, "very_low": 4, "high": 2, "very_high": -6}.get(c.iv_code, 0)
    s += {"near_21": 6, "pullback_below": 6, "below_21": 4, "healthy_extension": 2,
          "extended": 0, "very_extended": -4}.get(c.location_code, 0)
    return _clip(s)


def _score_poor_mans_covered_call(c: _Ctx) -> float:
    s = 32.0
    s += {"bull_aligned": 10, "bull_short": 6, "recovery_mixed": 5, "below_short": -6, "mixed": 0}.get(c.trend_code, 0)
    s += {"very_strong": 4, "strong": 8, "healthy": 8, "emerging": 2, "weak": -4}.get(c.adx_code, 0)
    if c.fresh_turn or c.momentum_positive: s += 6
    s += {"medium": 6, "high": 6, "very_high": 2, "low": 2, "very_low": 0}.get(c.iv_code, 0)
    s += {"near_21": 6, "healthy_extension": 4, "extended": 0, "very_extended": -4,
          "pullback_below": 0, "below_21": -2}.get(c.location_code, 0)
    return _clip(s)


def _score_iron_condor(c: _Ctx) -> float:
    s = 22.0
    # Per ruleset: only favor when directional strength is weak, premium is elevated,
    # AND the market is not clearly trending or extended. All three, not just ADX.
    s += {"weak": 20, "emerging": 4, "healthy": -10, "strong": -22, "very_strong": -26}.get(c.adx_code, 0)
    s += {"very_high": 20, "high": 15, "medium": 2, "low": -8, "very_low": -14}.get(c.iv_code, 0)
    s += {"near_21": 8, "healthy_extension": 4, "extended": -14, "very_extended": -24,
          "pullback_below": 2, "below_21": 4}.get(c.location_code, 0)
    s += {"mixed": 8, "recovery_mixed": 6, "bull_short": -4, "bull_aligned": -10, "below_short": -4}.get(c.trend_code, 0)
    return _clip(s)


_SCORERS = {
    "Bull Call Debit Spread": _score_bull_call_debit_spread,
    "Long Call": _score_long_call,
    "Long Stock": _score_long_stock,
    "Put Credit Spread": _score_put_credit_spread,
    "Covered Call": _score_covered_call,
    "Cash Secured Put": _score_cash_secured_put,
    "Call Calendar / Diagonal": _score_call_calendar,
    "Poor Man's Covered Call": _score_poor_mans_covered_call,
    "Iron Condor": _score_iron_condor,
}


def _why(name: str, c: _Ctx, score: int) -> str:
    adx_label = c.adx_code.replace("_", " ")
    iv_label = c.iv_code.replace("_", " ")
    loc_label = c.location_code.replace("_", " ")
    adx_txt = f"{c.adx:.0f}" if c.adx is not None else "n/a"
    iv_txt = f"{c.iv:.0f}%" if c.iv is not None else "n/a"

    if name == "Bull Call Debit Spread":
        return f"Cheap-to-moderate premium ({iv_label}, {iv_txt}) plus {adx_label} directional strength (ADX {adx_txt}) supports a defined-risk directional spread here."
    if name == "Long Call":
        return f"{iv_label.capitalize()} premium ({iv_txt}) makes buying options relatively cheap, and {adx_label} directional strength (ADX {adx_txt}) argues for leveraged upside over a capped spread."
    if name == "Long Stock":
        return f"High conviction with {adx_label} directional strength, and {iv_label} premium ({iv_txt}) means options are relatively expensive to buy versus owning shares directly."
    if name == "Put Credit Spread":
        return f"{iv_label.capitalize()} premium ({iv_txt}) makes selling a defined-risk credit spread attractive without needing an aggressive directional bet."
    if name == "Covered Call":
        return f"{iv_label.capitalize()} premium ({iv_txt}) supports income generation, and directional strength here ({adx_label}) isn't so strong that capping upside is costly."
    if name == "Cash Secured Put":
        return f"Entry zone ({loc_label}) and {iv_label} premium ({iv_txt}) support getting paid while waiting for a better effective entry."
    if name == "Call Calendar / Diagonal":
        return f"Setup is still developing rather than fully fired, and {adx_label} directional strength suggests the move may need time — good fit for a calendar's patience."
    if name == "Poor Man's Covered Call":
        return f"Sustained trend context with {adx_label} directional strength supports a lower-capital stand-in for stock ownership."
    if name == "Iron Condor":
        return f"{adx_label.capitalize()} directional strength (ADX {adx_txt}) with {iv_label} premium ({iv_txt}) and a location that isn't trending/extended favors a range-bound income trade."
    return f"Ranks based on setup quality, directional strength, option premium, and market location ({loc_label})."


def rank_strategies(data: dict, trade_score: int, verdict: str) -> List[dict]:
    strategies = _base_strategies()
    c = _Ctx(data)

    raw_scores = {name: fn(c) for name, fn in _SCORERS.items()}

    # NO-verdict rows: keep the same relative ranking so the "least-bad" option
    # is still visible for educational purposes, but flatten everything down
    # since none of these are being called an actual opportunity.
    if verdict == "NO":
        raw_scores = {k: max(0, v - 20) for k, v in raw_scores.items()}

    out = []
    for name, meta in strategies.items():
        s = int(round(raw_scores[name]))
        item = {
            "name": name,
            "fit_score": s,
            "fit": _fit_label(s),
            "capital": meta["capital"],
            "risk": meta["risk"],
            "risk_detail": meta["risk_detail"],
            "pros": meta["pros"],
            "cons": meta["cons"],
            "description": meta["description"],
            "why": _why(name, c, s),
        }
        out.append(item)

    out.sort(key=lambda x: (-x["fit_score"], x["name"]))
    return out
