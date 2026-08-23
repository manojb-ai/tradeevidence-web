"""Thinkorswim CSV adapter for the canonical Evidence Engine v2 contract."""

from __future__ import annotations

from collections import Counter
import csv
from decimal import Decimal, InvalidOperation
import hashlib
from pathlib import Path
from typing import List, Optional

from .evidence_models import NormalizedTechnicalObservation
from .stellar_data_engine import TradeRow


def _decimal(value):
    return None if value is None else Decimal(str(value))


def _setup(signal: str, expansion: str) -> str:
    return {
        ("BUY", "PENDING"): "positive_prime",
        ("BUY", "UNDERWAY"): "positive_active",
        ("BUY-WATCH", "PENDING"): "positive_developing",
        ("BUY-WATCH", "UNDERWAY"): "positive_watch",
        ("NO", "PENDING"): "no_active_setup",
        ("NO", "UNDERWAY"): "no_active_setup",
        ("NO", "UNKNOWN"): "no_active_setup",
    }.get((signal, expansion), "unknown")


def _v2_setup(value: str) -> str:
    return {
        "BULL-CD": "positive_prime",
        "BULL-WATCH-CD": "positive_developing",
        "BEAR-CD": "negative_prime",
        "BEAR-WATCH-CD": "negative_developing",
        "NEUTRAL-CD": "neutral_compression",
        "BULL-BO": "bullish_uncompressed",
        "BEAR-BO": "bearish_uncompressed",
        "NEUTRAL-BO": "no_active_setup",
    }.get(value.strip().upper(), "unknown")


def _momentum(value: str) -> str:
    return {
        "CROSSOVER": "bullish_turning",
        "BUY-WATCH": "bullish_improving",
        "BULL-UP": "bullish",
        "BUY": "bullish",
        "BULL-FLAT": "bullish_stable",
        "CROSSUNDER": "bearish_turning",
        "SHORT-WATCH": "bearish_weakening",
        "SHORT": "bearish",
        "BEAR-DOWN": "bearish",
        "BEAR-FLAT": "bearish_soft",
    }.get(value, "unknown")


def _v2_orbit(value: str) -> str:
    return {
        "BULL": "bullish",
        "BULL-WATCH": "bullish_weakening",
        "BEAR": "bearish",
        "BEAR-WATCH": "bearish_weakening",
        "NEUTRAL": "neutral",
    }.get(value.strip().upper(), "unknown")


def _unavailable_reasons(row: TradeRow) -> dict[str, str]:
    reasons = {}
    if row.daily_setup_signal == "UNKNOWN":
        reasons["daily_setup"] = "provider_loading_or_source_missing"
    if row.daily_momentum == "UNKNOWN":
        reasons["daily_momentum"] = "provider_loading_or_source_missing"
    if row.weekly_momentum == "UNKNOWN":
        reasons["weekly_trend"] = "provider_loading_or_source_missing"
    if row.adx is None:
        reasons["directional_strength"] = "provider_loading_or_source_missing"
    if any(value is None for value in (row.last, row.ema21, row.sma50, row.sma200)):
        reasons["trend_structure"] = "provider_loading_or_source_missing"
    return reasons


def adapt_row(
    row: TradeRow,
    *,
    market_date: str,
    as_of: str,
    source_version: str,
    source_checksum: str,
) -> NormalizedTechnicalObservation:
    """Map one legacy provider row without importing legacy scoring semantics."""
    return NormalizedTechnicalObservation(
        instrument_id=f"legacy-symbol:{row.symbol}",
        symbol_at_observation=row.symbol,
        market_date=market_date,
        as_of=as_of,
        observation_kind="regular_session_close",
        source_version=source_version,
        source_checksum=source_checksum,
        close=_decimal(row.last),
        ema21=_decimal(row.ema21),
        sma50=_decimal(row.sma50),
        sma200=_decimal(row.sma200),
        adx14=_decimal(row.adx),
        daily_setup=_setup(row.daily_setup_signal, row.daily_expansion),
        weekly_setup=_setup(row.weekly_setup_signal, row.weekly_expansion),
        daily_momentum=_momentum(row.daily_momentum),
        weekly_trend=_momentum(row.weekly_momentum),
        monthly_context=_setup(row.monthly_setup_signal, row.monthly_expansion),
        unavailable_reasons=_unavailable_reasons(row),
    )


def _clean_key(value: str) -> str:
    return "".join(character for character in value.lower() if character.isalnum())


def _column(row: dict[str, str], *names: str) -> str:
    lookup = {_clean_key(key): value for key, value in row.items()}
    for name in names:
        if _clean_key(name) in lookup:
            return (lookup[_clean_key(name)] or "").strip()
    return ""


def _number(value: str) -> Optional[Decimal]:
    cleaned = value.strip().lower().replace(",", "").replace("$", "").replace("%", "")
    if cleaned in {"", "loading", "nan", "none", "null", "n/a", "na", "--", "-"}:
        return None
    try:
        return Decimal(cleaned)
    except InvalidOperation:
        return None


def _read_rows(path: Path) -> list[dict[str, str]]:
    lines = path.read_text(encoding="utf-8-sig", errors="replace").splitlines()
    header_index = next(
        (index for index, line in enumerate(lines) if line.strip().lower().startswith("symbol,")),
        None,
    )
    if header_index is None:
        raise ValueError("Could not find CSV header line starting with Symbol,")
    return list(csv.DictReader(lines[header_index:]))


def _raw_unavailable(row: dict[str, str]) -> dict[str, str]:
    reasons = {}
    if _v2_setup(_column(row, "StellarEvDaily")) == "unknown":
        reasons["daily_setup"] = "provider_loading_or_source_missing"
    if _v2_orbit(_column(row, "StellarOrDaily")) == "unknown":
        reasons["daily_momentum"] = "provider_loading_or_source_missing"
    if _v2_orbit(_column(row, "StellerOrWeekly", "StellarOrWeekly")) == "unknown":
        reasons["weekly_trend"] = "provider_loading_or_source_missing"
    if _number(_column(row, "ADX")) is None:
        reasons["directional_strength"] = "provider_loading_or_source_missing"
    if any(
        _number(_column(row, *names)) is None
        for names in (("Last", "Price"), ("EMA21", "21 EMA"), ("SMA50", "50 SMA"), ("SMA200", "200 SMA"))
    ):
        reasons["trend_structure"] = "provider_loading_or_source_missing"
    return reasons


def load_tos_observations(path: Path, *, market_date: str, as_of: str) -> List[NormalizedTechnicalObservation]:
    raw = path.read_bytes()
    checksum = hashlib.sha256(raw).hexdigest()
    rows = _read_rows(path)
    symbols = [_column(row, "Symbol") for row in rows if _column(row, "Symbol")]
    duplicates = sorted(symbol for symbol, count in Counter(symbols).items() if count > 1)
    if duplicates:
        raise ValueError(f"Duplicate symbols are not permitted: {', '.join(duplicates)}")
    observations = []
    for row in rows:
        symbol = _column(row, "Symbol")
        if not symbol:
            continue
        observations.append(
            NormalizedTechnicalObservation(
                instrument_id=f"legacy-symbol:{symbol}",
                symbol_at_observation=symbol,
                market_date=market_date,
                as_of=as_of,
                observation_kind="regular_session_close",
                source_version=f"tos-csv-sha256:{checksum}",
                source_checksum=checksum,
                close=_number(_column(row, "Last", "Price")),
                ema21=_number(_column(row, "EMA21", "21 EMA")),
                sma50=_number(_column(row, "SMA50", "50 SMA")),
                sma200=_number(_column(row, "SMA200", "200 SMA")),
                adx14=_number(_column(row, "ADX")),
                daily_setup=_v2_setup(_column(row, "StellarEvDaily")),
                weekly_setup=_v2_setup(_column(row, "StellerEvWeekly", "StellarEvWeekly")),
                daily_momentum=_v2_orbit(_column(row, "StellarOrDaily")),
                weekly_trend=_v2_orbit(_column(row, "StellerOrWeekly", "StellarOrWeekly")),
                monthly_context=_v2_setup(_column(row, "StellarEvMonthly")),
                unavailable_reasons=_raw_unavailable(row),
            )
        )
    return observations
