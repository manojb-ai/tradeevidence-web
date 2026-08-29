# 06. Roadmap

## Release Overview
The roadmap below outlines the intended evolution of TradeEvidence from early foundation work to a production-ready platform.

| Release | Focus |
| --- | --- |
| v0.1 | Landing Page |
| v0.2 | Authentication |
| v0.3 | Dashboard |
| v0.4 | Scoring Engine |
| v0.5 | Watchlists |
| v0.6 | AI Review |
| v0.7 | Journal |
| v0.8 | Portfolio |
| v0.9 | Reports |
| v1.0 | Production Release |

## Release Flow

```mermaid
flowchart LR
    A[v0.1 Landing Page] --> B[v0.2 Authentication]
    B --> C[v0.3 Dashboard]
    C --> D[v0.4 Scoring Engine]
    D --> E[v0.5 Watchlists]
    E --> F[v0.6 AI Review]
    F --> G[v0.7 Journal]
    G --> H[v0.8 Portfolio]
    H --> I[v0.9 Reports]
    I --> J[v1.0 Production Release]
```

## Release Notes

### Engineering Architecture Phase (Approved Plan)
- Master System Architecture
- MVP Implementation Specification
- MVP Data Schema
- API Contracts
- Frontend and Backend Architecture
- Evidence Engine and AI Workflow
- Delivery Readiness
- First Vertical Slice

This phase defines implementation-ready engineering artifacts before full feature acceleration. It does not replace product philosophy or alter approved product AI behavior boundaries.

Traceability Update (2026-07-18): Workshop #1 is completed with approved baseline artifacts: [engineering/Master-System-Architecture.md](engineering/Master-System-Architecture.md), [engineering/Canonical-Analytical-Model.md](engineering/Canonical-Analytical-Model.md), and [governance/decisions/ADR-002-Master-System-Architecture.md](governance/decisions/ADR-002-Master-System-Architecture.md).

Traceability Update (2026-07-19): Workshop #2 is completed with the approved [MVP Implementation Specification](engineering/MVP-Implementation-Spec.md), [Workshop #2 Summary](workshops/Workshop-02-Summary.md), and [ADR-004](governance/decisions/ADR-004-Canonical-Market-Observations-and-Retention.md). Workshop #3 is the MVP Data Schema.

Traceability Update (2026-08-02): Workshop #3 is completed with the approved [MVP Data Schema](engineering/MVP-Data-Schema.md), [Workshop #3 Summary](workshops/Workshop-03-Summary.md), and [ADR-005](governance/decisions/ADR-005-MVP-Persistence-and-Data-Integrity.md). Workshop #4 is API Contracts.

Traceability Update (2026-08-02): Workshop #4 is completed with the approved [API Contracts v1](engineering/API-Contracts-v1.md), [OpenAPI v1 contract](engineering/openapi-v1.json), [Workshop #4 Summary](workshops/Workshop-04-Summary.md), and [ADR-006](governance/decisions/ADR-006-Internal-API-Contract-and-Evolution.md). Workshop #5 is Frontend and Backend Architecture.

Traceability Update (2026-08-02): Workshop #5 is completed with the approved [MVP Application Architecture](engineering/MVP-Application-Architecture.md), [Workshop #5 Summary](workshops/Workshop-05-Summary.md), and [ADR-007](governance/decisions/ADR-007-MVP-Application-Architecture.md).

Traceability Update (2026-08-23): Workshop #6 is completed with the approved [Evidence Engine Specification](engineering/Evidence-Engine-Specification.md), [Workshop #6 Summary](workshops/Workshop-06-Summary.md), and [ADR-008](governance/decisions/ADR-008-Evidence-Engine-Governance.md).

Traceability Update (2026-08-23): Workshop #7 is completed with the approved [AI Workflow Contract](engineering/AI-Workflow-Contract.md), [Workshop #7 Summary](workshops/Workshop-07-Summary.md), and [ADR-009](governance/decisions/ADR-009-Grounded-AI-Workflow.md). Workshop #8 is Delivery Readiness.

Traceability Update (2026-08-25): Workshop #8 and the eight-workshop architecture program are completed with the approved [Testing Strategy](engineering/Testing-Strategy.md), [Security and Privacy Baseline](engineering/Security-and-Privacy-Baseline.md), [Observability and Operations](engineering/Observability-and-Operations.md), [Deployment Architecture](engineering/Deployment-Architecture.md), [Definition of Done and First Implementation Backlog](engineering/Definition-of-Done.md), [Workshop #8 Summary](workshops/Workshop-08-Summary.md), and [ADR-010](governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md). Construction begins with Delivery Foundation.

Traceability Update (2026-08-29): [Vertical Slice 01 - Delivery Foundation](engineering/Vertical-Slice-01-Delivery-Foundation.md) is approved for construction. Its first session established the repository baseline, twelve acceptance criteria, explicit exclusions, and the initial local-quality, CI, operations, staging, and closure sequence. Staging vendor selection and final slice acceptance remain founder gates.

### v0.1 — Landing Page
- establish the public website experience
- communicate the product vision and value proposition
- introduce the evidence-based positioning

### v0.2 — Authentication
- support secure access to the authenticated experience
- define the initial user account and profile flow

### v0.3 — Dashboard
- deliver the first trading workspace experience
- introduce the primary dashboard layout inspired by product mockups

### v0.4 — Scoring Engine
- build the initial explainable scoring framework
- define scoring categories and evidence inputs

### v0.5 — Watchlists
- support organization of tracked assets and market context
- expose watchlist-specific analysis views

### v0.6 — AI Review
- introduce AI-assisted summaries and review support
- maintain a clear role for AI features as decision support rather than decision authority

### v0.7 — Journal
- enable structured journaling of observations and outcomes
- support reflection on assumptions and decision quality

### v0.8 — Portfolio
- provide portfolio-oriented context and performance review
- connect journal and analysis workflows

### v0.9 — Reports
- produce reports that summarize evidence, scores, and reflections
- support better review and learning cycles

### v1.0 — Production Release
- stabilize the product experience
- support light, dark, and system themes
- deliver a reliable foundation for future growth

---

## TODO

### High
- Sequence milestone dependencies more explicitly for the first release path.
- Define acceptance criteria for each release milestone.

### Medium
- Clarify which features should be included in v0.4 and v0.5 based on initial product scope.
- Document any release ordering changes if the initial architecture decisions shift.

### Low
- Add release notes for future milestones once they are finalized.

## Related Documents
- [00-PRD.md](00-PRD.md)
- [03-Architecture.md](03-Architecture.md)
- [05-Product-Decisions.md](05-Product-Decisions.md)
- [07-Scoring-Engine.md](07-Scoring-Engine.md)
