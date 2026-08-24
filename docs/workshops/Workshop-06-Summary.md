# Workshop #6 Summary

- **Status:** Completed
- **Completion Date:** 2026-08-23
- **Owner:** Founder and Chief Software Architect
- **Scope:** Evidence Engine
- **AI-DLC Level:** Level 3 - Controlled

## Objective

Define the Evidence Engine pipeline, direction and score semantics,
explainability, versioning, immutable history, validation, and Devil's Advocate
behavior without representing provisional weights as predictive or approved.

## Approved Decisions

1. Evidence is direction-aware and may be Bullish, Bullish Watch, Bearish,
   Bearish Watch, Mixed, Neutral, or Incomplete without forcing a direction.
2. Provider ingestion, normalization, factor evaluation, reconciliation,
   snapshots, publication, and consumption are explicit separate stages.
3. The engine consumes a provider-neutral normalized observation; CSV is a
   Phase 1 adapter rather than a permanent dependency.
4. Every factor has a stable code, capacity, state mapping, allocation,
   explanation, required/supplemental role, and version.
5. Bullish, bearish, neutral, and unavailable contributions remain separate;
   Evidence Score measures alignment and is not prediction, recommendation, or
   Decision Confidence.
6. Missing required evidence produces Incomplete with coverage and named
   reasons rather than a misleading ordinary score.
7. Factor and snapshot ledgers reconcile exactly to eligible capacity.
8. Evidence Snapshots are immutable, reproducible, version-rich, and separate
   from the trader's confidence and decision.
9. Deterministic explanations preserve support, contradiction, unavailable
   evidence, and invalidation; progressive disclosure serves beginners and
   experts over the same facts.
10. Daily, weekly, and monthly roles remain distinct; timeframe contradiction
    is preserved; supplemental weekly/monthly Evidence gains scoring influence
    only through a future approved ruleset.
11. Validation progresses through structural, mirrored-rule, founder review,
    multi-date shadow, pre-approved outcome, and human production gates.
12. Rulesets move through Draft, Candidate, Approved, Production, and Retired;
    production rules are never edited in place.
13. Retries are idempotent, intentional reruns remain traceable, equivalent
    content may be deduplicated without losing execution history, and alerts
    consume rather than calculate immutable evidence.
14. The engine owns deterministic evidence generation, not acquisition,
    authentication, user state, alert delivery, AI, Decision Confidence,
    trading decisions, execution, advice, validation claims, or promotion.

## Candidate Implementation Detour

During the workshop, the founder requested validation of the migrated engine
and supplied the original Stellar Evidence and Stellar Orbit ThinkScript. The
legacy baseline was fingerprint-protected. Bidirectional ThinkScript candidates
and Technical Evidence Engine v2 Candidate 2 were implemented on
`codex/evidence-engine-v2`.

Candidate 2 processed one local 633-symbol export:

| Classification | Count |
|---|---:|
| Bullish | 187 |
| Bullish Watch | 148 |
| Bearish | 49 |
| Bearish Watch | 149 |
| Neutral | 91 |
| Incomplete | 9 |

The run demonstrated bidirectional ingestion, reconciliation, determinism,
incomplete handling, explanations, and on-demand reporting. It did not
establish predictive validity. Founder chart review, multiple dated runs,
neutral-state investigation, and approved outcome evaluation remain open.

## Deliverables

- [Evidence Engine Specification](../engineering/Evidence-Engine-Specification.md)
- [ADR-008 - Evidence Engine Governance](../governance/decisions/ADR-008-Evidence-Engine-Governance.md)
- Updated [Product Decision Log](../Product-Decision-Log.md)
- Updated [Evidence History and Validation](../Evidence-History-and-Validation.md)
- Updated [Architecture Workshop Plan](Architecture-Workshop-Plan.md)
- Candidate validation records under `analytics-engine/docs/`

## Risks and Open Questions

- Candidate weights, allocations, and classification thresholds remain
  unvalidated hypotheses.
- Neutral results were described as noisy and require structured review.
- Candidate 2 and founder expectation disagreed on at least one representative
  symbol; disagreement must remain visible during validation.
- Weekly and monthly Stellar Evidence are supplemental until a later approved
  ruleset defines additional influence.
- One cross-sectional export cannot establish stability or outcomes.
- Market-data provider, universe licensing, and automated data acquisition
  remain deferred.

## Deferred Scope

- Production promotion of Candidate 2
- Candidate 3 unless validation evidence justifies material changes
- Automated S&P, Nasdaq, or Russell universe execution
- Historical outcome methodology and predictive claims
- AI workflow behavior, prompts, evaluations, cost, latency, and failures
- Production release and operational readiness

## Next Workshop

Workshop #7 defines the AI Workflow: grounded context, permitted and prohibited
outputs, prompt and evaluation contracts, cost, latency, and failure handling.

## Repository Closure

This summary, the Evidence Engine specification, ADR-008, decision-log updates,
and candidate validation records are the durable Workshop #6 record. Chat
history is not required to recover the approved decisions.
