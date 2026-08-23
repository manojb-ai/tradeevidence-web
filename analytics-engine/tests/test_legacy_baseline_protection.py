from __future__ import annotations

import hashlib
import json
from pathlib import Path
import unittest


ENGINE_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ENGINE_ROOT / "docs" / "LEGACY_BASELINE_MANIFEST.json"


def _normalized_sha256(path: Path) -> str:
    text = path.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


class LegacyBaselineProtectionTests(unittest.TestCase):
    def test_protected_legacy_files_match_imported_baseline(self):
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

        for relative_path, expected_hash in manifest["files"].items():
            with self.subTest(path=relative_path):
                self.assertEqual(
                    _normalized_sha256(ENGINE_ROOT / relative_path),
                    expected_hash,
                    "Legacy baseline changed. Build canonical behavior in the v2 modules instead.",
                )


if __name__ == "__main__":
    unittest.main()
