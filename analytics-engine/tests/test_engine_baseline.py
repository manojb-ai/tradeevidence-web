from __future__ import annotations

import json
from pathlib import Path
import sys
import tempfile
import unittest


ENGINE_ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = ENGINE_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from tradeevidence_analytics.stellar_data_engine import (  # noqa: E402
    directional_strength,
    load_trade_rows,
    market_location,
    option_premium,
    score_rows,
)
from tradeevidence_analytics.stellar_data_reporter import generate_fast_report  # noqa: E402


CSV_HEADER = (
    "Symbol,Last,StellarEvDaily,StellerEvWeekly,StellarEvMonthly,"
    "StellarOrDaily,StellerOrWeekly,ADX,Impl Vol,EMA21,SMA50,SMA200\n"
)


class BaselineClassificationTests(unittest.TestCase):
    def _score_csv(self, rows: str):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "watchlist.csv"
            path.write_text(CSV_HEADER + rows, encoding="utf-8")
            return score_rows(load_trade_rows(path))

    def test_constructive_alignment_produces_yes(self):
        results = self._score_csv(
            "TEST,100,BUY-CD,BUY-CD,BUY-CD,BUY-WATCH,BUY,32,35,99,95,80\n"
        )

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].verdict, "YES")
        self.assertGreaterEqual(results[0].score, 62)
        self.assertTrue(results[0].reasoning)
        self.assertEqual(len(results[0].strategies), 9)

    def test_bearish_weekly_context_produces_no(self):
        results = self._score_csv(
            "TEST,90,NO-BO,NO-BO,NO-BO,SHORT,SHORT,12,65,100,105,110\n"
        )

        self.assertEqual(results[0].verdict, "NO")
        self.assertTrue(any("Weekly trend" in risk for risk in results[0].risk_flags))

    def test_missing_values_are_reported_not_crashed(self):
        results = self._score_csv(
            "TEST,loading,loading,loading,loading,loading,loading,loading,loading,loading,loading,loading\n"
        )

        self.assertEqual(results[0].verdict, "NO")
        self.assertTrue(any("unavailable/loading" in risk for risk in results[0].risk_flags))


class BaselineBoundaryTests(unittest.TestCase):
    def test_entry_zone_boundaries(self):
        self.assertEqual(market_location(-6)[1], "below_21")
        self.assertEqual(market_location(-3)[1], "pullback_below")
        self.assertEqual(market_location(0)[1], "near_21")
        self.assertEqual(market_location(4)[1], "healthy_extension")
        self.assertEqual(market_location(7)[1], "extended")
        self.assertEqual(market_location(11)[1], "very_extended")

    def test_directional_strength_boundaries(self):
        self.assertEqual(directional_strength(14.99)[1], "weak")
        self.assertEqual(directional_strength(15)[1], "emerging")
        self.assertEqual(directional_strength(20)[1], "healthy")
        self.assertEqual(directional_strength(30)[1], "strong")
        self.assertEqual(directional_strength(40)[1], "very_strong")

    def test_implied_volatility_boundaries(self):
        self.assertEqual(option_premium(19.99)[1], "very_low")
        self.assertEqual(option_premium(20)[1], "low")
        self.assertEqual(option_premium(30)[1], "medium")
        self.assertEqual(option_premium(40)[1], "high")
        self.assertEqual(option_premium(60)[1], "very_high")


class BaselineOutputTests(unittest.TestCase):
    def test_json_and_html_share_one_result_set(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            csv_path = root / "watchlist.csv"
            csv_path.write_text(
                CSV_HEADER
                + "ONE,100,BUY-CD,BUY-CD,BUY-CD,BUY-WATCH,BUY,32,35,99,95,80\n"
                + "TWO,90,NO-BO,NO-BO,NO-BO,SHORT,SHORT,12,65,100,105,110\n",
                encoding="utf-8",
            )
            results = score_rows(load_trade_rows(csv_path))
            html_path, json_path = generate_fast_report(results, root / "output", csv_path.name)
            payload = json.loads(json_path.read_text(encoding="utf-8"))

            self.assertTrue(html_path.exists())
            self.assertEqual(payload["summary"]["rows_scored"], 2)
            self.assertEqual(len(payload["results"]), 2)
            self.assertEqual(
                {item["symbol"] for item in payload["results"]},
                {"ONE", "TWO"},
            )


if __name__ == "__main__":
    unittest.main()
