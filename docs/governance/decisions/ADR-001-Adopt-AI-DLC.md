# ADR-001: Adopt AI-DLC as a Selective Engineering Method

**Status:** Approved  
**Decision Date:** 2026-07-18  
**Owner:** Founder and Chief Software Architect  
**Applies To:** TradeEvidence product engineering  
**Related Documents:** [../AI-DLC-Adoption-Policy.md](../AI-DLC-Adoption-Policy.md), [../../engineering/TradeEvidence-Engineering-Lifecycle.md](../../engineering/TradeEvidence-Engineering-Lifecycle.md), [../Human-AI-Responsibility-Matrix.md](../Human-AI-Responsibility-Matrix.md), [../../engineering/Engineering-Specification-Index.md](../../engineering/Engineering-Specification-Index.md), [../../08-AI-Strategy.md](../../08-AI-Strategy.md)

## Context

TradeEvidence is moving from product discovery into software architecture and implementation planning. The project already has a strong product philosophy, documented product decisions, an approved homepage direction, a Decision Workspace concept, and an initial MVP boundary.

The next phase requires implementation-ready specifications, including system boundaries, data contracts, APIs, AI workflows, testing expectations, and deployment guidance.

AWS has published an open-source AI-Driven Development Life Cycle (AI-DLC) workflow that uses AI throughout development while retaining human governance and approval checkpoints. Its principles complement TradeEvidence's own philosophy: AI should increase execution capacity, but accountable humans must retain decision authority.

## Decision

TradeEvidence will use AI-DLC wherever the Chief Software Architect determines that it materially improves:

- requirements discovery;
- architecture analysis;
- implementation planning;
- traceability;
- code and test generation;
- security and quality reviews;
- documentation synchronization;
- operational readiness; or
- post-release learning.

AI-DLC will be adopted selectively rather than mechanically. It is an engineering method, not the product strategy, system architecture, or source of business authority.

## Governing Principle

> AI accelerates execution. Humans retain authority and accountability.

## Mandatory Human Decisions

AI may prepare recommendations, alternatives, analyses, specifications, code, tests, and documentation. A human must approve:

- product scope;
- architecture decisions;
- data and privacy decisions;
- financial-domain safety boundaries;
- security exceptions;
- production deployment;
- destructive operations;
- changes to scoring logic;
- changes to AI behavioral rules; and
- any representation that could be interpreted as investment advice.

## Consequences

### Positive

- More consistent feature development.
- Better traceability from requirement to implementation.
- Earlier identification of missing decisions and edge cases.
- Improved synchronization among code, tests, and documentation.
- Higher leverage for a small founding team.

### Risks

- Process overhead on small changes.
- False confidence in AI-generated artifacts.
- Excessive documentation or speculative architecture.
- Security risks from overly broad agent permissions.
- Vendor or tool-specific workflow lock-in.

### Mitigations

- Use a risk-based level of rigor.
- Require evidence and review before approval.
- Keep AI-DLC tooling replaceable.
- Grant least-privilege access.
- Use repository protections, automated tests, and human review.
- Measure whether the method improves quality and delivery.

## Alternatives Considered

1. Do not use AI-DLC: rejected because it would leave valuable AI-native governance practices unused.
2. Adopt AI-DLC wholesale: rejected because TradeEvidence needs a proportionate workflow tailored to its product and risk profile.
3. Use AI coding assistants without a lifecycle method: rejected because ad hoc prompting creates inconsistency and weak traceability.

## Review Trigger

Review this decision after the first complete vertical slice or after three major implementation features, whichever occurs first.
