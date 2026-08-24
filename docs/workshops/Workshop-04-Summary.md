# Workshop #4 Summary

**Status:** Completed
**Completion Date:** 2026-08-02
**Owner:** Founder and Chief Software Architect
**Scope:** MVP API contracts
**AI-DLC Level:** Level 3 - Controlled

## Objective

Define stable, provider-independent API contracts for the approved Homepage-to-Decision-Workspace vertical slice while preserving analytical integrity, non-advisory language, user isolation, compatibility, and safe failure behavior.

## Approved Decisions

1. Phase 1 uses an internal resource-oriented JSON API under long-lived `/api/v1`, with consistent naming, values, envelopes, and major-version guardrails.
2. APIs derive internal user identity from verified authentication, never trust client-supplied ownership, conceal cross-user resources, and reserve exceptional staff access for a separate audited boundary.
3. Analytical responses resolve through the publication pointer or explicit accessible run, remain pinned to one complete run, and expose server-owned freshness and observation basis.
4. The Homepage endpoint returns one compact universal briefing and persisted Evidence-Aligned Opportunity selection without request-time ranking or personalization.
5. The Decision Workspace endpoint returns a compact same-run overview with context, Evidence summary, Devil's Advocate, Decision Confidence, invalidation, strategy education, checklist, and AI entry point without scoring or AI generation.
6. The Evidence endpoint exposes versioned factor observations, status, effects, contributions, explanations, coverage, contradictions, and score reconciliation while keeping Evidence distinct from Decision Confidence and Strategy Alignment.
7. Owner-scoped Watchlist APIs support private CRUD, idempotent membership, immutable source provenance, current same-run overlays, and ETag concurrency.
8. Ask TradeEvidence uses server-built bounded snapshot context and returns structured educational responses with traceable evidence, counterpoints, missing information, guardrails, session-only behavior, and idempotent retries.
9. Historical APIs return compact, cursor-paginated, like-for-like series with explicit comparison basis and publication revision lineage. Outcome presentation remains deferred.
10. All APIs share stable errors, safe HTTP semantics, retry guidance, idempotency, concurrency controls, degraded-state handling, ownership concealment, and request correlation.
11. API acceptance requires aligned human/machine contracts, positive and negative security/integrity/compatibility tests, measured performance, private cache safety, safe telemetry, and continued exclusion of deferred modules.

## Deliverables

- [API Contracts v1](../engineering/API-Contracts-v1.md)
- [OpenAPI v1 Contract](../engineering/openapi-v1.json)
- [ADR-006 - Internal API Contract and Evolution](../governance/decisions/ADR-006-Internal-API-Contract-and-Evolution.md)
- Updated [Product Decision Log](../Product-Decision-Log.md)
- Updated [Architecture Workshop Plan](Architecture-Workshop-Plan.md)

## Risks and Open Questions

- Authentication provider and session mechanism remain deferred.
- Backend framework, cache technology, service decomposition, and deployment topology remain deferred to Workshop 5.
- AI provider, prompt implementation, evaluations, latency, cost, and ephemeral session storage remain deferred to Workshop 7.
- Exact rate limits, private-data retention, privileged administration, and security operations remain deferred to Delivery Readiness.
- Current scoring weights remain unvalidated hypotheses.
- Machine-readable schemas intentionally remain a contract skeleton and require implementation refinement without semantic divergence.

## Deferred API Modules

- Portfolio and holdings
- Trades
- Journal and Decision Snapshots
- Persistent AI conversations (subsequently superseded by Workshop #7's opt-in 1/3/7-day maximum AI history contract)
- Brokerage integration
- Alerts
- Public partner API
- Staff administration

## Next Workshop

Workshop #5 defines frontend and backend architecture: routes, components, state, caching, service boundaries, modules, and test seams that implement the approved APIs without changing their semantics.

## Repository Closure

This summary and its linked API specification, OpenAPI contract, and ADR are the durable Workshop #4 record.
