# AI-DLC Phase Gates

**Status:** Approved  
**Version:** 1.0  
**Owner:** Chief Software Architect  
**Last Updated:** 2026-07-18
**Related Documents:** [TradeEvidence-Engineering-Lifecycle.md](TradeEvidence-Engineering-Lifecycle.md), [Engineering-Specification-Index.md](Engineering-Specification-Index.md), [../governance/AI-DLC-Adoption-Policy.md](../governance/AI-DLC-Adoption-Policy.md), [../governance/decisions/ADR-001-Adopt-AI-DLC.md](../governance/decisions/ADR-001-Adopt-AI-DLC.md)

## Gate 0 — Intake

Proceed when the problem, user outcome, owner, and AI-DLC level are known.

## Gate 1 — Requirements Approved

Proceed when requirements are testable, acceptance criteria exist, out-of-scope behavior is explicit, failure/empty states are identified, and unresolved questions have owners.

## Gate 2 — Architecture Ready

Proceed when system ownership, dependencies, data sensitivity, schema impact, API/UX contracts, AI boundaries, and material alternatives are understood.

## Gate 3 — Construction Ready

Proceed when implementation tasks, test strategy, mocks, integrations, repository strategy, environments, and secrets are ready.

## Gate 4 — Merge Ready

Proceed when acceptance, unit, integration, security, dependency, and human-review requirements pass; documentation is synchronized; and no critical findings remain.

## Gate 5 — Release Ready

Proceed when the release owner approves deployment, rollback, monitoring, limitations, and product behavior.

## Gate 6 — Learning Complete

Complete when actual results are reviewed, findings recorded, follow-up work prioritized, and lifecycle improvements captured.

## Stop Conditions

Stop and require human intervention when AI conflicts with an approved decision, requirements materially change, security/privacy risk appears, financial language may be interpreted as personalized advice, data lineage is unclear, destructive action is proposed, or tests do not support the claimed behavior.
