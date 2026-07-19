"""
run_data_agent.py
-----------------
Fast TradeEvidence primary engine.

Reads a Thinkorswim CSV/watchlist export with structured columns and produces:
- Website-ready HTML report
- JSON sidecar for web ingestion

No TOS navigation, no screenshots, no Qwen vision.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parent
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from tradeevidence_analytics.stellar_data_engine import load_trade_rows, score_rows
from tradeevidence_analytics.stellar_data_reporter import generate_fast_report


def main() -> None:
    parser = argparse.ArgumentParser(description="TradeEvidence fast structured-data report engine")
    parser.add_argument("--data-file", required=True, help="CSV/watchlist export file")
    parser.add_argument("--output-dir", default="output", help="Output folder")
    parser.add_argument("--limit", type=int, default=None, help="Optional number of rows to process for testing")
    args = parser.parse_args()

    data_file = Path(args.data_file)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    rows = load_trade_rows(data_file)
    if args.limit:
        rows = rows[: args.limit]

    results = score_rows(rows)
    report_path, json_path = generate_fast_report(results, output_dir, source_file=data_file.name)

    yes = [r for r in results if r.verdict == "YES"]
    watch = [r for r in results if r.verdict == "WATCH"]
    no = [r for r in results if r.verdict == "NO"]

    print("=" * 60)
    print("TradeEvidence Fast Primary Engine")
    print("=" * 60)
    print(f"Rows scored: {len(results)}")
    print(f"YES: {len(yes)}")
    print(f"WATCH: {len(watch)}")
    print(f"NO: {len(no)}")
    print(f"HTML report: {report_path}")
    print(f"JSON sidecar: {json_path}")

    try:
        import os
        os.startfile(str(report_path))
    except Exception:
        pass


if __name__ == "__main__":
    main()
