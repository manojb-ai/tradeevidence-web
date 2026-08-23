"""Direction-aware deterministic Technical Evidence candidate engine.

The rules in this module are explicit, versioned hypotheses. They are suitable
for semantic and engineering validation, not claims of predictive validity.
"""

from __future__ import annotations

from dataclasses import replace
from decimal import Decimal, ROUND_HALF_UP
from typing import Callable, Dict, Iterable, List, Optional, Tuple

from .evidence_models import (
    Classification,
    Direction,
    Effect,
    EvidenceSnapshot,
    FactorAllocation,
    NormalizedTechnicalObservation,
)


ELIGIBLE_CAPACITY = 100
REQUIRED_FIELDS = (
    "close",
    "ema21",
    "sma50",
    "sma200",
    "adx14",
    "daily_setup",
    "daily_momentum",
    "weekly_trend",
)


def _allocation(
    code: str,
    group: str,
    capacity: int,
    state: str,
    bullish: int,
    bearish: int,
    neutral: int,
    explanation: str,
) -> FactorAllocation:
    if bullish + bearish + neutral != capacity:
        raise ValueError(f"Factor {code} does not reconcile to capacity {capacity}")
    return FactorAllocation(
        factor_code=code,
        definition_version="1.0.0-candidate.2",
        group=group,
        capacity=capacity,
        observed_state=state,
        bullish=bullish,
        bearish=bearish,
        neutral=neutral,
        unavailable=0,
        effect=Effect.NEUTRAL,
        explanation_code=f"{code}_{state}",
        explanation=explanation,
    )


def _unavailable(code: str, group: str, capacity: int, reason: str) -> FactorAllocation:
    return FactorAllocation(
        factor_code=code,
        definition_version="1.0.0-candidate.2",
        group=group,
        capacity=capacity,
        observed_state="unavailable",
        bullish=0,
        bearish=0,
        neutral=0,
        unavailable=capacity,
        effect=Effect.UNAVAILABLE,
        explanation_code=f"{code}_unavailable",
        explanation=f"{code.replace('_', ' ').title()} was unavailable and contributed no directional evidence.",
        unavailable_reason=reason,
    )


def _daily_setup(obs: NormalizedTechnicalObservation) -> FactorAllocation:
    code, group, capacity = "daily_setup", "setup", 20
    state = obs.daily_setup
    values = {
        "positive_prime": (20, 0, 0, "The daily setup provides strong bullish setup evidence."),
        "positive_developing": (12, 0, 8, "The daily setup is developing and provides partial bullish evidence."),
        "positive_active": (14, 0, 6, "The daily setup is active and provides bullish evidence with some maturity limitation."),
        "positive_watch": (8, 0, 12, "The daily setup provides tentative bullish evidence."),
        "negative_prime": (0, 20, 0, "The daily setup provides strong bearish setup evidence."),
        "negative_developing": (0, 12, 8, "The daily setup is developing and provides partial bearish evidence."),
        "bullish_uncompressed": (8, 0, 12, "Bullish trend alignment is present without active compression."),
        "bearish_uncompressed": (0, 8, 12, "Bearish trend alignment is present without active compression."),
        "neutral_compression": (0, 0, 20, "Compression is active without an approved directional setup."),
        "no_active_setup": (0, 0, 20, "No active directional setup was identified."),
    }
    if not state or state == "unknown":
        return _unavailable(code, group, capacity, obs.unavailable_reasons.get(code, "source_missing"))
    bull, bear, neutral, text = values.get(state, (0, 0, 20, "The daily setup state is directionally neutral in this ruleset."))
    return _allocation(code, group, capacity, state, bull, bear, neutral, text)


def _directional_momentum(code: str, group: str, capacity: int, state: str, unavailable_reason: str) -> FactorAllocation:
    values = {
        "bullish_turning": (20, 0, 0),
        "bullish": (18, 0, 2),
        "bullish_improving": (14, 0, 6),
        "bullish_stable": (10, 0, 10),
        "bullish_weakening": (10, 4, 6),
        "bearish_turning": (0, 20, 0),
        "bearish": (0, 18, 2),
        "bearish_soft": (0, 10, 10),
        "bearish_weakening": (4, 10, 6),
        "neutral": (0, 0, 20),
    }
    if not state or state == "unknown":
        return _unavailable(code, group, capacity, unavailable_reason)
    bull, bear, neutral = values.get(state, (0, 0, capacity))
    label = code.replace("_", " ").title()
    text = f"{label} evaluated as {state.replace('_', ' ')}."
    return _allocation(code, group, capacity, state, bull, bear, neutral, text)


def _trend_structure(obs: NormalizedTechnicalObservation) -> FactorAllocation:
    code, group, capacity = "trend_structure", "trend", 25
    if any(value is None for value in (obs.close, obs.ema21, obs.sma50, obs.sma200)):
        return _unavailable(code, group, capacity, obs.unavailable_reasons.get(code, "source_missing"))
    if obs.close > obs.ema21 > obs.sma50 > obs.sma200:
        return _allocation(code, group, capacity, "bull_aligned", 25, 0, 0, "Price and moving averages are fully aligned in a bullish order.")
    if obs.close > obs.ema21 and obs.ema21 > obs.sma50:
        return _allocation(code, group, capacity, "bull_short", 17, 0, 8, "Short-term moving-average structure is bullish but not fully aligned.")
    if obs.close < obs.ema21 < obs.sma50 < obs.sma200:
        return _allocation(code, group, capacity, "bear_aligned", 0, 25, 0, "Price and moving averages are fully aligned in a bearish order.")
    if obs.close < obs.ema21:
        return _allocation(code, group, capacity, "below_short", 0, 17, 8, "Price is below the short-term trend, providing partial bearish evidence.")
    if obs.close > obs.sma200 and obs.ema21 < obs.sma50:
        return _allocation(code, group, capacity, "recovery_mixed", 8, 8, 9, "Moving-average structure contains material bullish and bearish evidence.")
    return _allocation(code, group, capacity, "mixed", 0, 0, 25, "Moving-average structure is mixed and provides no clear directional lead.")


def _adx_confirmation(obs: NormalizedTechnicalObservation, directional: Iterable[FactorAllocation]) -> FactorAllocation:
    code, group, capacity = "directional_strength", "quality", 15
    if obs.adx14 is None:
        return _unavailable(code, group, capacity, obs.unavailable_reasons.get(code, "source_missing"))

    bullish = sum(item.bullish for item in directional)
    bearish = sum(item.bearish for item in directional)
    lead = abs(bullish - bearish)
    if lead < 10:
        return _allocation(code, group, capacity, "no_direction_to_confirm", 0, 0, 15, "ADX cannot confirm a direction because directional evidence has no material lead.")

    if obs.adx14 < Decimal("15"):
        confirmed = 0
        state = "weak"
    elif obs.adx14 < Decimal("20"):
        confirmed = 5
        state = "emerging"
    elif obs.adx14 < Decimal("30"):
        confirmed = 10
        state = "healthy"
    else:
        confirmed = 15
        state = "strong"

    neutral = capacity - confirmed
    if bullish > bearish:
        return _allocation(code, group, capacity, state, confirmed, 0, neutral, f"ADX is {state} and confirms the bullish directional lead by {confirmed} points.")
    return _allocation(code, group, capacity, state, 0, confirmed, neutral, f"ADX is {state} and confirms the bearish directional lead by {confirmed} points.")


def _band(score: int) -> str:
    if score >= 80:
        return "strong_alignment"
    if score >= 65:
        return "constructive_alignment"
    if score >= 50:
        return "mixed_evidence"
    if score >= 35:
        return "weak_alignment"
    return "low_alignment"


def _direction_and_classification(bullish: int, bearish: int, neutral: int) -> Tuple[Direction, Classification]:
    dominant = max(bullish, bearish)
    lead = abs(bullish - bearish)
    both_material = bullish >= 25 and bearish >= 25
    if dominant < 35:
        return Direction.NEUTRAL, Classification.NEUTRAL
    if both_material and lead < 15:
        return Direction.MIXED, Classification.MIXED
    if lead < 15:
        return Direction.MIXED, Classification.MIXED
    if bullish > bearish:
        classification = Classification.BULLISH if bullish >= 65 else Classification.BULLISH_WATCH
        return Direction.BULLISH, classification
    classification = Classification.BEARISH if bearish >= 65 else Classification.BEARISH_WATCH
    return Direction.BEARISH, classification


def _apply_effects(factors: List[FactorAllocation], direction: Direction) -> List[FactorAllocation]:
    updated = []
    for factor in factors:
        if factor.unavailable:
            updated.append(factor)
            continue
        if direction == Direction.BULLISH:
            effect = Effect.SUPPORTING if factor.bullish > factor.bearish else Effect.CONTRADICTING if factor.bearish else Effect.NEUTRAL
        elif direction == Direction.BEARISH:
            effect = Effect.SUPPORTING if factor.bearish > factor.bullish else Effect.CONTRADICTING if factor.bullish else Effect.NEUTRAL
        else:
            effect = Effect.NEUTRAL
        updated.append(replace(factor, effect=effect))
    return updated


def _principal(factors: Iterable[FactorAllocation], direction: Direction, supporting: bool) -> Optional[str]:
    if direction not in (Direction.BULLISH, Direction.BEARISH):
        return None
    scored = []
    for factor in factors:
        aligned = factor.bullish if direction == Direction.BULLISH else factor.bearish
        opposed = factor.bearish if direction == Direction.BULLISH else factor.bullish
        value = aligned if supporting else opposed
        if value:
            scored.append((value, factor.factor_code))
    return max(scored)[1] if scored else None


def evaluate_observation(obs: NormalizedTechnicalObservation) -> EvidenceSnapshot:
    initial = [
        _daily_setup(obs),
        _directional_momentum("daily_momentum", "momentum", 20, obs.daily_momentum, obs.unavailable_reasons.get("daily_momentum", "source_missing")),
        _directional_momentum("weekly_trend", "higher_timeframe", 20, obs.weekly_trend, obs.unavailable_reasons.get("weekly_trend", "source_missing")),
        _trend_structure(obs),
    ]
    factors = initial + [_adx_confirmation(obs, initial)]

    if any(item.allocated_capacity != item.capacity for item in factors):
        raise ValueError("Factor allocation reconciliation failed")
    if sum(item.capacity for item in factors) != ELIGIBLE_CAPACITY:
        raise ValueError("Ruleset eligible capacity does not equal 100")

    unavailable_fields = [name for name in REQUIRED_FIELDS if getattr(obs, name, None) in (None, "", "unknown")]
    bullish = sum(item.bullish for item in factors)
    bearish = sum(item.bearish for item in factors)
    neutral = sum(item.neutral for item in factors)
    unavailable = sum(item.unavailable for item in factors)
    evaluated = ELIGIBLE_CAPACITY - unavailable
    coverage = int((Decimal(evaluated) / Decimal(ELIGIBLE_CAPACITY) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

    if unavailable_fields:
        factors = _apply_effects(factors, Direction.INCOMPLETE)
        missing = ", ".join(unavailable_fields)
        return EvidenceSnapshot(
            instrument_id=obs.instrument_id,
            symbol_at_observation=obs.symbol_at_observation,
            market_date=obs.market_date,
            as_of=obs.as_of,
            observation_kind=obs.observation_kind,
            status="incomplete",
            direction=Direction.INCOMPLETE,
            classification=Classification.INCOMPLETE,
            alignment_score=None,
            alignment_unrounded=None,
            alignment_band=None,
            coverage=coverage,
            eligible_capacity=ELIGIBLE_CAPACITY,
            evaluated_capacity=evaluated,
            bullish_total=bullish,
            bearish_total=bearish,
            neutral_total=neutral,
            unavailable_total=unavailable,
            factors=factors,
            principal_support=None,
            principal_contradiction=None,
            summary=f"Required Technical Evidence was unavailable ({missing}); no score or directional classification was produced.",
            invalidation_conditions=[],
            source_version=obs.source_version,
            source_checksum=obs.source_checksum,
        )

    direction, classification = _direction_and_classification(bullish, bearish, neutral)
    dominant = max(bullish, bearish) if direction in (Direction.BULLISH, Direction.BEARISH) else max(bullish, bearish)
    unrounded = Decimal(dominant) / Decimal(ELIGIBLE_CAPACITY) * 100
    score = int(unrounded.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    factors = _apply_effects(factors, direction)
    support = _principal(factors, direction, True)
    contradiction = _principal(factors, direction, False)

    if direction in (Direction.BULLISH, Direction.BEARISH):
        summary = f"Technical evidence has {direction.value} {_band(score).replace('_', ' ')} at {score}/100 with {coverage}% coverage."
        invalidation = [f"The {direction.value} thesis is invalidated if a later comparable observation no longer meets the ruleset's {direction.value} direction threshold."]
    elif direction == Direction.MIXED:
        summary = f"Technical evidence is mixed: bullish ({bullish}) and bearish ({bearish}) contributions do not establish a sufficient directional lead."
        invalidation = []
    else:
        summary = f"Technical evidence is neutral: neither bullish ({bullish}) nor bearish ({bearish}) evidence reaches the materiality threshold."
        invalidation = []

    return EvidenceSnapshot(
        instrument_id=obs.instrument_id,
        symbol_at_observation=obs.symbol_at_observation,
        market_date=obs.market_date,
        as_of=obs.as_of,
        observation_kind=obs.observation_kind,
        status="complete",
        direction=direction,
        classification=classification,
        alignment_score=score,
        alignment_unrounded=str(unrounded),
        alignment_band=_band(score),
        coverage=coverage,
        eligible_capacity=ELIGIBLE_CAPACITY,
        evaluated_capacity=evaluated,
        bullish_total=bullish,
        bearish_total=bearish,
        neutral_total=neutral,
        unavailable_total=unavailable,
        factors=factors,
        principal_support=support,
        principal_contradiction=contradiction,
        summary=summary,
        invalidation_conditions=invalidation,
        source_version=obs.source_version,
        source_checksum=obs.source_checksum,
    )
