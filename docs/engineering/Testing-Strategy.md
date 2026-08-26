# Testing Strategy

- **Status:** Approved
- **Version:** 1.0
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-08-25
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [TradeEvidence-Engineering-Lifecycle.md](TradeEvidence-Engineering-Lifecycle.md), [AI-DLC-Phase-Gates.md](AI-DLC-Phase-Gates.md), [Definition-of-Done.md](Definition-of-Done.md), [Evidence-Engine-Specification.md](Evidence-Engine-Specification.md), [AI-Workflow-Contract.md](AI-Workflow-Contract.md), [../governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md](../governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md)

## Purpose

Define the evidence required to claim that TradeEvidence behavior is correct,
safe, compatible, operable, and ready for human approval. Test volume or code
coverage alone is not proof of correctness.

## Risk-Based Test Model

Test depth follows the approved AI-DLC level. Level 1 changes receive
proportionate automated checks. Level 2 features require unit, integration,
acceptance, and regression coverage. Level 3 changes require explicit threat or
failure analysis, relevant security and evaluation evidence, documentation, and
human approval.

Required layers are:

1. **Unit:** domain rules, calculations, validation, authorization decisions,
   transformations, and presentation rules in isolation.
2. **Contract:** `/api/v1`, OpenAPI, analytics bundles, provider adapters, error
   shapes, versioning, and compatibility.
3. **Database integration:** real PostgreSQL constraints, transactions,
   ownership isolation, immutability, publication, concurrency, migrations,
   backfills, and rollback behavior.
4. **Application integration:** UI, use cases, database, cache, queues,
   authentication, analytics artifacts, and provider adapters.
5. **Component and browser:** explicit display states, responsive behavior,
   accessibility, and essential journeys across supported browsers.
6. **Security:** authentication, server-side authorization, concealment,
   cross-user negative tests, privileged access, rate limits, secret handling,
   dependency findings, and common web attacks.
7. **Analytics regression:** approved fixtures prove reproducible
   classifications, contributions, explanations, lineage, and versions without
   claiming predictive validation.
8. **AI evaluation:** the approved versioned dataset covers normal, ambiguous,
   stale, incomplete, adversarial, privacy, proprietary, cost, and failure
   behavior. It never replaces deterministic or security testing.
9. **Performance and resilience:** representative load, bursts, dependency
   degradation, retry behavior, queues, recovery, and abuse controls.
10. **Human validation:** the founder reviews material financial language,
    analytics behavior, AI behavior, security exceptions, and releases.

## Required Test Environments and Data

Unit tests may use in-memory collaborators. Persistence behavior uses a real
PostgreSQL test database. Browser and integration tests use isolated test or
preview environments. Staging provides production-like validation.

Production user data is not copied down. Tests use synthetic data, approved
sanitized fixtures, and intentionally sanitized market-data samples. Generated
reports and local exports are not committed unless approved as fixtures.

## Merge and Release Gates

Every change runs formatting, linting, type checking, relevant tests, secret
scanning, dependency checks, and a production build. Impacted Level 3 areas add
their database, analytics, AI, browser, accessibility, security, migration,
performance, or recovery suites.

Cross-user disclosure, corrupted evidence, unsupported financial language,
critical AI-boundary failure, proprietary disclosure, credential exposure, or
an unresolved critical vulnerability blocks release. Flaky required tests are
defects and cannot be normalized through blind retries.

## Test Evidence

Pull requests identify requirements, risk level, affected contracts, suites
run, results, exclusions, fixtures, and human approvals. Performance evidence
records workload, data volume, environment, bottlenecks, cost, and failure
behavior. Production defects become regression tests when practical.

## Ownership

AI may generate tests and review results but cannot approve its own Level 3
work. The founder retains approval of scoring methodology, AI boundaries,
authentication and authorization, material security risk, and releases.
