# Analytics Engine Baseline Audit

**Status:** Imported baseline  
**Date:** 2026-07-19  
**Source:** Local `chart-review-agent` prototype  
**AI-DLC Level:** Level 3

## Accepted role

The existing local analytical program is the candidate Phase 1 Analytical Data
Producer. Its JSON output is the application integration surface. The HTML
output is an internal review and optional export artifact. Options outputs
represent educational strategy alignment, not a recommendation or evaluation
of a specific options position.

Phase 1 will use separate, versioned market-context, sector-context, and
symbol-evidence outputs linked through a common analytical-run manifest.

## Baseline strengths

- Deterministic standard-library Python implementation
- Explicit engine and ruleset versions
- Centralized, documented scoring weights
- Separate parsing, scoring, strategy, and reporting concerns
- JSON and HTML generated from the same result objects
- No network calls, external AI models, embedded credentials, or third-party
  runtime dependencies

## Known limitations

- Scoring weights are hand-tuned hypotheses and have not been outcome-validated.
- The current score is a bullish technical-opportunity score, not yet the
  canonical cross-domain Evidence Score.
- The current confidence label is derived from the score and is not the future
  independent Decision Confidence concept.
- Market context, sector alignment, relative strength, volume, events,
  fundamentals, liquidity, and freshness are not yet incorporated.
- Strategy explanations are generic templates and can contradict the actual
  scoring contribution.
- A `NO` result still ranks the least-misaligned strategy.
- Absolute implied volatility is used without IV Rank, IV Percentile, term
  structure, strike, expiration, spread, or liquidity information.
- Risk output does not distinguish evaluated, flagged, unavailable, and
  not-evaluated factors.
- The JSON contract lacks a schema version, run ID, source checksum, and data
  `as_of` timestamp.
- Embedded JSON in the HTML is HTML-encoded and should not be used as the
  application interface.

## Change policy

The imported behavior is preserved until Workshop #2 approves Evidence Score
semantics and acceptance criteria. Behavioral changes require updated tests,
documentation, ruleset versioning, and human approval where financial-language
or scoring boundaries are affected.
