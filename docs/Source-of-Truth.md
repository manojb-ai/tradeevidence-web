# Source of Truth

## Purpose

This document defines which TradeEvidence documents are authoritative for specific decision domains.

## Authority Map

- Product Vision (Why): [01-Product-Vision.md](01-Product-Vision.md)
- Product Philosophy and Principles: [01a-Product-Philosophy.md](01a-Product-Philosophy.md), [02-Principles.md](02-Principles.md)
- Product Requirements (What): [00-PRD.md](00-PRD.md)
- Product Architecture Direction (How): [03-Architecture.md](03-Architecture.md)
- Product Decision Record (Why this decision): [Product-Decision-Log.md](Product-Decision-Log.md)
- Delivery Sequence (When): [06-Roadmap.md](06-Roadmap.md)
- MVP Boundary (First release scope): [MVP-v1.md](MVP-v1.md)
- Canonical Language: [Canonical-Terminology.md](Canonical-Terminology.md)
- Workshop History and context: [workshops](workshops)

## Architecture Authority Boundary

- [03-Architecture.md](03-Architecture.md) defines product architecture direction, product vision alignment, and user-facing conceptual design.
- [engineering/Master-System-Architecture.md](engineering/Master-System-Architecture.md) defines the authoritative software architecture for implementation, including subsystem decomposition, platform services, analytical engines, and engineering architecture boundaries.

These documents are complementary. Product architecture defines intent and conceptual experience. Engineering architecture defines implementation structure and system responsibility boundaries.

## Engineering Governance Authorities

- AI-assisted development policy and boundaries: [governance/AI-DLC-Adoption-Policy.md](governance/AI-DLC-Adoption-Policy.md)
- Human accountability split for AI-assisted engineering: [governance/Human-AI-Responsibility-Matrix.md](governance/Human-AI-Responsibility-Matrix.md)
- Approved architecture decision records for engineering governance: [governance/decisions](governance/decisions)
- Lifecycle stages and required quality gates: [engineering/TradeEvidence-Engineering-Lifecycle.md](engineering/TradeEvidence-Engineering-Lifecycle.md), [engineering/AI-DLC-Phase-Gates.md](engineering/AI-DLC-Phase-Gates.md)
- Specification authority and creation order: [engineering/Engineering-Specification-Index.md](engineering/Engineering-Specification-Index.md)
- Master layered architecture authority: [engineering/Master-System-Architecture.md](engineering/Master-System-Architecture.md)
- Canonical symbol analytical foundation authority: [engineering/Canonical-Analytical-Model.md](engineering/Canonical-Analytical-Model.md)
- Market-data architecture and phased evolution authority: [engineering/Market-Data-Strategy.md](engineering/Market-Data-Strategy.md)
- Architecture decision authority for the layered model: [governance/decisions/ADR-002-Master-System-Architecture.md](governance/decisions/ADR-002-Master-System-Architecture.md)

## Boundary: Product AI vs Development AI

- Product AI (user-facing behavior, education boundaries, and non-advisory positioning) is governed by [08-AI-Strategy.md](08-AI-Strategy.md).
- Development AI (how the team uses AI to design, build, test, secure, and release TradeEvidence) is governed by AI-DLC policy and engineering governance documents listed above.

AI governance documents do not replace product strategy authority, architecture ownership, release authority, or financial-domain safety boundaries.
