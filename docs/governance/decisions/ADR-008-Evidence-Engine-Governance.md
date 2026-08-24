# ADR-008 - Evidence Engine Governance

## Status

Accepted

## Date

2026-08-23

## Context

TradeEvidence requires deterministic, explainable technical evidence that can
represent bullish, bearish, contradictory, neutral, and incomplete conditions
without becoming a recommendation or prediction. The imported analytical
baseline was bullish-oriented, used provider-specific CSV semantics, and
contained unvalidated weights. The product also requires immutable history,
same-run integrity, provider evolution, beginner-to-expert explanations, and a
safe lifecycle for future ruleset changes.

Without a governing contract, provider parsing, scoring, UI explanations, AI,
alerts, and historical validation could silently diverge or rewrite meaning.

## Decision

TradeEvidence adopts a provider-neutral deterministic Evidence Engine pipeline:
provider adapters create normalized observations; a versioned factor registry
allocates bullish, bearish, neutral, and unavailable capacity; exact
reconciliation produces an immutable Evidence Snapshot; controlled publication
makes the result available to downstream consumers.

Direction, alignment, coverage, and Decision Confidence remain separate.
Missing required inputs produce Incomplete rather than an ordinary score.
Daily, weekly, and monthly evidence stays distinguishable, and material
timeframe contradiction is preserved.

Every snapshot retains normalized inputs, source checksum, factor ledger,
support, contradiction, invalidation, run identity, and all applicable engine,
ruleset, factor, schema, and template versions. Retries are idempotent;
intentional reruns remain separate execution events; semantically equivalent
content may be deduplicated without losing run history.

Deterministic explanations are authoritative and use progressive disclosure for
beginner and expert presentation. AI may explain recorded evidence but cannot
create, change, or conceal it. Alerts compare committed snapshots and never
calculate evidence independently.

Rulesets follow Draft, Candidate, Approved, Production, and Retired states.
Material changes require a new version, tests, documentation, validation
evidence, and human approval. Production promotion requires structural,
mirrored-rule, chart-review, multi-date, and approved outcome-validation gates.

The current v2 Candidate 2 remains experimental and is not promoted by this
ADR.

## Consequences

- Evidence remains reproducible across providers, releases, retries, and time.
- Bullish and bearish cases can coexist and reconcile without forced labels.
- Missing data and timeframe conflicts remain visible instead of creating false
  certainty.
- Beginners and experts can receive different presentation depth over the same
  canonical facts.
- Historical storage and lineage requirements are larger because records are
  append-only and version-rich.
- Factor and ruleset changes require disciplined versioning and validation.
- CSV can remain a controlled Phase 1 adapter while future providers evolve
  independently.
- Candidate 2 still requires empirical review before production use.

## Alternatives Considered

- **Continue the bullish-only baseline:** rejected because absence of bullish
  evidence is not bearish evidence and does not serve direction-neutral users.
- **Calculate evidence in the web application:** rejected because request-time
  scoring would duplicate rules, weaken reproducibility, and couple UI delivery
  to analytical behavior.
- **Allow provider-specific fields in core rules:** rejected because it would
  make provider evolution a scoring rewrite.
- **Overwrite the latest snapshot:** rejected because it destroys historical
  explanation and enables hindsight bias.
- **Use AI as the scoring or explanation authority:** rejected because
  authoritative evidence must be deterministic, testable, and reproducible.
- **Promote Candidate 2 immediately:** rejected because engineering correctness
  and one cross-sectional run do not establish production or predictive
  validity.

## Related Documents

- [Evidence Engine Specification](../../engineering/Evidence-Engine-Specification.md)
- [Evidence History and Validation](../../Evidence-History-and-Validation.md)
- [Canonical Analytical Model](../../engineering/Canonical-Analytical-Model.md)
- [MVP Data Schema](../../engineering/MVP-Data-Schema.md)
- [Workshop #6 Summary](../../workshops/Workshop-06-Summary.md)
