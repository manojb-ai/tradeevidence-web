"""Thinkorswim CSV adapter for the canonical Evidence Engine v2 contract."""

from __future__ import annotations

from collections import Counter
from decimal import Decimal
import hashlib
from pathlib import Path
from typing import List

from .evidence_models import NormalizedTechnicalObservation
from .stellar_data_engine import TradeRow, load_trade_rows


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
        daily_momentum=_momentum(row.daily_momentum),
        weekly_trend=_momentum(row.weekly_momentum),
        monthly_context=_setup(row.monthly_setup_signal, row.monthly_expansion),
        unavailable_reasons=_unavailable_reasons(row),
    )


def load_tos_observations(path: Path, *, market_date: str, as_of: str) -> List[NormalizedTechnicalObservation]:
    raw = path.read_bytes()
    checksum = hashlib.sha256(raw).hexdigest()
    rows = load_trade_rows(path)
    symbols = [row.symbol for row in rows]
    duplicates = sorted(symbol for symbol, count in Counter(symbols).items() if count > 1)
    if duplicates:
        raise ValueError(f"Duplicate symbols are not permitted: {', '.join(duplicates)}")
    return [
        adapt_row(
            row,
            market_date=market_date,
            as_of=as_of,
            source_version=f"tos-csv-sha256:{checksum}",
            source_checksum=checksum,
        )
        for row in rows
    ]
