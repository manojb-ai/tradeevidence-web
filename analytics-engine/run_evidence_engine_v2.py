"""Run the direction-aware Evidence Engine v2 candidate on a TOS CSV export."""

from __future__ import annotations

import argparse
from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parent
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from tradeevidence_analytics.evidence_engine_v2 import evaluate_observation
from tradeevidence_analytics.evidence_reporter_v2 import generate_evidence_report
from tradeevidence_analytics.tos_adapter_v2 import load_tos_observations


def main() -> None:
    parser = argparse.ArgumentParser(description="TradeEvidence direction-aware Technical Evidence candidate")
    parser.add_argument("--data-file", required=True, help="Thinkorswim CSV export")
    parser.add_argument("--market-date", required=True, help="Market observation date (YYYY-MM-DD)")
    parser.add_argument("--as-of", help="Observation timestamp; defaults to MARKET_DATE at 20:00:00Z")
    parser.add_argument("--output-dir", default="output/evidence-v2", help="Local output directory")
    parser.add_argument("--limit", type=int, default=None, help="Optional row limit for local testing")
    args = parser.parse_args()

    data_file = Path(args.data_file)
    as_of = args.as_of or f"{args.market_date}T20:00:00Z"
    observations = load_tos_observations(data_file, market_date=args.market_date, as_of=as_of)
    if args.limit is not None:
        observations = observations[: args.limit]
    snapshots = [evaluate_observation(item) for item in observations]
    snapshots.sort(key=lambda item: (item.classification.value, -(item.alignment_score or -1), item.symbol_at_observation))
    html_path, json_path = generate_evidence_report(snapshots, Path(args.output_dir), data_file.name)

    from collections import Counter

    counts = Counter(item.classification.value for item in snapshots)
    print("=" * 68)
    print("TradeEvidence Evidence Engine v2 Candidate")
    print("Provisional rules: not predictive or historically validated")
    print("=" * 68)
    print(f"Rows evaluated: {len(snapshots)}")
    for key, value in sorted(counts.items()):
        print(f"{key}: {value}")
    print(f"HTML report: {html_path}")
    print(f"JSON artifact: {json_path}")


if __name__ == "__main__":
    main()
