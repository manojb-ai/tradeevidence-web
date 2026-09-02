# TradeEvidence Analytics Engine

This directory contains the deterministic Phase 1 analytical-engine baseline
imported from the original local chart-review agent on 2026-07-19.

The engine currently:

- reads a structured Thinkorswim watchlist CSV;
- normalizes setup, momentum, ADX, implied-volatility, and moving-average data;
- calculates a provisional bullish technical-evidence score;
- classifies results as `YES`, `WATCH`, or `NO`;
- calculates educational strategy-alignment scores; and
- writes a JSON sidecar and an HTML review report from the same result set.

## Governance status

This is a preserved behavioral baseline, not a validated production scoring
model. Current weights are hand-tuned hypotheses. Do not represent the score as
predictive, advisory, or historically validated.

The architecture workshops now define Evidence Score, separate Decision
Confidence, lineage, data contracts, and approved language. The protected
legacy baseline remains unchanged, and the direction-aware Candidate 2 remains
experimental until its outcome methodology, ruleset, and production use receive
explicit founder approval.

## Local use

Python 3.10 or later is recommended. The engine uses the Python standard
library only.

```powershell
cd analytics-engine
python run_data_agent.py --data-file path\to\watchlist.csv
```

Generated files are written to `analytics-engine/output/` and are intentionally
ignored by Git.

## Tests

```powershell
cd analytics-engine
python -m unittest discover -s tests -v
```

The initial tests characterize the imported baseline so subsequent changes are
intentional and reviewable.

## Direction-aware v2 candidate

The protected legacy files remain unchanged. Experimental direction-aware work
is implemented beside them in `evidence_engine_v2.py` and related v2 modules.
It is a review candidate, not an approved production ruleset and not a claim of
predictive or historical validity.

For an interactive on-demand run, open PowerShell in `analytics-engine` and
run:

```powershell
py run_evidence_engine_v2.py
```

The program prompts for the Thinkorswim CSV path and market date. Use the
trading-session date represented by the values, which may differ from the date
the CSV was exported. Reports are written beneath
`analytics-engine/output/<csv-name>/`.

You can also provide everything in one command and optionally open the HTML
report when the run completes:

```powershell
py run_evidence_engine_v2.py "C:\path\to\watchlist.csv" `
  --market-date "2026-08-21" `
  --as-of "2026-08-21T20:00:00Z" `
  --open-report
```

`--as-of` and `--output-dir` are optional. The existing `--data-file` form is
also supported for scripts and saved commands.

The candidate emits `bullish`, `bearish`, `bullish_watch`, `bearish_watch`,
`mixed`, `neutral`, and `incomplete` classifications while keeping direction
separate from alignment strength. Outputs remain local and ignored by Git.

See [V2 Candidate 2 Validation](docs/V2_CANDIDATE_2_VALIDATION.md) before
interpreting its behavior or changing provisional factor capacities.

## Read-only IBKR context-history acquisition

`fetch_ibkr_history.py` is a provider adapter that creates the approved
`context-daily-history.csv` input. CSV remains the MVP source contract; neither
the Evidence Engine nor the website calls IBKR directly. The tool permits only
a local TWS connection and requests only historical market bars. It does not
request or retain account, portfolio, position, execution, or order data.

Install the IBKR Python API dependency in the analytics environment:

```powershell
py -m pip install -e ".[ibkr]"
```

With TWS open, API access enabled, Read-Only API enabled, and live TWS port
`7496`, first test SPY:

```powershell
py fetch_ibkr_history.py --through 2026-08-21 --symbols SPY
```

After reviewing the SPY CSV, fetch all 14 approved context symbols:

```powershell
py fetch_ibkr_history.py --through 2026-08-21
```

The default output is local and ignored by Git:

```text
analytics-engine/input/2026-08-21/2026-08-21-context-daily-history.csv
```

The program requests regular-session `TRADES` bars for unadjusted OHLC and
volume, plus `ADJUSTED_LAST` bars for the split-and-distribution-adjusted close.
For the currently negotiated IBKR compatibility protocol, U.S. equity volume
is converted from 100-share lots to shares. IBKR historical volume is filtered
and may therefore differ from an unfiltered consolidated feed.
Because IBKR does not accept an explicit end date for `ADJUSTED_LAST`, the tool
requests the latest adjusted duration window and deterministically excludes
dates after `--through` when joining the two series.
IBKR market-data permissions still apply. A first connection may produce a TWS
confirmation dialog; accept only the local `127.0.0.1` connection.

### Instrument and classification discovery

The separate read-only reference collector derives its variable symbol universe
from the current Thinkorswim export and requests only IBKR contract details. It
checkpoints an exact instrument-reference CSV and a raw provider-discovery CSV:

```powershell
py fetch_ibkr_reference.py `
  --symbols-file "input/2026-09-01/2026-09-01-symbol-evidence.csv" `
  --market-date 2026-09-01
```

Use `--limit 3` for an initial smoke test. Raw IBKR category, subcategory, and
industry values are preserved for review and are not represented as GICS.
Unknown or ambiguous identity and security-type values remain blank rather than
being guessed. Currency is retained as an identity and price-validation guard;
the current universe is expected to resolve to USD, and exceptions require
review.
