"""Read-only IBKR contract-reference discovery for founder market-data inputs."""

from __future__ import annotations

import csv
import threading
import time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Callable, Iterable


LOCAL_HOSTS = {"127.0.0.1", "localhost", "::1"}


@dataclass(frozen=True)
class ReferenceDiscovery:
    symbol: str
    company_name: str = ""
    primary_exchange: str = ""
    currency: str = ""
    ibkr_security_type: str = ""
    ibkr_stock_type: str = ""
    ibkr_category: str = ""
    ibkr_subcategory: str = ""
    ibkr_industry: str = ""
    con_id: str = ""
    resolution_status: str = "unresolved"
    message: str = ""


def read_unique_symbols(path: Path) -> list[str]:
    """Read unique symbols from a CSV, tolerating a Thinkorswim preamble."""
    lines = path.read_text(encoding="utf-8-sig", errors="replace").splitlines()
    header_index = next(
        (index for index, line in enumerate(lines) if line.lstrip().startswith("Symbol,")),
        None,
    )
    if header_index is None:
        raise ValueError("Could not find a CSV header beginning with Symbol,")
    rows = csv.DictReader(lines[header_index:])
    symbols = {
        (row.get("Symbol") or "").strip().upper()
        for row in rows
        if (row.get("Symbol") or "").strip()
    }
    return sorted(symbols)


def normalize_security_type(stock_type: str) -> str:
    """Map only explicit IBKR stock types approved by the MVP contract."""
    normalized = stock_type.strip().upper()
    if normalized == "ETF":
        return "ETF"
    if normalized in {"COMMON", "COMMON STOCK", "REIT"}:
        return "COMMON_STOCK"
    return ""


def to_ibkr_symbol(source_symbol: str) -> str:
    """Translate Thinkorswim's share-class separator for IBKR lookup only."""
    return source_symbol.strip().upper().replace("/", " ")


def discovery_from_contract_details(symbol: str, details: object) -> ReferenceDiscovery:
    contract = details.contract
    return ReferenceDiscovery(
        symbol=symbol,
        company_name=str(getattr(details, "longName", "") or "").strip(),
        primary_exchange=str(
            getattr(contract, "primaryExchange", "")
            or getattr(details, "primaryExchange", "")
            or ""
        ).strip(),
        currency=str(getattr(contract, "currency", "") or "").strip().upper(),
        ibkr_security_type=str(getattr(contract, "secType", "") or "").strip(),
        ibkr_stock_type=str(getattr(details, "stockType", "") or "").strip(),
        ibkr_category=str(getattr(details, "category", "") or "").strip(),
        ibkr_subcategory=str(getattr(details, "subcategory", "") or "").strip(),
        ibkr_industry=str(getattr(details, "industry", "") or "").strip(),
        con_id=str(getattr(contract, "conId", "") or "").strip(),
        resolution_status="resolved",
    )


def select_contract(symbol: str, candidates: Iterable[ReferenceDiscovery]) -> ReferenceDiscovery:
    """Select only an unambiguous USD stock contract; never guess."""
    matches = [
        candidate
        for candidate in candidates
        if candidate.symbol == symbol
        and candidate.currency == "USD"
        and candidate.ibkr_security_type == "STK"
    ]
    unique = {candidate.con_id: candidate for candidate in matches if candidate.con_id}
    if len(unique) == 1:
        return next(iter(unique.values()))
    if not unique:
        return ReferenceDiscovery(
            symbol=symbol,
            message="No unambiguous USD STK contract returned by IBKR.",
        )
    return ReferenceDiscovery(
        symbol=symbol,
        resolution_status="ambiguous",
        message=f"IBKR returned {len(unique)} matching USD STK contracts.",
    )


def write_discovery(path: Path, rows: Iterable[ReferenceDiscovery]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    headers = tuple(ReferenceDiscovery.__dataclass_fields__)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        writer.writerows(asdict(row) for row in rows)


def write_instrument_reference(path: Path, rows: Iterable[ReferenceDiscovery]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    headers = ("Symbol", "CompanyName", "Exchange", "Currency", "SecurityType", "IsActive")
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow(
                {
                    "Symbol": row.symbol,
                    "CompanyName": row.company_name,
                    "Exchange": row.primary_exchange,
                    "Currency": row.currency,
                    "SecurityType": normalize_security_type(row.ibkr_stock_type),
                    "IsActive": "true" if row.resolution_status == "resolved" else "",
                }
            )


class IbkrReferenceError(RuntimeError):
    """Raised when local IBKR reference discovery cannot be completed."""


def fetch_reference_discovery(
    *,
    host: str,
    port: int,
    client_id: int,
    symbols: Iterable[str],
    timeout_seconds: float = 20.0,
    request_pause_seconds: float = 0.05,
    progress: Callable[[str], None] = print,
    checkpoint: Callable[[list[ReferenceDiscovery]], None] | None = None,
) -> list[ReferenceDiscovery]:
    if host not in LOCAL_HOSTS:
        raise ValueError("This founder tool permits local TWS connections only.")

    try:
        from ibapi.client import EClient
        from ibapi.contract import Contract
        from ibapi.wrapper import EWrapper
    except ImportError as exc:
        raise IbkrReferenceError(
            "The IBKR Python API is not installed. Install analytics with the ibkr extra."
        ) from exc

    class _ReferenceClient(EWrapper, EClient):
        def __init__(self) -> None:
            EClient.__init__(self, self)
            self.connected = threading.Event()
            self.finished: dict[int, threading.Event] = {}
            self.details: dict[int, list[object]] = {}
            self.failures: dict[int, str] = {}

        def nextValidId(self, orderId: int) -> None:  # noqa: N802
            self.connected.set()

        def managedAccounts(self, accountsList: str) -> None:  # noqa: N802
            return None

        def contractDetails(self, reqId: int, contractDetails: object) -> None:  # noqa: N802
            self.details.setdefault(reqId, []).append(contractDetails)

        def contractDetailsEnd(self, reqId: int) -> None:  # noqa: N802
            self.finished.setdefault(reqId, threading.Event()).set()

        def error(self, reqId: int, errorCode: int, errorString: str, *args: object) -> None:
            if errorCode in {2104, 2106, 2158}:
                return
            if reqId >= 0:
                self.failures[reqId] = f"IBKR error {errorCode}: {errorString}"
                self.finished.setdefault(reqId, threading.Event()).set()

    client = _ReferenceClient()
    client.connect(host, port, clientId=client_id)
    network_thread = threading.Thread(target=client.run, name="ibkr-reference-reader", daemon=True)
    network_thread.start()
    if not client.connected.wait(timeout_seconds):
        client.disconnect()
        raise IbkrReferenceError(f"TWS did not confirm the API connection at {host}:{port}.")

    results: list[ReferenceDiscovery] = []
    try:
        for index, symbol in enumerate(symbols, start=1):
            request_id = 20_000 + index
            progress(f"[{index}] Resolving {symbol}...")

            def request(exchange: str, current_id: int) -> tuple[list[object], str]:
                contract = Contract()
                contract.symbol = to_ibkr_symbol(symbol)
                contract.secType = "STK"
                contract.exchange = exchange
                contract.currency = "USD"
                client.finished[current_id] = threading.Event()
                client.details[current_id] = []
                client.failures.pop(current_id, None)
                client.reqContractDetails(current_id, contract)
                if not client.finished[current_id].wait(timeout_seconds):
                    return [], "IBKR contract request timed out."
                return client.details[current_id], client.failures.get(current_id, "")

            raw_details, failure = request("SMART", request_id)
            # Some valid securities, especially OTC listings, are not SMART
            # routable. A broad discovery retry is safe because select_contract
            # accepts only one unambiguous USD STK conId.
            if not raw_details:
                raw_details, retry_failure = request("", request_id + 10_000)
                failure = retry_failure or failure
            if raw_details:
                candidates = [discovery_from_contract_details(symbol, item) for item in raw_details]
                result = select_contract(symbol, candidates)
            else:
                result = ReferenceDiscovery(symbol=symbol, message=failure or "No contract returned by IBKR.")
            results.append(result)
            if checkpoint is not None:
                checkpoint(results)
            time.sleep(request_pause_seconds)
    finally:
        client.disconnect()
        network_thread.join(timeout=2.0)
    return results
