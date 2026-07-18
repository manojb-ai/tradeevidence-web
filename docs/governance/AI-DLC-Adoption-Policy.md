# AI-DLC Adoption Policy

**Status:** Approved  
**Version:** 1.0  
**Owner:** Chief Software Architect  
**Last Updated:** 2026-07-18  
**Applies To:** Architecture, implementation, testing, documentation, security, and operations
**Related Documents:** [decisions/ADR-001-Adopt-AI-DLC.md](decisions/ADR-001-Adopt-AI-DLC.md), [Human-AI-Responsibility-Matrix.md](Human-AI-Responsibility-Matrix.md), [../engineering/TradeEvidence-Engineering-Lifecycle.md](../engineering/TradeEvidence-Engineering-Lifecycle.md), [../engineering/AI-DLC-Phase-Gates.md](../engineering/AI-DLC-Phase-Gates.md), [../engineering/Engineering-Specification-Index.md](../engineering/Engineering-Specification-Index.md), [../08-AI-Strategy.md](../08-AI-Strategy.md)

## Purpose

This policy explains when and how TradeEvidence uses AWS's open-source AI-Driven Development Life Cycle practices.

AI-DLC complements the TradeEvidence engineering approach. It does not replace product judgment, architecture ownership, engineering accountability, or regulatory and financial-domain caution.

## Adoption Model

TradeEvidence uses a three-level model.

### Level 1 — Lightweight

Use for low-risk, localized work such as copy changes, simple presentation components, documentation corrections, and small refactors with established tests.

Required artifacts:

- task statement;
- acceptance criteria;
- implementation;
- automated validation;
- human review.

### Level 2 — Standard

Use for ordinary product features such as watchlist behavior, homepage data cards, portfolio views, reusable evidence components, and non-critical API changes.

Required artifacts:

- requirements;
- affected architecture;
- data and API impact;
- UX states;
- implementation plan;
- test plan;
- documentation update;
- human approval.

### Level 3 — Controlled

Use for high-impact or high-risk changes such as Evidence Score logic, Decision Confidence logic, AI advice boundaries, authentication, financial data transformations, security-sensitive integrations, production infrastructure, and data deletion or migration.

Required artifacts:

- explicit decision record;
- alternatives and risk analysis;
- threat or misuse review;
- detailed data and API contracts;
- test evidence;
- rollback plan;
- independent human approval;
- post-deployment validation.

## Where AI-DLC Has a Role

The Chief Software Architect may use AI-DLC for discovery, architecture, domain and data modeling, API drafting, UX edge-case discovery, implementation planning, code and test generation, security review, documentation synchronization, deployment readiness, and post-release learning.

## Where AI-DLC Does Not Have Final Authority

AI-DLC cannot independently approve strategy, release, architecture, personalized investment recommendations, scoring changes, sensitive-data access, security exceptions, destructive production actions, or legal/compliance claims.

## Boundary With Product AI

Product AI behavior for traders is governed by [../08-AI-Strategy.md](../08-AI-Strategy.md). This policy governs AI used by the engineering team to build TradeEvidence.

## Tool Neutrality

TradeEvidence adopts the method, not a permanent dependency on a specific AI vendor, model, IDE, or cloud. Preserve portable Markdown specifications, standard source control, conventional tests, reviewable pull requests, exportable prompts, and replaceable model integrations.

## Least-Privilege Rules

- no production credentials;
- no unrestricted cloud administration;
- no direct production database writes;
- no silent dependency upgrades;
- no autonomous merge to protected branches;
- no access to secrets through prompts or logs.

## Success Measures

Track lead time, requirement coverage, pre-merge defects, rework from unclear requirements, documentation drift, security findings, human review time, and AI-output rejection rate.

The purpose is not to maximize AI-generated code. The purpose is to improve delivery quality, consistency, and learning.
