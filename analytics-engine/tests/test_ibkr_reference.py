import csv
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from tradeevidence_analytics.ibkr_reference import (  # noqa: E402
    ReferenceDiscovery,
    discovery_from_contract_details,
    normalize_security_type,
    read_unique_symbols,
    select_contract,
    to_ibkr_symbol,
    write_instrument_reference,
)


class IbkrReferenceTests(unittest.TestCase):
    def test_reads_variable_unique_universe_with_preamble(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "symbols.csv"
            path.write_text("Watchlist X\n\nSymbol,Last\nmsft,1\nAAPL,2\nMSFT,3\n", encoding="utf-8")
            self.assertEqual(read_unique_symbols(path), ["AAPL", "MSFT"])

    def test_normalizes_only_explicit_supported_stock_types(self):
        self.assertEqual(normalize_security_type("ETF"), "ETF")
        self.assertEqual(normalize_security_type("COMMON"), "COMMON_STOCK")
        self.assertEqual(normalize_security_type("ADR"), "DEPOSITARY_RECEIPT")
        self.assertEqual(normalize_security_type("REIT"), "REIT")
        self.assertEqual(normalize_security_type("MLP"), "MLP")
        self.assertEqual(normalize_security_type("NY REG SHRS"), "REGISTERED_SHARE")
        self.assertEqual(normalize_security_type("CLOSED-END FUND"), "CLOSED_END_FUND")
        self.assertEqual(normalize_security_type("TRACKING STK"), "TRACKING_STOCK")
        self.assertEqual(normalize_security_type("UNKNOWN PROVIDER TYPE"), "")

    def test_translates_thinkorswim_share_class_separator_for_lookup(self):
        self.assertEqual(to_ibkr_symbol("brk/b"), "BRK B")

    def test_extracts_raw_provider_classification(self):
        contract = SimpleNamespace(
            symbol="MSFT", primaryExchange="NASDAQ", currency="USD", secType="STK", conId=272093
        )
        details = SimpleNamespace(
            contract=contract, longName="MICROSOFT CORP", stockType="COMMON",
            category="Technology", subcategory="Software", industry="Applications Software",
        )
        row = discovery_from_contract_details("MSFT", details)
        self.assertEqual(row.ibkr_category, "Technology")
        self.assertEqual(row.company_name, "MICROSOFT CORP")

    def test_ambiguous_contracts_are_not_guessed(self):
        rows = [
            ReferenceDiscovery("ABC", currency="USD", ibkr_security_type="STK", con_id="1", resolution_status="resolved"),
            ReferenceDiscovery("ABC", currency="USD", ibkr_security_type="STK", con_id="2", resolution_status="resolved"),
        ]
        self.assertEqual(select_contract("ABC", rows).resolution_status, "ambiguous")

    def test_writes_exact_instrument_contract_header(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "reference.csv"
            write_instrument_reference(path, [ReferenceDiscovery("SPY")])
            with path.open(newline="", encoding="utf-8") as handle:
                self.assertEqual(next(csv.reader(handle)), [
                    "Symbol", "CompanyName", "Exchange", "Currency", "SecurityType", "IsActive"
                ])


if __name__ == "__main__":
    unittest.main()
