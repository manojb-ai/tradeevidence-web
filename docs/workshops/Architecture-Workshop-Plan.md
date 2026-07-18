# Architecture Workshop Plan

**Status:** Approved  
**Version:** 1.0  
**Owner:** Founder and Chief Software Architect  
**Last Updated:** 2026-07-18
**Related Documents:** [../engineering/Engineering-Specification-Index.md](../engineering/Engineering-Specification-Index.md), [../engineering/TradeEvidence-Engineering-Lifecycle.md](../engineering/TradeEvidence-Engineering-Lifecycle.md), [../governance/AI-DLC-Adoption-Policy.md](../governance/AI-DLC-Adoption-Policy.md), [../governance/decisions/ADR-001-Adopt-AI-DLC.md](../governance/decisions/ADR-001-Adopt-AI-DLC.md)

## Objective

Convert TradeEvidence's Product Handbook into implementation-ready engineering specifications while using AI-DLC proportionately.

## Workshops

1. **Master System Architecture:** logical boundaries, database, auth, market data, AI/Evidence placement, MVP deployment, Market Data Service abstraction, and confirmation of the phased CSV-to-provider evolution strategy.
2. **MVP Vertical Slice:** Homepage Opportunity → Decision Workspace → Market Context and Evidence → Evidence Score and Decision Confidence → Ask TradeEvidence explanation.
3. **MVP Data Schema:** entities, schema, lifecycle, lineage, and versioning.
4. **API Contracts:** Homepage, Decision Workspace, Evidence, AI explanation, watchlist, portfolio, and error model.
5. **Frontend and Backend Architecture:** routes, components, state, caching, services, modules, and test seams.
6. **Evidence Engine:** pipeline, explainability, versioning, history, validation, and Devil's Advocate behavior.
7. **AI Workflow:** context, outputs, allowed/prohibited behavior, prompts, evaluation, cost, latency, and failure handling.
8. **Delivery Readiness:** testing, security, observability, deployment, Definition of Done, and first backlog.

## Workshop Operating Pattern

Each workshop ends with product decisions, architecture decisions, risks, updated specifications, decision-log updates, AI-DLC level, and repository merge instructions.
