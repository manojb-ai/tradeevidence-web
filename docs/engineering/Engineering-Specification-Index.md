# Engineering Specification Index

**Status:** Approved  
**Version:** 1.3
**Owner:** Chief Software Architect  
**Last Updated:** 2026-08-25
**Related Documents:** [TradeEvidence-Engineering-Lifecycle.md](TradeEvidence-Engineering-Lifecycle.md), [Master-System-Architecture.md](Master-System-Architecture.md), [Canonical-Analytical-Model.md](Canonical-Analytical-Model.md), [AI-DLC-Phase-Gates.md](AI-DLC-Phase-Gates.md), [../governance/AI-DLC-Adoption-Policy.md](../governance/AI-DLC-Adoption-Policy.md), [../governance/decisions/ADR-002-Master-System-Architecture.md](../governance/decisions/ADR-002-Master-System-Architecture.md), [../workshops/Architecture-Workshop-Plan.md](../workshops/Architecture-Workshop-Plan.md)

## Priority 1 — Foundation

1. `Master-System-Architecture.md`
2. `Canonical-Analytical-Model.md`
3. `Market-Data-Strategy.md`
4. [`MVP-Implementation-Spec.md`](MVP-Implementation-Spec.md) — Approved 2026-07-19
5. [`MVP-Data-Schema.md`](MVP-Data-Schema.md) - Approved 2026-08-02
6. [`API-Contracts-v1.md`](API-Contracts-v1.md) and [`openapi-v1.json`](openapi-v1.json) - Approved 2026-08-02
7. [`MVP-Application-Architecture.md`](MVP-Application-Architecture.md) - Approved 2026-08-02

## Priority 2 — Application Architecture

8. [`Evidence-Engine-Specification.md`](Evidence-Engine-Specification.md) - Approved 2026-08-23
9. [`AI-Workflow-Contract.md`](AI-Workflow-Contract.md) - Approved 2026-08-23

## Priority 3 — Delivery and Operations

10. [`Testing-Strategy.md`](Testing-Strategy.md) - Approved 2026-08-25
11. [`Security-and-Privacy-Baseline.md`](Security-and-Privacy-Baseline.md) - Approved 2026-08-25
12. [`Observability-and-Operations.md`](Observability-and-Operations.md) - Approved 2026-08-25
13. [`Deployment-Architecture.md`](Deployment-Architecture.md) - Approved 2026-08-25
14. [`Definition-of-Done.md`](Definition-of-Done.md) - Approved 2026-08-25

## Creation Order

```text
Master System Architecture
        ↓
Canonical Analytical Model
        ↓
Market Data Strategy
        ↓
MVP Implementation Specification
        ↓
MVP Data Schema
        ↓
API Contracts
        ↓
Frontend and Backend Architecture
        ↓
Evidence Engine and AI Workflow
        ↓
Testing, Security, Operations, Deployment
```

## Rule

Do not produce every specification at maximum detail before implementation. Create enough detail to safely build the next vertical slice, then refine based on evidence.

## Active Construction Specification

- [Vertical Slice 01 - Delivery Foundation](Vertical-Slice-01-Delivery-Foundation.md) - Approved for Construction 2026-08-29
