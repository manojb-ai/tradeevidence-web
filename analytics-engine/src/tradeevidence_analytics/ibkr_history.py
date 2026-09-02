"""Read-only IBKR acquisition adapter for canonical daily-history CSV files.

This module is deliberately outside the evidence calculation path.  It requests
only contract descriptions and historical bars and never requests account,
portfolio, position, execution, or order information.
"""

from __future__ import annotations

import csv
import threading
import time
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Callable, Iterable


CONTEXT_SYMBOLS = (
    "SPY", "QQQ", "IWM", "XLB", "XLC", "XLE", "XLF", "XLI", "XLK",
    "XLP", "XLRE", "XLU", "XLV", "XLY",
)


@dataclass(frozen=True)
class DailyBar:
    symbol: str
    market_date: date
    open: float
    high: float
    low: float
    close: float
    volume: int


def parse_ibkr_daily_date(value: str) -> date:
    """Parse the compact date returned for an IBKR daily bar."""
    return datetime.strptime(value.strip(), "%Y%m%d").date()


def combine_history(
    symbol: str,
    trades: Iterable[DailyBar],
    adjusted: Iterable[DailyBar],
    *,
    through: date,
) -> list[dict[str, object]]:
    """Join unadjusted trade bars to dividend/split-adjusted closes by date."""
    adjusted_by_date = {bar.market_date: bar.close for bar in adjusted}
    rows: list[dict[str, object]] = []
    for bar in sorted(trades, key=lambda item: item.market_date):
        if bar.market_date > through:
            continue
        adjusted_close = adjusted_by_date.get(bar.market_date)
        if adjusted_close is None:
            continue
        rows.append(
            {
                "Symbol": symbol,
                "Date": bar.market_date.isoformat(),
                "Open": bar.open,
                "High": bar.high,
                "Low": bar.low,
                "Close": bar.close,
                "AdjustedClose": adjusted_close,
                "Volume": bar.volume,
            }
        )
    return rows


def write_context_history(path: Path, rows: Iterable[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    headers = ("Symbol", "Date", "Open", "High", "Low", "Close", "AdjustedClose", "Volume")
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


class IbkrHistoricalDataError(RuntimeError):
    """Raised when a historical-data request cannot be completed safely."""


def fetch_context_history(
    *,
    host: str,
    port: int,
    client_id: int,
    symbols: Iterable[str],
    through: date,
    duration: str = "3 Y",
    timeout_seconds: float = 45.0,
    request_pause_seconds: float = 0.25,
    progress: Callable[[str], None] = print,
) -> list[dict[str, object]]:
    """Fetch regular-session daily bars through the requested completed date."""
    if host not in {"127.0.0.1", "localhost", "::1"}:
        raise ValueError("This founder tool permits local TWS connections only.")

    try:
        from ibapi.client import EClient
        from ibapi.contract import Contract
        from ibapi.wrapper import EWrapper
    except ImportError as exc:
        raise IbkrHistoricalDataError(
            "The IBKR Python API is not installed. Install the official TWS API "
            "Python client, then run this command again."
        ) from exc

    class _HistoricalClient(EWrapper, EClient):
        def __init__(self) -> None:
            EClient.__init__(self, self)
            self.connected = threading.Event()
            self.finished: dict[int, threading.Event] = {}
            self.bars: dict[int, list[object]] = {}
            self.failures: dict[int, str] = {}

        def nextValidId(self, orderId: int) -> None:  # noqa: N802 - IBKR callback
            # IBKR sends this connection-ready identifier automatically.  It is
            # intentionally discarded; this tool never places orders.
            self.connected.set()

        def managedAccounts(self, accountsList: str) -> None:  # noqa: N802
            # TWS may push this automatically at connection time.  Never retain,
            # display, or use brokerage-account identifiers.
            return None

        def historicalData(self, reqId: int, bar: object) -> None:  # noqa: N802
            self.bars.setdefault(reqId, []).append(bar)

        def historicalDataEnd(self, reqId: int, start: str, end: str) -> None:  # noqa: N802
            self.finished.setdefault(reqId, threading.Event()).set()

        def error(self, reqId: int, errorCode: int, errorString: str, *args: object) -> None:
            # 2104/2106/2158 are informational farm-status messages.
            if errorCode in {2104, 2106, 2158}:
                return
            if reqId >= 0:
                self.failures[reqId] = f"IBKR error {errorCode}: {errorString}"
                self.finished.setdefault(reqId, threading.Event()).set()

    client = _HistoricalClient()
    client.connect(host, port, clientId=client_id)
    network_thread = threading.Thread(target=client.run, name="ibkr-reader", daemon=True)
    network_thread.start()

    if not client.connected.wait(timeout_seconds):
        client.disconnect()
        raise IbkrHistoricalDataError(
            f"TWS did not confirm the API connection at {host}:{port}."
        )

    end_time = through.strftime("%Y%m%d") + " 23:59:59 US/Eastern"
    request_id = 1000

    def request(symbol: str, data_type: str) -> list[DailyBar]:
        nonlocal request_id
        request_id += 1
        current_id = request_id
        contract = Contract()
        contract.symbol = symbol
        contract.secType = "STK"
        contract.exchange = "SMART"
        contract.currency = "USD"
        client.finished[current_id] = threading.Event()
        client.bars[current_id] = []
        # IBKR rejects an explicit end date for ADJUSTED_LAST. Request its
        # latest duration window and discard dates after ``through`` during the
        # deterministic join below.
        request_end = "" if data_type == "ADJUSTED_LAST" else end_time
        client.reqHistoricalData(
            current_id, contract, request_end, duration, "1 day", data_type,
            1, 1, False, [],
        )
        if not client.finished[current_id].wait(timeout_seconds):
            client.cancelHistoricalData(current_id)
            raise IbkrHistoricalDataError(
                f"Timed out requesting {data_type} daily bars for {symbol}."
            )
        if current_id in client.failures:
            raise IbkrHistoricalDataError(
                f"{symbol} {data_type}: {client.failures[current_id]}"
            )
        result = [
            DailyBar(
                symbol=symbol,
                market_date=parse_ibkr_daily_date(str(bar.date)),
                open=float(bar.open),
                high=float(bar.high),
                low=float(bar.low),
                close=float(bar.close),
                # In the negotiated IBKR API compatibility mode, U.S. equity
                # volume is returned in round lots of 100 shares.
                volume=int(float(str(bar.volume)) * 100),
            )
            for bar in client.bars[current_id]
        ]
        time.sleep(request_pause_seconds)
        return result

    rows: list[dict[str, object]] = []
    try:
        for symbol in symbols:
            progress(f"Fetching {symbol}: unadjusted and adjusted daily history...")
            trades = request(symbol, "TRADES")
            adjusted = request(symbol, "ADJUSTED_LAST")
            combined = combine_history(symbol, trades, adjusted, through=through)
            if not combined:
                raise IbkrHistoricalDataError(
                    f"IBKR returned no joinable completed daily bars for {symbol}."
                )
            rows.extend(combined)
    finally:
        client.disconnect()
        network_thread.join(timeout=2.0)

    return rows
