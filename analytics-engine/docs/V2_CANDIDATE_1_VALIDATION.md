# Evidence Engine v2 Candidate 1 Validation

- **Status:** Experimental shadow candidate
- **Date:** 2026-08-23
- **AI-DLC Level:** Level 3 - Controlled
- **Production eligibility:** Not eligible

## Purpose

Candidate 1 proves the direction-aware pipeline and output semantics against
synthetic fixtures and one local 558-symbol Thinkorswim export. It does not
validate predictive usefulness or authorize the provisional ruleset.

## Legacy protection

The original migrated engine remains unchanged. Its source commit and
normalized source hashes are recorded in `LEGACY_BASELINE_MANIFEST.json`, and
an automated test rejects accidental changes to its three implementation
files. The `analytics-engine-baseline` branch remains a separate repository
reference.

## Engineering validation

The combined suite passes 17 tests:

- seven legacy characterization tests;
- one legacy source-fingerprint protection test;
- bullish, bearish, bullish-watch, mixed, neutral, and incomplete v2 fixtures;
- contribution reconciliation; and
- identical-input determinism.

Candidate 1 also rejects duplicate symbols, requires explicit market-date and
as-of metadata, records a source checksum, produces no score for incomplete
required evidence, and keeps provider input, factor output, and report
generation separate.

## Local shadow-run result

Input artifacts remain local and are intentionally excluded from Git.
Candidate 1 processed 558 unique symbols:

| Classification | Count |
|---|---:|
| Bullish | 180 |
| Bullish Watch | 159 |
| Bearish | 26 |
| Bearish Watch | 125 |
| Neutral | 61 |
| Mixed | 0 |
| Incomplete | 7 |

The seven incomplete results correspond to missing required moving-average,
ADX, or weekly-trend observations. Unlike the legacy engine, Candidate 1 did
not assign them a normal score.

Candidate 1 recognized coherently bearish examples such as BWXT, ALHC, APP,
BXMT, GME, LII, RDY, and WSO as bearish rather than merely failed bullish
opportunities. These classifications are semantic test evidence, not advice or
proof of future price behavior.

## Material finding: directional setup asymmetry

The imported `StellarEvDaily` field represents a bullish setup state. Its
values distinguish `BUY`, `BUY-WATCH`, and `NO`; `NO` means no active bullish
setup and is not evidence of a bearish setup.

Candidate 1 conservatively treats `NO` as neutral. Because daily setup has a
provisional capacity of 20, bullish evidence can use that capacity while
bearish evidence cannot. Comparable bullish and bearish alignment therefore
do not have equal maximum opportunity under this input contract.

This is not acceptable as a final direction-neutral scoring model. Human
approval is required to choose one of these paths:

1. add a genuine versioned bearish-setup observation calculated symmetrically;
2. remove the bullish-only setup factor from direction-neutral scoring and
   retain it as supplemental context; or
3. define explicitly separate bullish and bearish eligible capacities and
   presentation semantics.

Candidate 1 must remain experimental until this is resolved and rerun.

## Additional findings

- The local export produced no Mixed results under the provisional thresholds,
  although a symmetric synthetic conflict fixture does. Threshold behavior
  needs distribution and boundary review.
- The candidate deliberately excludes implied volatility, entry suitability,
  strategy selection, market/sector context, Decision Confidence, and AI from
  Technical Evidence.
- The observation date used for the local shadow run was 2026-08-21 with an
  as-of value of 20:00:00Z, inferred as the preceding regular-session close.
  The data owner must confirm the actual source observation time before this
  run can be treated as reproducible validation evidence.
- One cross-sectional export can test semantics and distributions but cannot
  establish historical or predictive validity.

## Required next validation

1. Resolve directional setup parity with human approval.
2. Review the factor registry, provisional capacities, direction materiality,
   lead margin, and Watch thresholds.
3. Expand mirrored boundary and contribution tests beyond the initial Bullish
   Watch and Bearish Watch fixtures.
4. Add schema validation and independent artifact reconciliation.
5. Run multiple dated exports in shadow mode.
6. Approve an outcome methodology before any historical-performance claim.
7. Complete the remaining Workshop 6 decisions before production adoption.
