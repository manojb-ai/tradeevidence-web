# ADR-007 - MVP Application Architecture

## Status

Accepted

## Date

2026-08-02

## Context

The approved MVP slice, data model, and `/api/v1` contract require implementation boundaries that preserve analytical run integrity, user isolation, explainability, browser performance, provider independence, and a practical path from MVP operation to materially larger scale. Premature microservices would add operational cost, while an undisciplined single application would permit UI, persistence, authorization, and scoring responsibilities to collapse together.

## Decision

TradeEvidence Phase 1 uses one horizontally scalable Next.js 16 modular monolith for the public website, authenticated product, and internal `/api/v1`. The deterministic analytics engine remains a separate versioned producer and never becomes request-time web scoring.

The application adopts pragmatic Clean Architecture. Delivery adapters call shared application use cases; domain and application code remain independent from Next.js, React, persistence clients, and providers; infrastructure implements meaningful ports. Server Components call use cases directly, while browser interactions use thin Route Handlers implementing `/api/v1`.

Server Components are the default and Client Components are bounded interactive islands. Frontend code is organized by feature with reusable product-agnostic UI primitives. Eligible features preserve a future approved-widget boundary, but user-created dashboards and a grid dependency are deferred.

`https://www.tradeevidence.com` is the canonical production origin. Public, authentication, product, and API route boundaries remain same-origin for the MVP. Protected routes derive identity server-side and enforce authorization at every use case. Normal staff receive no bypass; exceptional access is separate, selective, strongly authenticated, time-bounded where practical, and audited.

Caching separates immutable/run-specific universal analytics from current-publication pointers and private responses. PostgreSQL remains authoritative. A future CDN and distributed in-memory layer may accelerate shared reads and coordination but cannot become the integrity or ownership authority.

The browser holds only bounded interaction state, preserves the active analytical run, and performs mutations through `/api/v1` with validation, idempotency, and concurrency controls. Resilience uses explicit degraded states, bounded dependencies, feature isolation, safe telemetry, and layered DoS/abuse controls.

Architecture, domain, database, contract, component, browser, security, performance, and scale tests enforce these boundaries. Human review remains mandatory for Level 3 concerns and releases.

## Consequences

- MVP delivery and operation avoid premature distributed-system complexity.
- One deployment may scale horizontally without changing approved API semantics.
- Internal dependency rules and architecture tests are required to prevent modular erosion.
- Server rendering and browser APIs share behavior without inefficient self-HTTP calls.
- Universal analytical caching can scale independently from owner-scoped product responses.
- PostgreSQL remains the system of record even if a distributed in-memory cache is introduced.
- Provider and infrastructure selections remain reversible behind explicit adapters.
- Future dashboard composition is possible without making it an MVP commitment.
- A defect may still affect one deployable application, so isolation, testing, observability, and rollback are material requirements.

## Alternatives Considered

- **Microservices from inception:** rejected because current scale, team ownership, and operational requirements do not justify distributed coordination and deployment cost.
- **UI calling its own Route Handlers during server rendering:** rejected because it creates an unnecessary HTTP round trip and a second opportunity for behavior divergence.
- **Direct database access from pages and handlers:** rejected because it bypasses authorization, run-consistency, testing, and provider-independent boundaries.
- **Rigid Clean Architecture ceremony:** rejected in favor of enforceable dependency direction with abstractions only at meaningful boundaries.
- **Distributed in-memory database as system of record:** rejected because ownership, lineage, publication, and analytical history require durable relational integrity.
- **Configurable dashboard in MVP:** deferred until the default workflow is validated and user demand justifies persistence, accessibility, migration, and layout complexity.

## Related Documents

- [MVP Application Architecture](../../engineering/MVP-Application-Architecture.md)
- [API Contracts v1](../../engineering/API-Contracts-v1.md)
- [MVP Data Schema](../../engineering/MVP-Data-Schema.md)
- [Workshop #5 Summary](../../workshops/Workshop-05-Summary.md)
