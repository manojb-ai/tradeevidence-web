from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path
import tempfile
import unittest


ENGINE_ROOT = Path(__file__).resolve().parents[1]
RUNNER_PATH = ENGINE_ROOT / "run_evidence_engine_v2.py"
SPEC = importlib.util.spec_from_file_location("run_evidence_engine_v2", RUNNER_PATH)
RUNNER = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(RUNNER)


class OnDemandRunnerTests(unittest.TestCase):
    def test_csv_path_accepts_quoted_existing_csv(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "watchlist.csv"
            path.write_text("Symbol,Last\nTEST,1\n", encoding="utf-8")
            self.assertEqual(RUNNER._csv_path(f'"{path}"'), path.resolve())

    def test_csv_path_rejects_missing_file(self):
        with self.assertRaises(argparse.ArgumentTypeError):
            RUNNER._csv_path("missing.csv")

    def test_market_date_requires_iso_calendar_date(self):
        self.assertEqual(RUNNER._market_date("2026-08-21"), "2026-08-21")
        with self.assertRaises(argparse.ArgumentTypeError):
            RUNNER._market_date("08/21/2026")

    def test_default_output_is_under_engine_output(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "weekly-review.csv"
            path.write_text("Symbol,Last\nTEST,1\n", encoding="utf-8")
            parser = RUNNER._build_parser()
            args = parser.parse_args([str(path), "--market-date", "2026-08-21"])
            data_file, market_date, as_of, output_dir = RUNNER._resolve_run_inputs(args, parser)
            self.assertEqual(data_file, path.resolve())
            self.assertEqual(market_date, "2026-08-21")
            self.assertEqual(as_of, "2026-08-21T20:00:00Z")
            self.assertEqual(output_dir, (ENGINE_ROOT / "output" / "weekly-review").resolve())


if __name__ == "__main__":
    unittest.main()
