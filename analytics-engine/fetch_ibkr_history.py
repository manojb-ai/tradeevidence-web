"""Fetch the approved context-history CSV from local IBKR TWS."""

from __future__ import annotations

import argparse
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from tradeevidence_analytics.ibkr_history import (  # noqa: E402
    CONTEXT_SYMBOLS,
    IbkrHistoricalDataError,
    fetch_context_history,
    write_context_history,
)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Read completed daily market history from local TWS into the approved MVP CSV contract."
    )
    parser.add_argument("--through", required=True, type=date.fromisoformat, help="Last completed market date (YYYY-MM-DD).")
    parser.add_argument("--host", default="127.0.0.1", help="Local TWS host; remote hosts are rejected.")
    parser.add_argument("--port", default=7496, type=int, help="TWS socket port (live TWS default: 7496).")
    parser.add_argument("--client-id", default=71, type=int, help="A unique read-only API client ID.")
    parser.add_argument("--duration", default="3 Y", help="IBKR history duration; 3 Y provides warmup around the two-year target range.")
    parser.add_argument(
        "--symbols",
        nargs="+",
        default=list(CONTEXT_SYMBOLS),
        help="Symbols to fetch; defaults to the 14 approved context ETFs.",
    )
    parser.add_argument("--output", type=Path, help="CSV path; defaults to the approved dated input folder.")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    symbols = [symbol.strip().upper() for symbol in args.symbols]
    unknown = sorted(set(symbols) - set(CONTEXT_SYMBOLS))
    if unknown:
        print("Only the approved context symbols are allowed: " + ", ".join(unknown), file=sys.stderr)
        return 2
    output = args.output or (
        ROOT / "input" / args.through.isoformat() / f"{args.through.isoformat()}-context-daily-history.csv"
    )
    try:
        rows = fetch_context_history(
            host=args.host,
            port=args.port,
            client_id=args.client_id,
            symbols=symbols,
            through=args.through,
            duration=args.duration,
        )
        write_context_history(output, rows)
    except (IbkrHistoricalDataError, ValueError) as exc:
        print(f"Acquisition failed: {exc}", file=sys.stderr)
        return 1
    print(f"Wrote {len(rows)} completed daily bars to {output.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
