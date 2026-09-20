import csv
import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from tradeevidence_analytics.ibkr_history import (  # noqa: E402
    DailyBar,
    combine_history,
    parse_ibkr_daily_date,
    write_context_history,
)


class IbkrHistoryTests(unittest.TestCase):
    def test_parse_ibkr_daily_date(self):
        self.assertEqual(parse_ibkr_daily_date("20260821"), date(2026, 8, 21))

    def test_combines_unadjusted_close_and_adjusted_close(self):
        trades = [DailyBar("SPY", date(2026, 8, 21), 760, 765, 758, 761, 12_345)]
        adjusted = [DailyBar("SPY", date(2026, 8, 21), 759, 764, 757, 760.5, 12_345)]
        rows = combine_history("SPY", trades, adjusted, through=date(2026, 8, 21))
        self.assertEqual(rows[0]["Close"], 761)
        self.assertEqual(rows[0]["AdjustedClose"], 760.5)

    def test_excludes_incomplete_future_bar_and_unmatched_dates(self):
        trades = [
            DailyBar("SPY", date(2026, 8, 21), 1, 2, 1, 2, 10),
            DailyBar("SPY", date(2026, 8, 24), 2, 3, 2, 3, 20),
        ]
        adjusted = [DailyBar("SPY", date(2026, 8, 21), 1, 2, 1, 1.9, 10)]
        rows = combine_history("SPY", trades, adjusted, through=date(2026, 8, 21))
        self.assertEqual([row["Date"] for row in rows], ["2026-08-21"])

    def test_writes_exact_contract_header(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "history.csv"
            write_context_history(path, [])
            with path.open(newline="", encoding="utf-8") as handle:
                self.assertEqual(
                    next(csv.reader(handle)),
                    ["Symbol", "Date", "Open", "High", "Low", "Close", "AdjustedClose", "Volume"],
                )


if __name__ == "__main__":
    unittest.main()
