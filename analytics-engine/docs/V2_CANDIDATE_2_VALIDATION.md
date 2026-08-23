# Evidence Engine v2 Candidate 2 Validation

- **Status:** Experimental shadow candidate
- **Date:** 2026-08-23
- **AI-DLC Level:** Level 3 - Controlled
- **Production eligibility:** Not eligible
- **Engine:** TradeEvidence Evidence Engine v2.0.0-candidate.2
- **Ruleset:** direction-aware-technical-evidence-v0.2.0

## Purpose

Candidate 2 resolves Candidate 1's known directional setup asymmetry by
accepting the founder-reviewed bidirectional Stellar Evidence and Stellar
Orbit watchlist states. It validates deterministic ingestion, semantic
mapping, contribution reconciliation, and cross-sectional output behavior. It
does not establish predictive usefulness or authorize production use.

## Approved input semantics

The adapter preserves the source states without converting the absence of a
bullish setup into bearish evidence:

| Source state | Candidate interpretation |
|---|---|
| `BULL-CD` | strong bullish compression setup |
| `BULL-WATCH-CD` | developing bullish compression setup |
| `BEAR-CD` | strong bearish compression setup |
| `BEAR-WATCH-CD` | developing bearish compression setup |
| `NEUTRAL-CD` | active compression without approved direction |
| `BULL-BO` | bullish alignment without active compression |
| `BEAR-BO` | bearish alignment without active compression |
| `NEUTRAL-BO` | no active directional setup |
| `BULL` / `BEAR` | active bullish / bearish Orbit state |
| `BULL-WATCH` | Orbit remains bullish but is weakening |
| `BEAR-WATCH` | Orbit remains bearish but is weakening |

Daily Evidence and daily/weekly Orbit participate in the provisional score.
Weekly Evidence and monthly Evidence are retained in the normalized
observation as supplemental context and are not independently scored in this
candidate. No separate user-facing Neutral or Unaligned column is required;
neutrality remains an internal state of the same evidence model.

## Engineering validation

The combined suite passes 19 tests: the original seven characterization
tests, legacy fingerprint protection, direction-aware engine fixtures,
determinism and reconciliation checks, direct bidirectional CSV mapping, and
duplicate-symbol rejection. The protected legacy implementation remains
unchanged.

## Full shadow run

The local Thinkorswim export contained 633 rows and 633 unique symbols. The
source CSV and generated reports remain local and excluded from Git. The run
used market date 2026-08-21 and as-of 2026-08-21T20:00:00Z.

| Classification | Count | Share |
|---|---:|---:|
| Bullish | 187 | 29.5% |
| Bullish Watch | 148 | 23.4% |
| Bearish | 49 | 7.7% |
| Bearish Watch | 149 | 23.5% |
| Neutral | 91 | 14.4% |
| Incomplete | 9 | 1.4% |
| **Total** | **633** | **100.0%** |

The nine incomplete results reflect missing or provider-loading values in
required fields. Candidate 2 does not manufacture a normal score for those
rows.

## Representative-symbol review

| Symbol | Candidate result | Evidence summary |
|---|---|---|
| AG | Bullish Watch, 49 | bullish daily Orbit and short-term structure; weakening bearish weekly Orbit contributes contradiction |
| ADM | Bullish Watch, 45 | bullish daily compression setup and weakening bullish Orbit outweigh bearish moving-average structure |
| DAL | Bearish Watch, 49 | bearish daily Orbit and price below the short trend; weakening bullish weekly Orbit contributes contradiction |

These results should be compared with the founder's chart review. In
particular, ADM does not reproduce the previously described bearish example.
The engine preserves and exposes the conflicting evidence instead of forcing
the expected label. This is a validation question, not evidence that either
the engine or the chart-review expectation is correct.

## Findings and risks

- Candidate 2 materially improves directional setup parity and increases
  bearish classifications relative to Candidate 1.
- Neutral remains a sizeable internal outcome (91 symbols). The founder
  previously described neutral states as noisy, so its rules and threshold
  boundaries need targeted review.
- One cross-sectional export validates ingestion and semantics only. It cannot
  validate forward outcomes, threshold calibration, or historical utility.
- The observation timestamp is an explicit working assumption and must be
  confirmed against the source export process.
- All capacities, allocations, and thresholds remain unvalidated hypotheses.

## Required next validation

1. Perform founder chart review of a stratified sample from all five complete
   classifications, including AG, ADM, and DAL.
2. Review every Neutral result or a statistically useful sample to identify
   whether noise comes from ThinkScript states, evidence allocations, or final
   classification thresholds.
3. Add mirrored boundary tests for every bullish and bearish source state.
4. Decide how supplemental weekly and monthly Evidence should affect later
   rulesets; do not add them implicitly.
5. Run multiple dated exports and approve an outcome methodology before any
   historical or predictive claim.
6. Complete the remaining Workshop 6 decisions before production adoption.
