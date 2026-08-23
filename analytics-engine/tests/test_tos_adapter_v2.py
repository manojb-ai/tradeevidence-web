from __future__ import annotations

from pathlib import Path
import sys
import tempfile
import unittest


ENGINE_ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = ENGINE_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from tradeevidence_analytics.tos_adapter_v2 import load_tos_observations  # noqa: E402


HEADER = (
    "Symbol,Last,StellarEvDaily,StellerEvWeekly,StellarEvMonthly,"
    "StellarOrDaily,StellerOrWeekly,ADX,Impl Vol,SMA200,SMA50,EMA21\n"
)


class TosV2AdapterTests(unittest.TestCase):
    def _load(self, rows: str):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "watchlist.csv"
            path.write_text(HEADER + rows, encoding="utf-8")
            return load_tos_observations(
                path,
                market_date="2026-08-21",
                as_of="2026-08-21T20:00:00Z",
            )

    def test_maps_bidirectional_setup_and_orbit_states(self):
        observations = self._load(
            "BULL,100,BULL-CD,BULL-BO,NEUTRAL-BO,BULL,BULL-WATCH,25,30%,80,90,95\n"
            "BEAR,80,BEAR-CD,BEAR-WATCH-CD,BEAR-BO,BEAR,BEAR-WATCH,30,40%,110,95,85\n"
        )
        self.assertEqual(observations[0].daily_setup, "positive_prime")
        self.assertEqual(observations[0].daily_momentum, "bullish")
        self.assertEqual(observations[0].weekly_trend, "bullish_weakening")
        self.assertEqual(observations[1].daily_setup, "negative_prime")
        self.assertEqual(observations[1].weekly_setup, "negative_developing")
        self.assertEqual(observations[1].daily_momentum, "bearish")
        self.assertEqual(observations[1].weekly_trend, "bearish_weakening")

    def test_rejects_duplicate_symbols(self):
        with self.assertRaisesRegex(ValueError, "Duplicate symbols"):
            self._load(
                "DUP,100,BULL-CD,BULL-BO,BULL-BO,BULL,BULL,25,30%,80,90,95\n"
                "DUP,100,BULL-CD,BULL-BO,BULL-BO,BULL,BULL,25,30%,80,90,95\n"
            )


if __name__ == "__main__":
    unittest.main()
