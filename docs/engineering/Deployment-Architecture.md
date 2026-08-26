# Deployment Architecture

- **Status:** Approved
- **Version:** 1.0
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-08-25
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [MVP-Application-Architecture.md](MVP-Application-Architecture.md), [MVP-Data-Schema.md](MVP-Data-Schema.md), [Observability-and-Operations.md](Observability-and-Operations.md), [Security-and-Privacy-Baseline.md](Security-and-Privacy-Baseline.md), [../governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md](../governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md)

## Environment and Promotion Model

TradeEvidence uses isolated local, automated test/preview, staging, and
production environment classes. Each has separate databases, storage,
credentials, encryption keys, provider settings, AI budgets, and access.
Production user data is not copied down; synthetic or approved sanitized data
supports lower environments.

Staging is persistent and production-like. Controlled beta runs in protected
production with invitations and feature controls, not in development. Code,
migrations, analytics rulesets, and AI configurations move through one
controlled pipeline. The exact immutable artifact tested in staging is promoted
to production. A merge is not release authorization; the founder approves each
production release.

## Production Topology

- Managed DNS, CDN, DDoS controls, and web application firewall at the edge.
- Horizontally scalable, stateless Next.js modular-monolith instances.
- Managed PostgreSQL as the authoritative transactional store.
- Managed encrypted object storage for immutable artifacts and exports.
- Managed queues and independent workers for ingestion, reports, AI,
  notifications, and long-running operations.
- A distributed cache/rate-limit store when multiple instances or measured
  volume require coordinated ephemeral state.
- A separately versioned deterministic analytics producer that publishes only
  through the approved ingestion boundary.
- Provider-neutral adapters for authentication, market data, AI, email,
  payments, and observability.

Databases, queues, caches, workers, and origins are not unnecessarily public.
Application instances hold no durable local state. Long work does not block web
requests. Infrastructure configuration is version controlled where practical.
MVP does not require microservices, Kubernetes, or an in-memory authoritative
database.

## Capacity and Abuse Protection

Every endpoint has bounded body, result, time, concurrency, retry, and resource
behavior. Layered protection combines edge controls, bot/WAF rules,
identity/session/network/endpoint-aware rate limits, database pooling and query
timeouts, cache control, queue limits, circuit breakers, and load shedding.
Optional AI, exports, and reports degrade before sign-in and deterministic
evidence review.

Before beta, representative tests cover expected load plus bursts, at least 100
concurrent active-user journeys, live publication, cache loss, queue buildup,
database pressure, provider degradation, abuse, and recovery. Future large
scale may add broader CDN use, distributed caching, replicas, partitioning, or
service extraction only from measured need.

## Migrations, Backup, and Recovery

Database changes are ordered, source controlled, and normally use expand/migrate/
contract releases. Production migration identity is restricted; application
startup does not mutate production schema. Destructive changes require founder
approval, preservation, verified backup, and tested recovery. Backfills are
observable and resumable. Migrations never silently recalculate history.

PostgreSQL uses encrypted backups and point-in-time recovery. Object storage
uses encryption, versioning or equivalent protection, retention, and integrity
checks. Recovery credentials are isolated from ordinary application access.
Restore tests occur before beta and at least quarterly, verifying integrity,
ownership, references, lineage, authentication linkage, and application use.

Initial targets are RPO at most 15 minutes and essential read/account RTO at
most four hours. User deletion is reapplied after restore. Reproducible
analytics artifacts may be regenerated from preserved inputs, lineage, and
ruleset versions.

## Release and Recovery Controls

Merging, deploying, enabling, and releasing are separate. Server-controlled,
audited feature flags protect incomplete or Level 3 behavior. Flags have owners,
defaults, purpose, review date, and removal conditions. Independent kill
switches cover AI, publication, providers, exports, and other risky capabilities.

Application rollback restores a compatible approved artifact. Database recovery
normally moves forward through a corrective migration. Bad analytics publication
returns the pointer to the prior approved immutable run. AI rollback restores
the prior approved workflow recipe. Procedures are rehearsed before beta and
each release receives a monitored observation period.

Vendor commitments remain separate human decisions based on security,
reliability, privacy, U.S. business needs, cost, portability, and exit options.
