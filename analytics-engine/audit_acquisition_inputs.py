"""Inventory acquisition files; never infer provider policy or approve publication."""
import argparse
import csv
import hashlib
import json
from pathlib import Path

INPUTS = ('symbol-evidence', 'context-snapshots', 'context-daily-history',
          'instrument-reference', 'sector-membership', 'run-metadata',
          'ibkr-reference-discovery')


def audit_inputs(folder, market_date):
    inputs = []
    for name in INPUTS:
        path = Path(folder) / f'{market_date}-{name}.csv'
        item = {'input': name, 'filename': path.name, 'status': 'missing'}
        if path.is_file():
            raw = path.read_bytes()
            item.update(status='present', sha256=hashlib.sha256(raw).hexdigest(), bytes=len(raw))
            try:
                rows = list(csv.reader(raw.decode('utf-8-sig').splitlines()))
                item.update(header=rows[0] if rows else [], row_count=max(0, len(rows)-1))
                if not rows or any(len(row) != len(rows[0]) for row in rows[1:]):
                    item['status'] = 'invalid_csv_shape'
            except (UnicodeError, csv.Error):
                item['status'] = 'unreadable_csv'
        inputs.append(item)
    return {'schema_version': 'acquisition-inventory-v1', 'market_date': market_date,
            'purpose': 'Inventory only; does not validate or approve publication.',
            'lineage_requirement': 'Declare source, export time, observation identity and adjustment policy per input. Filenames do not establish lineage.',
            'inputs': inputs}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('folder', type=Path)
    parser.add_argument('--market-date', required=True)
    args = parser.parse_args()
    print(json.dumps(audit_inputs(args.folder, args.market_date), indent=2))
