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

Workshop #2 will define the canonical Evidence Score, independent Decision
Confidence, market and sector context, data contracts, and approved user-facing
terminology before scoring behavior changes.

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
