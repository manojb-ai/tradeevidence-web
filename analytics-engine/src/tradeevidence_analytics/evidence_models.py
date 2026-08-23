"""Canonical, provider-independent data structures for Evidence Engine v2."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from decimal import Decimal
from enum import Enum
from typing import Any, Dict, List, Optional


ENGINE_VERSION = "TradeEvidence Evidence Engine v2.0.0-candidate.2"
RULESET_VERSION = "direction-aware-technical-evidence-v0.2.0"
INPUT_SCHEMA_VERSION = "normalized-technical-observation-v1"
OUTPUT_SCHEMA_VERSION = "technical-evidence-snapshot-v2"
TEMPLATE_VERSION = "deterministic-evidence-language-v1"


class Direction(str, Enum):
    BULLISH = "bullish"
    BEARISH = "bearish"
    MIXED = "mixed"
    NEUTRAL = "neutral"
    INCOMPLETE = "incomplete"


class Classification(str, Enum):
    BULLISH = "bullish"
    BULLISH_WATCH = "bullish_watch"
    BEARISH = "bearish"
    BEARISH_WATCH = "bearish_watch"
    MIXED = "mixed"
    NEUTRAL = "neutral"
    INCOMPLETE = "incomplete"


class Effect(str, Enum):
    SUPPORTING = "supporting"
    CONTRADICTING = "contradicting"
    NEUTRAL = "neutral"
    UNAVAILABLE = "unavailable"
    NOT_EVALUATED = "not_evaluated"


@dataclass(frozen=True)
class NormalizedTechnicalObservation:
    instrument_id: str
    symbol_at_observation: str
    market_date: str
    as_of: str
    observation_kind: str
    source_version: str
    source_checksum: str
    close: Optional[Decimal]
    ema21: Optional[Decimal]
    sma50: Optional[Decimal]
    sma200: Optional[Decimal]
    adx14: Optional[Decimal]
    daily_setup: str
    weekly_setup: str
    daily_momentum: str
    weekly_trend: str
    monthly_context: str
    unavailable_reasons: Dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class FactorAllocation:
    factor_code: str
    definition_version: str
    group: str
    capacity: int
    observed_state: str
    bullish: int
    bearish: int
    neutral: int
    unavailable: int
    effect: Effect
    explanation_code: str
    explanation: str
    unavailable_reason: Optional[str] = None

    @property
    def allocated_capacity(self) -> int:
        return self.bullish + self.bearish + self.neutral + self.unavailable


@dataclass(frozen=True)
class EvidenceSnapshot:
    instrument_id: str
    symbol_at_observation: str
    market_date: str
    as_of: str
    observation_kind: str
    status: str
    direction: Direction
    classification: Classification
    alignment_score: Optional[int]
    alignment_unrounded: Optional[str]
    alignment_band: Optional[str]
    coverage: int
    eligible_capacity: int
    evaluated_capacity: int
    bullish_total: int
    bearish_total: int
    neutral_total: int
    unavailable_total: int
    factors: List[FactorAllocation]
    principal_support: Optional[str]
    principal_contradiction: Optional[str]
    summary: str
    invalidation_conditions: List[str]
    engine_version: str = ENGINE_VERSION
    ruleset_version: str = RULESET_VERSION
    input_schema_version: str = INPUT_SCHEMA_VERSION
    output_schema_version: str = OUTPUT_SCHEMA_VERSION
    template_version: str = TEMPLATE_VERSION
    source_version: str = ""
    source_checksum: str = ""

    def to_json(self) -> Dict[str, Any]:
        payload = asdict(self)
        payload["direction"] = self.direction.value
        payload["classification"] = self.classification.value
        for factor in payload["factors"]:
            factor["effect"] = factor["effect"].value
        return payload
