# Evidence Engine Specification

- **Status:** Approved
- **Version:** 1.0
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-08-23
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [MVP-Implementation-Spec.md](MVP-Implementation-Spec.md), [MVP-Data-Schema.md](MVP-Data-Schema.md), [Canonical-Analytical-Model.md](Canonical-Analytical-Model.md), [../Evidence-History-and-Validation.md](../Evidence-History-and-Validation.md), [../governance/decisions/ADR-008-Evidence-Engine-Governance.md](../governance/decisions/ADR-008-Evidence-Engine-Governance.md), [../workshops/Workshop-06-Summary.md](../workshops/Workshop-06-Summary.md)

## Purpose

This specification defines the deterministic Evidence Engine contract for
TradeEvidence. It governs direction-aware evidence, normalization, factor
allocation, reconciliation, explanations, snapshots, validation, versioning,
execution identity, and publication boundaries. It does not approve the
current candidate weights as predictive or production-ready.

## 1. Responsibility Boundary

The Evidence Engine owns deterministic evaluation of normalized observations
under an explicit ruleset. It produces reconciled, explainable, versioned
Evidence Snapshots.

It does not own market-data acquisition, universe membership, identity,
authorization, product state, alert delivery, AI conversation, Decision
Confidence, trader decisions, brokerage execution, personalized advice,
outcome claims, or production promotion.

The current v2 candidate is a Technical Evidence Engine. Future market,
sector, fundamental, sentiment, or other engines may publish distinct evidence
through the canonical analytical model. Their values cannot be silently folded
into Technical Evidence.

## 2. Direction and Classification

Technical Evidence tracks bullish, bearish, neutral, and unavailable capacity
independently. A missing bullish condition is not bearish evidence, and a
missing bearish condition is not bullish evidence.

Permitted result classifications are:

- `bullish`
- `bullish_watch`
- `bearish`
- `bearish_watch`
- `mixed`
- `neutral`
- `incomplete`

The ruleset defines materiality, lead margins, alignment bands, and Watch
boundaries. A result cannot be forced into a direction when the approved
thresholds do not support it.

Direction and alignment are separate. Direction identifies the material lead;
alignment describes the strength of the evidence supporting that direction.
Neither is a probability, forecast, recommendation, or Decision Confidence.

## 3. Processing Pipeline

```text
Provider data
    -> provider adapter
    -> normalized observation
    -> factor registry evaluation
    -> contribution reconciliation
    -> immutable Evidence Snapshot
    -> controlled publication
    -> presentation, alerts, AI, and other consumers
```

Provider parsing, rules, persistence, publication, presentation, alerts, and
AI remain separate responsibilities. Downstream consumers never recalculate or
modify authoritative evidence.

## 4. Normalized Input Contract

The engine accepts provider-neutral normalized observations. Provider field
names and transport formats cannot enter core rules. Each observation includes
at least:

- stable instrument identity and symbol at observation;
- market date, as-of timestamp, and observation kind;
- source version and checksum;
- required normalized factor inputs; and
- explicit unavailable reasons.

CSV is an approved Phase 1 validation and fallback adapter, not a permanent
engine dependency. Future market-data adapters must produce the same canonical
contract and pass equivalence validation before replacing a validated source.

## 5. Factor Registry

Every factor definition records:

- stable factor code and group;
- definition version;
- eligible capacity;
- recognized observed states;
- bullish, bearish, neutral, and unavailable allocation rules;
- explanation code and deterministic explanation semantics; and
- required or supplemental status.

For each evaluated factor:

```text
bullish + bearish + neutral + unavailable = factor capacity
```

Unknown provider values are unavailable, not neutral. Default branches cannot
manufacture directional evidence.

Material factor changes require a new factor definition and ruleset version,
tests, documentation, validation evidence, and human approval.

## 6. Evidence Ledger and Score Semantics

A complete snapshot maintains separate ledgers:

```text
bullish total
bearish total
neutral total
unavailable total
eligible capacity
evaluated capacity
coverage
```

All factor contributions reconcile to snapshot totals and eligible capacity.
The alignment score is derived from the approved directional lead and evaluated
capacity rules. The ruleset must preserve the unrounded value used for
calculation and the displayed rounded value.

Evidence Score summarizes observed technical alignment. It is not:

- probability of profit;
- predicted direction or return;
- a Buy, Sell, or Hold directive;
- personalized suitability;
- Decision Confidence; or
- proof of historical validity.

## 7. Completeness

The registry identifies required and supplemental inputs. Missing required
evidence produces `incomplete`, named unavailable reasons, coverage, and no
ordinary Evidence Score. Missing inputs cannot quietly contribute zero or be
treated as neutral.

Supplemental evidence may be absent without invalidating a complete result only
when the active ruleset explicitly defines that behavior. The presentation must
still expose the absence where material.

## 8. Timeframe Semantics

Daily, weekly, and monthly observations remain distinct. The engine cannot
average them into an unexplained combined state.

For Technical Evidence candidate 2:

- daily Stellar Evidence represents the immediate setup;
- daily Stellar Orbit represents immediate directional momentum;
- weekly Stellar Orbit represents higher-timeframe confirmation or contradiction;
- weekly and monthly Stellar Evidence remain supplemental, visible context; and
- supplemental weekly or monthly Evidence does not affect the score until a
  later ruleset explicitly approves that influence.

Timeframe conflict is legitimate evidence, not a processing error. Any change
to timeframe roles or scoring influence requires versioning and human approval.

## 9. Explanations and Devil's Advocate

Every complete directional snapshot identifies principal support, other
support, principal contradiction, other material contradictions, neutral and
unavailable evidence, and deterministic invalidation conditions. Neutral,
Mixed, and Incomplete outputs explain why no directional result was reached.

Authoritative explanations are deterministic and tied to factor, ruleset, and
template versions. AI may translate, summarize, or discuss recorded evidence;
it cannot invent factors, alter scores, conceal contradictions, or become the
analytical source of truth.

The product uses progressive disclosure over one canonical explanation:

- a beginner view uses plain language, principal support, principal
  contradiction, and a concise why-it-matters explanation;
- a detailed view exposes allocations, thresholds, timeframe conflicts,
  coverage, versions, and invalidation conditions.

Presentation depth never changes the underlying facts or score.

## 10. Immutable Evidence Snapshots

Every successful analytical evaluation creates or references immutable
snapshot content recording:

- instrument and observation identity;
- normalized inputs and source checksum;
- every factor allocation and explanation code;
- direction, classification, alignment, coverage, and completeness;
- support, contradiction, and invalidation information;
- engine, ruleset, factor, input-schema, output-schema, and template versions;
- analysis run identity; and
- creation timestamp.

Historical snapshots are never overwritten. A change to relevant input,
checksum, or version creates distinct snapshot content. Evidence remains
separate from Decision Confidence and the trader's decision.

## 11. Runs, Idempotency, and Semantic Deduplication

Every intentional execution receives an `analysis_run_id`.

- A retry using the same idempotency key cannot create duplicate execution
  effects.
- An intentional later rerun creates a new run even when its content is
  equivalent.
- Identical normalized inputs, source checksum, and applicable versions may
  reference semantically equivalent immutable content while preserving both
  run events.
- Any relevant content or version change creates a distinct snapshot.
- Failed and incomplete runs remain traceable and cannot masquerade as normal
  completed evidence.

Alerts consume committed immutable snapshots. They may compare comparable
snapshots but do not calculate evidence and must retain references to the
snapshots that caused the alert.

## 12. Ruleset Lifecycle

```text
Draft -> Candidate -> Approved -> Production -> Retired
```

Production rules are never edited in place. Candidate and production versions
may run side-by-side against the same normalized observations. Promotion
requires tests, validation evidence, documentation, and explicit human
approval. Rollback selects a previously approved version and never rewrites
history. Retired versions remain resolvable for audit and explanation.

Only one ruleset is the default production version for a given evidence
product and observation type. Experimental output is visibly labeled and
cannot silently appear as production evidence.

## 13. Validation Gates

Validation progresses through:

1. schema, lineage, reconciliation, determinism, and failure testing;
2. mirrored bullish/bearish state and boundary testing;
3. founder chart review across all classifications and contradictions;
4. multi-date shadow runs and distribution review;
5. pre-registered outcome evaluation addressing horizons, benchmarks,
   corporate actions, survivorship, missing data, and relevant assumptions;
6. explicit human production approval.

Software tests and selected examples establish neither predictive validity nor
production suitability. Failed cases, contradictions, and excluded samples
remain in the validation record. Outcome measurements are append-only and
cannot rewrite the original snapshot.

## 14. Publication Contract

Only a complete, reconciled, lineage-valid, approved candidate bundle is
eligible for controlled publication. Publication remains atomic at run level
and does not mix required evidence from different runs. The web application
validates and serves published records without importing scoring code.

Incomplete evidence may be published only as explicitly incomplete information
under the approved API contract. It cannot appear as a normal scored result.

## 15. Current Candidate Status

Technical Evidence Engine v2 Candidate 2 and ruleset
`direction-aware-technical-evidence-v0.2.0` are experimental. They have passed
structural tests and one 633-symbol cross-sectional shadow run. Their weights,
allocations, classifications, and thresholds remain hypotheses.

Candidate 2 is not production-approved. Founder chart review, multiple dated
runs, neutral-state investigation, and approved outcome evaluation remain
required. A Candidate 3 is created only if validation evidence justifies a
material revision; it is not an automatic milestone.

## Acceptance Criteria

- Provider-specific names do not enter core evaluation rules.
- Required missing data cannot produce an ordinary score.
- Every factor and snapshot reconciles exactly.
- Bullish and bearish semantics have mirrored test coverage.
- Timeframe contradictions remain inspectable.
- Every output resolves its inputs, checksum, run, ruleset, factors, schemas,
  and explanations.
- Retry, intentional rerun, and semantic equivalence remain distinguishable.
- Historical snapshots are immutable.
- AI, UI, alerts, and APIs cannot alter authoritative evidence.
- Candidate output cannot be mistaken for approved production evidence.
- Product language remains educational, explainable, and non-advisory.

## Deferred Scope

- Automated universe membership and direct market-data acquisition
- Production provider selection and licensing
- Approved influence of supplemental weekly and monthly Stellar Evidence
- Historical outcome methodology and predictive-validation claims
- Market, sector, fundamental, sentiment, and portfolio evidence engines
- AI workflow and prompt/evaluation contract (Workshop 7)
- Production scoring/ruleset approval under the Workshop #8 release, observability, and operational controls
