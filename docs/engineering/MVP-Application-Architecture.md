# MVP Application Architecture

- **Status:** Approved
- **Version:** 1.1
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-08-23
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [Master-System-Architecture.md](Master-System-Architecture.md), [MVP-Implementation-Spec.md](MVP-Implementation-Spec.md), [MVP-Data-Schema.md](MVP-Data-Schema.md), [API-Contracts-v1.md](API-Contracts-v1.md), [../governance/decisions/ADR-007-MVP-Application-Architecture.md](../governance/decisions/ADR-007-MVP-Application-Architecture.md), [../workshops/Workshop-05-Summary.md](../workshops/Workshop-05-Summary.md)

## Purpose

This specification defines the frontend and backend architecture for the approved MVP vertical slice. It governs application topology, routes, components, state, caching, services, modules, authentication boundaries, resilience, and test seams. It implements the approved product, persistence, and API semantics without changing them.

## 1. Application Topology

Phase 1 is a modular monolith deployed as one Next.js 16 application. It contains the public website, authenticated product UI, and internal `/api/v1` delivery boundary. The deterministic analytics engine remains a separate producer of versioned analytical records and never executes scoring inside an interactive web request.

One deployable application does not mean one process or server. Identical stateless instances may run behind a load balancer. Independent services are introduced only when measured scaling, reliability, security, or team ownership needs justify their operational cost.

### Delivery paths

```text
Browser interaction -> /api/v1 Route Handler -> application use case
Server Component ---------------------------> application use case
                                                   |
                                            domain policy
                                                   |
                                             port/interface
                                                   |
                                      infrastructure adapter
```

Route Handlers are thin HTTP adapters. Server Components call application use cases directly and do not make HTTP requests to the application's own Route Handlers. Both paths use the same authorization, run-integrity, and domain behavior.

## 2. Canonical Origin and Routes

The canonical production origin is `https://www.tradeevidence.com`.

- HTTP, apex-domain, and other approved aliases redirect to the canonical HTTPS `www` origin while preserving safe paths.
- Public pages are indexable and use canonical metadata.
- Authenticated routes, authentication callbacks, API responses, preview environments, and private data are not indexed.
- Protected return paths survive sign-in only after validation as same-origin internal destinations.
- Product routes and `/api/v1` remain same-origin for the MVP.
- Session cookies are host-only where practical and are not automatically shared with future subdomains.
- A separate `app.tradeevidence.com` deployment remains deferred until a concrete operational need exists.

### Route map

```text
app/
|-- (public)/page.tsx                         -> /
|-- (auth)/...                                -> authentication flows
|-- (product)/home/page.tsx                   -> /home
|-- (product)/workspace/[symbol]/page.tsx     -> /workspace/{symbol}
|-- (product)/workspace/[symbol]/evidence/
|   `-- page.tsx                              -> /workspace/{symbol}/evidence
|-- (product)/watchlists/page.tsx             -> /watchlists
|-- (product)/watchlists/[watchlistId]/page.tsx
|                                              -> /watchlists/{watchlistId}
`-- api/v1/...                                -> approved internal API
```

The symbol is a human-friendly route key, not permanent identity. The server resolves it to the canonical instrument ID. Ask TradeEvidence, Devil's Advocate, strategy education, invalidation conditions, checklist, and initial history stay within the relevant Workspace or Evidence surface. Deferred modules receive no speculative routes.

## 3. Server and Client Components

Server Components are the default. They verify sessions, call application use cases, pin initial analytical data to one run, keep secrets on the server, and render stable content.

Client Components are bounded interactive islands for panels, tabs, filters, watchlist mutations, Ask TradeEvidence submission, retry controls, themes, and accessible browser interactions.

Client Components never import repositories, database clients, provider SDKs, privileged services, or analytics-engine code. The browser never calculates authoritative Evidence Scores, Decision Confidence, rankings, freshness, or publication state. Only the minimum serializable view model crosses the server/client boundary.

## 4. Feature and Widget Architecture

Frontend code is organized by product feature, with generic presentation primitives kept separate.

```text
src/
|-- features/
|   |-- homepage/
|   |-- workspace/
|   |-- evidence/
|   |-- watchlists/
|   `-- ask-tradeevidence/
|-- components/
|   |-- ui/
|   `-- shared/
`-- dashboard/
    |-- widget-contract.ts
    `-- widget-catalog.ts
```

Each feature owns its presentation, view models, bounded client interactions, explicit display states, and tests. Pages compose features and do not reimplement them. Features cannot import another feature's internal files.

Reusable UI primitives contain no scoring, authorization, persistence, or workflow rules. Technical Evidence Score and Decision Confidence remain distinct concepts and components even when displayed together.

### Future configurable dashboards

The MVP ships a deliberately designed default Homepage. User-created dashboards, drag-and-drop layout, and a grid dependency are deferred. Eligible features must nevertheless be capable of becoming approved widgets later through:

- a stable widget type and versioned settings schema;
- a narrow server-built view model;
- ready, empty, stale, incomplete, unavailable, and error states;
- responsive size and accessibility constraints;
- declared authorization and cache classification;
- no ownership of authoritative analytical calculations.

Future users may arrange only TradeEvidence-approved widgets, not execute arbitrary JavaScript. Saved layouts contain widget placement and permitted settings, never copied analytical results. Required disclosures cannot be removed through customization, and reset-to-default remains available.

## 5. Pragmatic Clean Architecture

Backend dependencies point inward:

```text
Next.js delivery -> application use cases -> domain rules
                                              ^
                                              |
                                  ports implemented by infrastructure
```

Domain-oriented modules include identity and access, instruments, analytical publications, Homepage opportunities, Decision Workspace, Technical Evidence, watchlists, history, Ask TradeEvidence boundary, and analytics ingestion/publication.

- Delivery adapters handle HTTP or rendering concerns.
- Application services coordinate use cases.
- Domain policies enforce ownership, publication, run consistency, and state transitions.
- Ports define meaningful persistence or provider boundaries.
- Infrastructure adapters implement PostgreSQL, authentication, object-storage, analytics-ingestion, and future AI connections.
- Server Components and Route Handlers call application services, never repositories.

Domain and application code cannot import Next.js, React, database clients, or provider SDKs. No dependency-injection framework is required in the MVP; wiring remains explicit. Interfaces and domain entities are introduced where behavior, invariants, security, provider independence, or testing justify them—not for layer-for-layer's sake.

The analytics engine submits versioned candidate outputs through controlled ingestion. The web application validates lineage and completeness before publication, reads published results, and never imports or duplicates scoring internals.

## 6. Data Access and Contract Mapping

Database rows, domain values, application results, API representations, and page/widget view models are separate boundaries. Raw rows do not reach UI code, and internal domain objects are not serialized automatically.

Server-rendered pages call use cases directly. Browser interactions use same-origin `/api/v1`. Both delivery paths share authorization and analytical policies. OpenAPI remains the browser contract authority; generated or checked types do not replace runtime validation or contract tests.

Composite orchestration is performed in the application layer. It pins required analytical data to one `analysisRunId`, resolves server-owned freshness, and refuses mixed required data. A new publication may be advertised but never silently replaces an active review.

Platform capabilities and small adapters are preferred initially. A generalized client fetching library is added only when measured polling, optimistic coordination, or complex client caching warrants it.

## 7. Caching and Scale Evolution

Cache policy follows data semantics.

### Immutable analytics

Published snapshots and artifacts may be cached by run, snapshot/instrument, engine/ruleset, and representation version. Corrections create a new revision or publication rather than overwriting cached history.

### Current publication

The mutable current-publication pointer uses short-lived or explicit revalidation. Publication triggers targeted invalidation or warming. Stampede protection is required before high-volume operation. Active reviews remain pinned to their selected run.

### Universal and private data

Universal same-run analytical read models may use shared caches. Authentication-aware final responses, watchlists, dashboard layouts, and Ask TradeEvidence are private and never enter a shared public cache. Universal data may be cached underneath a private page, but user-specific response envelopes remain isolated.

Cache keys include domain identity, run, representation version, and ownership classification where applicable. Caching never removes stale/incomplete labels, changes publication eligibility, mixes runs, or performs request-time scoring or AI generation.

### Scale path

Phase 1 uses Next.js caching and PostgreSQL-backed read models without requiring Redis. Multiple-instance or high-volume deployment may add CDN caching and a distributed in-memory system for read models, coordinated invalidation, stampede locks, rate-limit counters, short-lived idempotency, and ephemeral workflow state.

The distributed in-memory layer is non-authoritative. PostgreSQL remains authoritative for users, ownership, publications, lineage, analytical records, watchlists, and future dashboards. A cache failure may reduce performance but cannot corrupt state or weaken isolation.

Load, cache-hit ratio, latency, saturation, and error measurements trigger infrastructure evolution; concurrent-user count alone does not.

## 8. Client State and Mutations

- URLs own shareable navigation state.
- Server results own authoritative analytical and persistent state.
- Local component state owns temporary interactions and drafts.
- Shared client context is limited to true interface-wide concerns such as theme.
- No global state library is introduced without demonstrated cross-feature need.
- Sensitive records are not casually persisted in browser storage.

Mutations go through `/api/v1`, use runtime validation, and return authoritative state. Watchlists use ETags; repeatable creates use idempotency. Optimism is limited to easily reversible, low-risk interactions. The client never fabricates analytical, publication, AI, or ownership-sensitive success.

Client requests preserve the active run. Background refresh cannot replace it. Future dashboard editing uses a local draft and revision/ETag-checked save; failed saves preserve the last stored layout. Ask TradeEvidence history is Off by default; owner-selected 1-, 3-, or 7-day history is server persisted, encrypted, expiry-bound, and never stored as casual browser state.

## 9. Identity, Authorization, and Abuse Resistance

TradeEvidence uses a provider-independent identity adapter around a standards-based authentication provider selected before implementation. The application stores a stable internal user and links provider identity by immutable issuer and subject, never by email ownership.

Production sessions use secure, HTTP-only, appropriately SameSite, narrowly scoped cookies. Tokens and secrets never enter client storage, URLs, analytics, or logs. Proxy may provide an early route check but is never the sole authorization control.

Production traffic uses HTTPS and encrypted service connections. Databases,
object storage, replicas, snapshots, backups, and saved AI content use
encryption at rest. Clear passwords are never stored or logged; a dedicated
authentication provider is preferred, and any future direct password handling
stores only an approved salted adaptive one-way hash.

Every protected use case derives identity from verified authentication and independently verifies ownership or permission. Client-supplied owner identity is never authoritative. Repository queries include owner scope. Cross-user private resources are concealed as not found. Server and API paths share the same policies.

Normal staff accounts have no private-data bypass. Exceptional staff access is a separate administrative boundary requiring specific authorization, MFA/step-up authentication, least privilege, recorded reason, time limitation where practical, immutable audit, visible active-access indication, and periodic review. It is outside MVP product routes.

### DoS and abuse resistance

Protection is layered across managed DNS/CDN DDoS controls, WAF/bot controls, endpoint rate limits, authentication safeguards, request budgets, and dependency protection. Production origins should not be unnecessarily exposed around the edge boundary.

Limits combine identity, session, network, endpoint cost, and behavior where appropriate. Each endpoint has bounded body, result, timeout, concurrency, and retry behavior. Ask TradeEvidence, authentication, mutations, ingestion, and future dashboard saves receive cost-appropriate limits. Database pooling, query timeouts, circuit breakers, queues, load shedding, and retry control protect downstream dependencies.

## 10. Resilience and Observability

Major pages and widgets implement loading, empty, stale, incomplete, unavailable, authorization-safe not-found, retryable, and permanent-error states. Optional failures remain isolated; required analytical-integrity failures fail closed.

External calls use timeouts, bounded safe retries, jittered backoff, circuit breakers, and concurrency limits. Mutations retry only when idempotent. Noninteractive work uses queues. Under overload, expensive optional features degrade before core deterministic evidence review. Structured `429` and `503` responses provide safe guidance without revealing infrastructure.

Structured logs, metrics, traces, security events, and support-safe correlation IDs cover route/use-case outcomes, latency, dependencies, cache outcomes, safe run/publication identity, degraded states, retry/timeout/rate-limit events, authorization outcomes, and privileged access.

Tokens, secrets, raw sensitive bodies, unnecessary personal information, and full AI prompts/responses are not logged by default. Liveness and readiness are distinct. Workshop #8 defines approved thresholds, retention, alerts, and incident controls; concrete providers remain human selections.

## 11. Verification and Acceptance

### Test seams

- Domain/application tests cover publication, run consistency, completeness, ownership, concurrency, idempotency, and degradation without Next.js.
- Real-database integration tests cover constraints, transactions, scoped queries, immutability, publication, cache behavior, and rollback.
- API contract tests verify OpenAPI shapes, errors, authentication, concealment, run pinning, headers, ETags, idempotency, and sensitive-data exclusion.
- Component tests cover every explicit display state, responsive behavior, required disclosures, and accessibility.
- End-to-end tests cover sign-in through Homepage, Workspace, Evidence, watchlist, bounded AI, and safe recovery, including negative paths.
- Architecture tests reject forbidden UI-to-infrastructure, cross-feature-internal, domain-to-framework, web-to-engine, and private-to-universal-cache dependencies.

### Browser policy

TradeEvidence supports the latest two stable desktop releases of Chrome, Edge, Firefox, and Safari; current major Android Chrome and iPhone/iPad Safari; and Firefox ESR where practical. The installed Next.js 16.2.10 technical baseline is Chrome 111+, Edge 111+, Firefox 111+, and Safari 16.4+.

Automated end-to-end coverage uses Chromium, Firefox, and WebKit. Release confidence includes representative real or hosted-device mobile Safari testing, responsive layouts, keyboard navigation, screen-reader semantics, contrast, zoom, and reduced motion. Core evidence review cannot depend on optional drag-and-drop enhancement.

### Performance and scale

Workshop 2 and 4 targets remain binding, including Homepage LCP/core-content objectives, cached Homepage below 200 ms, normal Workspace/Evidence/watchlist operations below their approved thresholds, and bounded payload/query sizes.

Pre-growth load tests cover sustained and burst traffic, cache hit/miss, invalidation, stampedes, connection saturation, horizontal scaling, retry amplification, degradation, rate limits, and expensive-endpoint isolation.

### Human gates

Human approval remains mandatory for scoring semantics, financial language, authentication/authorization, sensitive data, privileged access, production architecture, material AI behavior, and releases. A feature is complete only when requirements, implementation, tests, contracts, security behavior, and documentation agree.

## Deferred Decisions

- Authentication provider and final session library selection
- Hosting, CDN/WAF, distributed-cache, observability, and queue vendors
- User-created dashboard implementation and grid library
- AI provider/model selection, exact pricing/allowances, and measured operational thresholds under the approved AI Workflow Contract
- Endpoint-specific production rate-limit values and vendor-specific operational configuration under the approved Delivery Readiness baseline
- Portfolio, trades, journal, alerts, brokerage, staff administration, and public partner API
