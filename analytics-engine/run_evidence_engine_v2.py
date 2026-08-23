"""Run the direction-aware Evidence Engine v2 candidate on a TOS CSV export."""

from __future__ import annotations

import argparse
from datetime import date, datetime
import os
from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parent
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from tradeevidence_analytics.evidence_engine_v2 import evaluate_observation
from tradeevidence_analytics.evidence_reporter_v2 import generate_evidence_report
from tradeevidence_analytics.tos_adapter_v2 import load_tos_observations


def _csv_path(value: str) -> Path:
    path = Path(value.strip().strip('"')).expanduser().resolve()
    if not path.is_file():
        raise argparse.ArgumentTypeError(f"CSV file does not exist: {path}")
    if path.suffix.lower() != ".csv":
        raise argparse.ArgumentTypeError(f"Expected a .csv file: {path}")
    return path


def _market_date(value: str) -> str:
    try:
        return date.fromisoformat(value.strip()).isoformat()
    except ValueError as error:
        raise argparse.ArgumentTypeError("Market date must use YYYY-MM-DD format") from error


def _as_of(value: str) -> str:
    candidate = value.strip()
    try:
        datetime.fromisoformat(candidate.replace("Z", "+00:00"))
    except ValueError as error:
        raise argparse.ArgumentTypeError("As-of must be an ISO 8601 timestamp") from error
    return candidate


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="TradeEvidence direction-aware Technical Evidence candidate")
    parser.add_argument("data_file", nargs="?", type=_csv_path, help="Thinkorswim CSV export")
    parser.add_argument("--data-file", dest="named_data_file", type=_csv_path, help="Thinkorswim CSV export")
    parser.add_argument("--market-date", type=_market_date, help="Trading-session observation date (YYYY-MM-DD)")
    parser.add_argument("--as-of", type=_as_of, help="Observation timestamp; defaults to MARKET_DATE at 20:00:00Z")
    parser.add_argument("--output-dir", type=Path, help="Local output directory; defaults beneath analytics-engine/output")
    parser.add_argument("--limit", type=int, default=None, help="Optional row limit for local testing")
    parser.add_argument("--open-report", action="store_true", help="Open the generated HTML report on Windows")
    return parser


def _resolve_run_inputs(args: argparse.Namespace, parser: argparse.ArgumentParser) -> tuple[Path, str, str, Path]:
    if args.data_file and args.named_data_file:
        parser.error("Provide the CSV either positionally or with --data-file, not both")

    data_file = args.data_file or args.named_data_file
    market_date = args.market_date
    interactive = sys.stdin.isatty()

    if data_file is None and interactive:
        try:
            data_file = _csv_path(input("Thinkorswim CSV path: "))
        except argparse.ArgumentTypeError as error:
            parser.error(str(error))
    if market_date is None and interactive:
        print("Use the trading-session date represented by the data, not necessarily the export date.")
        try:
            market_date = _market_date(input("Market date (YYYY-MM-DD): "))
        except argparse.ArgumentTypeError as error:
            parser.error(str(error))

    if data_file is None:
        parser.error("A CSV is required. Pass its path or run interactively from a terminal.")
    if market_date is None:
        parser.error("--market-date is required in non-interactive mode")
    if args.limit is not None and args.limit <= 0:
        parser.error("--limit must be greater than zero")

    as_of = args.as_of or f"{market_date}T20:00:00Z"
    output_dir = args.output_dir or (PROJECT_ROOT / "output" / data_file.stem)
    return data_file, market_date, as_of, output_dir.resolve()


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()
    data_file, market_date, as_of, output_dir = _resolve_run_inputs(args, parser)

    observations = load_tos_observations(data_file, market_date=market_date, as_of=as_of)
    if args.limit is not None:
        observations = observations[: args.limit]
    snapshots = [evaluate_observation(item) for item in observations]
    snapshots.sort(key=lambda item: (item.classification.value, -(item.alignment_score or -1), item.symbol_at_observation))
    html_path, json_path = generate_evidence_report(snapshots, output_dir, data_file.name)

    from collections import Counter

    counts = Counter(item.classification.value for item in snapshots)
    print("=" * 68)
    print("TradeEvidence Evidence Engine v2 Candidate")
    print("Provisional rules: not predictive or historically validated")
    print("=" * 68)
    print(f"Rows evaluated: {len(snapshots)}")
    for key, value in sorted(counts.items()):
        print(f"{key}: {value}")
    print(f"Market date: {market_date}")
    print(f"HTML report: {html_path.resolve()}")
    print(f"JSON artifact: {json_path.resolve()}")

    if args.open_report:
        if os.name != "nt":
            parser.error("--open-report is currently supported only on Windows")
        os.startfile(html_path.resolve())


if __name__ == "__main__":
    main()
