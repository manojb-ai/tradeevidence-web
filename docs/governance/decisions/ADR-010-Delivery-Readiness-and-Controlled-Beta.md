# ADR-010 - Delivery Readiness and Controlled Beta

## Status

Accepted

## Date

2026-08-25

## Context

TradeEvidence has approved product, data, API, application, Evidence Engine, and
AI Workflow contracts. Construction now requires one enforceable delivery model
covering environments, testing, security, deployment, recovery, operations,
release authority, and the first implementation sequence. Financial language,
private user data, deterministic scoring, AI behavior, and production operations
make this Level 3 controlled work.

## Decision

TradeEvidence adopts isolated local, test/preview, staging, and production
environment classes. Production user data and secrets do not move down. The
same immutable staging-approved artifact is promoted through a controlled
pipeline; merge, deploy, enable, and release remain separate. The founder is the
production release owner.

Quality uses layered, risk-based unit, contract, real-database, integration,
browser, accessibility, security, analytics-regression, AI-evaluation,
performance, resilience, and human testing. Critical ownership, security,
evidence-integrity, proprietary, financial-boundary, credential, and AI failures
block release. Protected-main and pull-request controls require synchronized
code, tests, contracts, migrations, observability, rollback, and documentation.

Security is deny by default. Normal users and staff have no cross-user access.
Exceptional staff access is selective, authorized, least-privileged, bounded,
revocable, and audited. Data is encrypted in transit and at rest; clear
passwords and secrets are never stored or logged. AI history remains Off by
default with user-selected 1-, 3-, or 7-day retention.

Production uses a managed edge, horizontally scalable stateless Next.js modular
monolith, managed PostgreSQL, encrypted immutable object storage, queues and
workers, optional measured distributed caching, provider-neutral adapters, and
a separately versioned analytics producer. It does not require microservices,
Kubernetes, or an in-memory authoritative database for MVP.

Migrations are ordered and source controlled. Backups, point-in-time recovery,
object version protection, and isolated recovery credentials are verified by
restore exercises before beta and quarterly. Initial targets are RPO no greater
than 15 minutes and essential-service RTO no greater than four hours.

Privacy-safe metrics, logs, traces, audits, synthetic journeys, and business
health signals measure complete user outcomes. Initial core beta objectives are
99.5% monthly availability, cached homepage p95 below 200 ms, uncached Workspace
p95 below 500 ms, and homepage LCP p75 below 2.5 seconds. Zero cross-user
disclosures are tolerated. Operational alert severity and incident procedures
are defined without falsely claiming staffed 24/7 support.

Layered DDoS, WAF, bot, authentication, rate, request-budget, pooling, timeout,
queue, circuit-breaker, and load-shedding controls preserve core deterministic
evidence before optional AI or expensive work. Beta validation includes at
least 100 representative concurrent active-user journeys and failure recovery.

Server-owned feature flags and independent kill switches allow gradual rollout
and isolated degradation. Application, database, analytics-publication, and AI
workflow recovery follow their respective tested procedures. Feature, release,
and controlled-beta Definitions of Done are explicit. Construction follows the
approved vertical-slice backlog with analytics validation as a parallel human-
gated track. Candidate 2 is not made production-approved by this ADR.

## Consequences

- Construction may begin from stable, reviewable gates and a dependency-ordered
  backlog.
- Controlled beta uses real production protections rather than a development
  environment.
- Operational cost and implementation work increase for staging, telemetry,
  backups, security checks, and recovery exercises.
- Managed services reduce early operational burden while provider adapters and
  immutable artifacts preserve exit options.
- Optional AI can remain disabled without blocking the deterministic MVP.
- Vendor selection, legal commitments, production scoring approval, and each
  release remain separate human decisions.

## Alternatives Considered

- **Deploy directly from main to production:** rejected because merge evidence
  is not release authorization.
- **Use production data for realistic development tests:** rejected because it
  violates isolation and data minimization.
- **Rely mainly on end-to-end tests:** rejected because domain, database,
  contract, security, analytics, and AI failures require distinct evidence.
- **Begin with microservices or Kubernetes:** rejected because MVP scale does
  not justify the complexity.
- **Treat backups as sufficient without restore tests:** rejected because an
  unrestored backup is not proven recovery.
- **Offer unlimited AI:** rejected because optional provider cost and abuse must
  not threaten deterministic service.
- **Wait to add operations and security after beta:** rejected because private
  data and Level 3 behavior require these controls before invitation.

## Related Documents

- [Testing Strategy](../../engineering/Testing-Strategy.md)
- [Security and Privacy Baseline](../../engineering/Security-and-Privacy-Baseline.md)
- [Observability and Operations](../../engineering/Observability-and-Operations.md)
- [Deployment Architecture](../../engineering/Deployment-Architecture.md)
- [Definition of Done](../../engineering/Definition-of-Done.md)
- [Workshop #8 Summary](../../workshops/Workshop-08-Summary.md)
