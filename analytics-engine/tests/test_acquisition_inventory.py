import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("audit_inputs", Path(__file__).parents[1] / "audit_acquisition_inputs.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class AcquisitionInventoryTests(unittest.TestCase):
    def test_missing_shape_and_content_identity(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "2026-09-01-symbol-evidence.csv"
            path.write_text("Symbol,Last\nTEST,10\n", encoding="utf-8")
            first = module.audit_inputs(folder, "2026-09-01")["inputs"]
            self.assertEqual(first[0]["row_count"], 1)
            self.assertEqual(first[1]["status"], "missing")
            path.write_text("Preamble\nSymbol,Last\nTEST,11\n", encoding="utf-8")
            second = module.audit_inputs(folder, "2026-09-01")["inputs"]
            self.assertEqual(second[0]["status"], "invalid_csv_shape")
            self.assertNotEqual(first[0]["sha256"], second[0]["sha256"])
