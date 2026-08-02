# Workshop #5 Summary

- **Status:** Completed
- **Completion Date:** 2026-08-02
- **Owner:** Founder and Chief Software Architect
- **Scope:** Frontend and backend architecture
- **AI-DLC Level:** Level 3 - Controlled

## Objective

Define routes, components, state, caching, services, modules, security boundaries, resilience, and test seams that implement the approved MVP and `/api/v1` semantics without changing them.

## Approved Decisions

1. Phase 1 is one horizontally scalable Next.js modular monolith with a separate deterministic analytics producer and enforceable module boundaries.
2. `https://www.tradeevidence.com` is canonical; public, authenticated, and API routes remain same-origin with safe redirects, indexing, and protected return paths.
3. Server Components are the default; bounded Client Components handle browser interaction and preserve a future configurable-dashboard option.
4. Frontend features own narrow view models and explicit states, with approved widget-ready boundaries but no MVP dashboard builder or arbitrary user JavaScript.
5. Backend modules use pragmatic Clean Architecture with inward dependencies, meaningful ports, shared use cases, explicit wiring, and no framework ceremony for its own sake.
6. Server rendering calls use cases directly while browser interactions use `/api/v1`; both share authorization and same-run behavior with deliberate model mapping.
7. Caching separates immutable analytics, current publication, universal read models, and private data. PostgreSQL remains authoritative; distributed in-memory caching is an anticipated non-authoritative scale step.
8. Server state remains authoritative; client state is bounded; mutations use validation, ETags, idempotency, reversible optimism, and explicit run pinning.
9. Authentication remains provider-independent; authorization is deny-by-default at every use case; staff access is exceptional and audited; DoS and abuse protection are layered.
10. Explicit degraded states, timeouts, safe retries, circuit breakers, workload isolation, structured telemetry, and health boundaries preserve core evidence review during failures.
11. Domain, integration, API, component, end-to-end, browser, architecture, security, performance, and scale tests enforce acceptance with human Level 3 gates.

## Deliverables

- [MVP Application Architecture](../engineering/MVP-Application-Architecture.md)
- [ADR-007 - MVP Application Architecture](../governance/decisions/ADR-007-MVP-Application-Architecture.md)
- Updated [Product Decision Log](../Product-Decision-Log.md)
- Updated [Architecture Workshop Plan](Architecture-Workshop-Plan.md)

## Risks and Open Questions

- Modular-monolith boundaries can erode without dependency and architecture tests.
- Authentication, hosting, CDN/WAF, cache, queue, and observability providers remain unselected.
- Multi-instance deployment requires coordinated cache invalidation where correctness depends on it.
- User-created dashboards add layout persistence, accessibility, version migration, and support complexity and remain deferred.
- Exact traffic capacity cannot be inferred from concurrent-user count; workload and load-test evidence are required.
- Ask TradeEvidence cost, concurrency, workflow, and failure decisions remain Workshop 7 work.
- Current analytical weights remain unvalidated hypotheses.

## Deferred Scope

- User-created dashboard implementation and grid library
- Portfolio, trades, journal, alerts, brokerage, and staff administration
- AI provider and workflow implementation
- Production vendor selection, thresholds, incident runbooks, and release controls

## Next Workshop

Workshop #6 defines the Evidence Engine: pipeline, explainability, versioning, history, validation, and Devil's Advocate behavior. It must not describe current weights as predictive or historically validated.

## Repository Closure

This summary, the application-architecture specification, ADR-007, and decision-log updates are the durable Workshop #5 record.
