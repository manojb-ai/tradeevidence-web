# Workshop #3 Summary

**Status:** Completed
**Completion Date:** 2026-08-02
**Owner:** Founder and Chief Software Architect
**Scope:** MVP data schema
**AI-DLC Level:** Level 3 - Controlled

## Objective

Define the implementation-ready entities, schema boundaries, lifecycle, lineage, integrity constraints, query strategy, versioning, and privacy boundaries required by the approved MVP vertical slice.

## Approved Decisions

1. Immutable object storage and a PostgreSQL-compatible operational database have complementary authority.
2. Opaque UUIDv7 identities, stable instruments, single-run ownership, and transactional publication prevent mixed or partial history.
3. Core facts use relational columns and child tables; bounded evolving metadata uses versioned JSON.
4. Market observations preserve type, session, interval, exchange date, timestamp, source version, adjustment policy, and like-for-like comparison identity. Phase 1 corporate actions are bounded to events that protect price, return, identity, and survivorship integrity.
5. The first physical schema contains only the reference, universe, market-data, analytical-run, analytical-snapshot, outcome, user, and watchlist domains needed by the slice.
6. Database constraints enforce lifecycle, uniqueness, range, referential integrity, publication safety, and immutable published history.
7. Indexes prioritize current publication, Homepage, Decision Workspace, watchlist, trend, outcome, and audit queries; partitioning is deferred until measured need.
8. Engine, rules, confidence, selection, strategy, payload, database, explanation, universe, market-data, outcome, and AI versions evolve independently through explicit contracts and migrations.
9. Internal user identity is separated from authentication-provider identity. Private data is deny-by-default; privileged staff access is selective, authorized, and audited.
10. Run IDs, bundle checksums, and normalized analytical fingerprints provide retry safety, semantic duplicate detection, failure isolation, and complete lineage.
11. Outcome measurements are append-only, versioned, correction-preserving observations; missing or interrupted results are classified rather than treated as zero.
12. Schema closure requires implementation-ready entity, type, constraint, lifecycle, lineage, index, migration, privacy, test, risk, and deferred-scope documentation.

## Deliverables

- [MVP Data Schema](../engineering/MVP-Data-Schema.md)
- [ADR-005 - MVP Persistence and Data Integrity](../governance/decisions/ADR-005-MVP-Persistence-and-Data-Integrity.md)
- Updated [Product Decision Log](../Product-Decision-Log.md)
- Updated [Architecture Workshop Plan](Architecture-Workshop-Plan.md)

## Alert Clarification

Future alerts are derived from immutable analytical records. Their model separates versioned definitions, immutable evaluation/events, and mutable delivery or acknowledgement state. Alert tables are deferred until the alert workflow is specified.

## Risks and Open Questions

- Current analytical weights remain unvalidated hypotheses.
- Market-data licensing and provider selection remain unresolved.
- Authentication provider, storage vendors, ORM, and migration framework remain deferred.
- Personal-data retention, export, deletion, and infrastructure access controls require the security and privacy specification.
- Complex corporate actions may require manual review.
- Query performance and backup/restore behavior require representative implementation testing.

## Next Workshop

Workshop #4 defines provider-independent API contracts for Homepage, Decision Workspace, Evidence, grounded AI explanation, watchlists, and the error model. Portfolio APIs remain constrained by the approved MVP slice and deferred data entities.

## Repository Closure

This summary and its linked schema and ADR are the durable Workshop #3 record. Future implementation must treat them as constraints unless superseded by an approved decision.
