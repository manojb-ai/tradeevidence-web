from __future__ import annotations

from decimal import Decimal
from pathlib import Path
import sys
import unittest


ENGINE_ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = ENGINE_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from tradeevidence_analytics.evidence_engine_v2 import evaluate_observation  # noqa: E402
from tradeevidence_analytics.evidence_models import (  # noqa: E402
    Classification,
    Direction,
    NormalizedTechnicalObservation,
)


def observation(**changes) -> NormalizedTechnicalObservation:
    values = dict(
        instrument_id="instrument-test",
        symbol_at_observation="TEST",
        market_date="2026-08-21",
        as_of="2026-08-21T20:00:00Z",
        observation_kind="regular_session_close",
        source_version="fixture-v1",
        source_checksum="fixture-checksum",
        close=Decimal("100"),
        ema21=Decimal("95"),
        sma50=Decimal("90"),
        sma200=Decimal("80"),
        adx14=Decimal("32"),
        daily_setup="positive_prime",
        weekly_setup="positive_prime",
        daily_momentum="bullish",
        weekly_trend="bullish",
        monthly_context="neutral",
        unavailable_reasons={},
    )
    values.update(changes)
    return NormalizedTechnicalObservation(**values)


class DirectionAwareEvidenceTests(unittest.TestCase):
    def test_strong_bullish_alignment(self):
        result = evaluate_observation(observation())
        self.assertEqual(result.direction, Direction.BULLISH)
        self.assertEqual(result.classification, Classification.BULLISH)
        self.assertEqual(result.alignment_score, 96)

    def test_strong_bearish_alignment(self):
        result = evaluate_observation(
            observation(
                close=Decimal("80"),
                ema21=Decimal("85"),
                sma50=Decimal("95"),
                sma200=Decimal("110"),
                daily_setup="no_active_setup",
                daily_momentum="bearish",
                weekly_trend="bearish",
            )
        )
        self.assertEqual(result.direction, Direction.BEARISH)
        self.assertEqual(result.classification, Classification.BEARISH)
        self.assertEqual(result.alignment_score, 76)

    def test_bullish_watch_is_distinct(self):
        result = evaluate_observation(
            observation(
                daily_setup="positive_developing",
                daily_momentum="bullish_improving",
                weekly_trend="neutral",
                close=Decimal("100"),
                ema21=Decimal("95"),
                sma50=Decimal("90"),
                sma200=Decimal("110"),
                adx14=Decimal("17"),
            )
        )
        self.assertEqual(result.direction, Direction.BULLISH)
        self.assertEqual(result.classification, Classification.BULLISH_WATCH)

    def test_bearish_watch_is_distinct(self):
        result = evaluate_observation(
            observation(
                daily_setup="no_active_setup",
                daily_momentum="bearish",
                weekly_trend="bullish_improving",
                close=Decimal("90"),
                ema21=Decimal("95"),
                sma50=Decimal("100"),
                sma200=Decimal("80"),
                adx14=Decimal("25"),
            )
        )
        self.assertEqual(result.direction, Direction.BEARISH)
        self.assertEqual(result.classification, Classification.BEARISH_WATCH)

    def test_mixed_direction_is_not_forced(self):
        result = evaluate_observation(
            observation(
                daily_setup="positive_developing",
                daily_momentum="bullish_improving",
                weekly_trend="bearish",
                close=Decimal("90"),
                ema21=Decimal("95"),
                sma50=Decimal("100"),
                sma200=Decimal("80"),
                adx14=Decimal("25"),
            )
        )
        self.assertEqual(result.direction, Direction.MIXED)
        self.assertEqual(result.classification, Classification.MIXED)

    def test_neutral_has_no_forced_direction(self):
        result = evaluate_observation(
            observation(
                daily_setup="no_active_setup",
                daily_momentum="neutral",
                weekly_trend="neutral",
                close=Decimal("100"),
                ema21=Decimal("100"),
                sma50=Decimal("100"),
                sma200=Decimal("100"),
                adx14=Decimal("10"),
            )
        )
        self.assertEqual(result.direction, Direction.NEUTRAL)
        self.assertEqual(result.classification, Classification.NEUTRAL)

    def test_missing_required_input_is_incomplete_without_score(self):
        result = evaluate_observation(
            observation(weekly_trend="unknown", unavailable_reasons={"weekly_trend": "provider_loading"})
        )
        self.assertEqual(result.direction, Direction.INCOMPLETE)
        self.assertEqual(result.classification, Classification.INCOMPLETE)
        self.assertIsNone(result.alignment_score)
        self.assertLess(result.coverage, 100)

    def test_factor_and_snapshot_ledgers_reconcile(self):
        result = evaluate_observation(observation())
        self.assertEqual(sum(item.capacity for item in result.factors), 100)
        self.assertTrue(all(item.allocated_capacity == item.capacity for item in result.factors))
        self.assertEqual(
            result.bullish_total + result.bearish_total + result.neutral_total + result.unavailable_total,
            result.eligible_capacity,
        )

    def test_identical_input_is_deterministic(self):
        first = evaluate_observation(observation()).to_json()
        second = evaluate_observation(observation()).to_json()
        self.assertEqual(first, second)


if __name__ == "__main__":
    unittest.main()
