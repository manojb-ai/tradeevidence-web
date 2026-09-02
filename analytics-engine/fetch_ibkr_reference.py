"""Discover instrument and raw classification reference data from local TWS."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from tradeevidence_analytics.ibkr_reference import (  # noqa: E402
    IbkrReferenceError,
    fetch_reference_discovery,
    read_unique_symbols,
    write_discovery,
    write_instrument_reference,
)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Read contract reference data from local TWS without account access.")
    parser.add_argument("--symbols-file", required=True, type=Path, help="Thinkorswim symbol-evidence CSV.")
    parser.add_argument("--market-date", required=True, help="Acquisition market date (YYYY-MM-DD).")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=7496, type=int)
    parser.add_argument("--client-id", default=72, type=int)
    parser.add_argument("--limit", type=int, help="Resolve only the first N sorted symbols for a smoke test.")
    parser.add_argument("--output-dir", type=Path, help="Defaults to input/<market-date>.")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    if not args.symbols_file.is_file():
        print(f"Symbols file does not exist: {args.symbols_file}", file=sys.stderr)
        return 2
    symbols = read_unique_symbols(args.symbols_file)
    if args.limit is not None:
        if args.limit < 1:
            print("--limit must be positive.", file=sys.stderr)
            return 2
        symbols = symbols[: args.limit]
    output_dir = args.output_dir or ROOT / "input" / args.market_date
    discovery_path = output_dir / f"{args.market_date}-ibkr-reference-discovery.csv"
    instrument_path = output_dir / f"{args.market_date}-instrument-reference.csv"

    def checkpoint(rows):
        write_discovery(discovery_path, rows)
        write_instrument_reference(instrument_path, rows)

    try:
        rows = fetch_reference_discovery(
            host=args.host,
            port=args.port,
            client_id=args.client_id,
            symbols=symbols,
            checkpoint=checkpoint,
        )
    except (IbkrReferenceError, ValueError) as exc:
        print(f"Reference acquisition failed: {exc}", file=sys.stderr)
        return 1
    resolved = sum(row.resolution_status == "resolved" for row in rows)
    incomplete_types = sum(
        row.resolution_status == "resolved" and not row.ibkr_stock_type for row in rows
    )
    print(f"Resolved {resolved} of {len(rows)} symbols.")
    print(f"Resolved rows missing IBKR stock type: {incomplete_types}")
    print(f"Instrument reference: {instrument_path.resolve()}")
    print(f"Raw discovery: {discovery_path.resolve()}")
    return 0 if resolved == len(rows) else 3


if __name__ == "__main__":
    raise SystemExit(main())
