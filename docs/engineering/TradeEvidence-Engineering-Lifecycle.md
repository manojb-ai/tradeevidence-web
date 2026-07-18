# TradeEvidence Engineering Lifecycle

**Status:** Approved  
**Version:** 1.0  
**Owner:** Chief Software Architect  
**Last Updated:** 2026-07-18
**Related Documents:** [../governance/AI-DLC-Adoption-Policy.md](../governance/AI-DLC-Adoption-Policy.md), [AI-DLC-Phase-Gates.md](AI-DLC-Phase-Gates.md), [Engineering-Specification-Index.md](Engineering-Specification-Index.md), [../governance/decisions/ADR-001-Adopt-AI-DLC.md](../governance/decisions/ADR-001-Adopt-AI-DLC.md)

## Lifecycle

```text
Problem or Opportunity
        ↓
Product Intent
        ↓
Risk and AI-DLC Level
        ↓
Requirements and Acceptance Criteria
        ↓
Architecture and Data Impact
        ↓
API and UX Contracts
        ↓
Implementation Plan
        ↓
Construction
        ↓
Automated and Human Validation
        ↓
Documentation Synchronization
        ↓
Release Approval
        ↓
Observation and Learning
```

## Stages

1. **Frame:** define the user problem, outcome, boundaries, exclusions, and measurable acceptance criteria.
2. **Classify:** assign Level 1, 2, or 3 based on risk, reversibility, security, user trust, and architectural reach.
3. **Specify:** create the necessary architecture, data, API, UX, AI, security, observability, testing, migration, and rollback contracts.
4. **Plan:** break work into reviewable increments; prefer a vertical slice connecting UI, API, domain logic, data, and tests.
5. **Construct:** AI may generate code, tests, fixtures, schemas, migrations, and documentation under approved repository rules.
6. **Validate:** use static analysis, unit tests, integration tests, workflow tests, security checks, accessibility checks, and human review.
7. **Synchronize:** update architecture records, APIs, schemas, behavior docs, operational guidance, and decision records.
8. **Release:** a human release owner confirms readiness, limitations, rollback, and monitoring.
9. **Learn:** compare expected and actual behavior and record defects, confusion, performance, AI quality, data quality, and architecture friction.

## Definition of Done

A feature is done only when behavior is implemented, tests demonstrate it, checks pass, documentation reflects reality, observability is adequate, and human approval is recorded.
