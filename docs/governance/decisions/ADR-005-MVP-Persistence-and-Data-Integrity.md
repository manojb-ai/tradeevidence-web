# ADR-005 - MVP Persistence and Data Integrity

## Status

Accepted

## Date

2026-08-02

## Context

The approved MVP slice requires immutable analytical history, fast current and historical queries, atomic publication, provider independence, user watchlists, and future outcome measurement. A single undifferentiated store or JSON-only application model would weaken integrity, query performance, historical interpretation, and access control.

## Decision

TradeEvidence will use two complementary persistence planes:

- Immutable object storage is the analytical system of record for accepted source files, run bundles, validation reports, and reproducibility artifacts.
- A PostgreSQL-compatible relational database is the authoritative application read model for published runs, observations, snapshots, factors, Decision Confidence, selections, outcomes, users, and watchlists.

Cache/CDN data is disposable. Provider and framework selection remain deferred.

Analytical records use opaque application IDs, stable instrument identity, explicit versions, and complete run lineage. Published analytical records are immutable. Corrections create new runs or append outcome revisions. A transactional publication pointer exposes only one complete approved run per channel.

Core searchable and constrained facts use relational columns and child tables. Versioned JSON is limited to bounded evolving metadata, diagnostics, and structured explanation parameters.

Imports use a unique run ID, bundle checksums, and a normalized analytical fingerprint. Exact retries create no duplicates; semantically equivalent executions are recorded as redundant; meaningful changes create new candidates requiring validation and human approval.

Private user information is deny-by-default and owner-isolated across application, API, database, cache, and object-access boundaries. Normal users and normal staff roles cannot access another user's private information. Exceptional staff access is narrowly scoped, explicitly authorized, and audited.

## Alert Boundary

Alerts are not part of the first physical schema. Their future model must separate:

- Versioned alert definition
- Immutable evaluation and alert event linked to analytical snapshots
- Mutable delivery and acknowledgement state

## Consequences

- The website never scans the raw archive or recalculates analytical results during a request.
- Mixed-run relationships and incompatible observation comparisons must be rejected.
- Published history cannot be silently rewritten or deleted.
- Authentication, database, object-storage, ORM, and migration vendors can be selected later without changing product semantics.
- Schema implementation requires integrity, idempotency, publication-safety, access-isolation, migration, and restore tests.
- Complex corporate actions and security exceptions require explicit review.

## Related Documents

- [MVP Data Schema](../../engineering/MVP-Data-Schema.md)
- [MVP Implementation Specification](../../engineering/MVP-Implementation-Spec.md)
- [ADR-004 - Canonical Market Observations and Retention](ADR-004-Canonical-Market-Observations-and-Retention.md)
- [Workshop #3 Summary](../../workshops/Workshop-03-Summary.md)
