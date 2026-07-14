# Documentation Governance

## Purpose

TradeEvidence documentation has grown beyond a small collection of Markdown files. This document defines the workflow for turning workshop discussions into durable product knowledge without letting the permanent docs become bloated or inconsistent.

## Documentation Status
Status: Approved
Version: 1.0
Owner: Product
Last Updated: 2026-07-14
Applies To: Documentation workflow and editorial quality
Related Documents: [README.md](README.md), [Product-Decision-Log.md](Product-Decision-Log.md), [Canonical-Terminology.md](Canonical-Terminology.md), [Documentation-Status.md](Documentation-Status.md)

## The Documentation Workflow

Every major design workshop should produce the following artifacts:

### 1. Workshop Notes

Workshop notes belong in [workshops](workshops/). They preserve the discussion context, alternatives, objections, open questions, and the evolving thinking behind a design session. Workshop notes are not the authoritative product specification.

### 2. Product Decision Log Updates

Final decisions should be captured in [Product-Decision-Log.md](Product-Decision-Log.md). This is the authoritative record of what was decided, why it was decided, what impact it is expected to have, and what status it holds.

### 3. Permanent Document Updates

Approved decisions should then be folded into the relevant long-term documentation, such as:

- [01-Product-Vision.md](01-Product-Vision.md)
- [01a-Product-Philosophy.md](01a-Product-Philosophy.md)
- [03-Architecture.md](03-Architecture.md)
- [04-Design-System.md](04-Design-System.md)
- [07-Decision-Workspace-Concept.md](07-Decision-Workspace-Concept.md)
- [08-AI-Strategy.md](08-AI-Strategy.md)
- [06-Roadmap.md](06-Roadmap.md)
- [product/Dashboard.md](product/Dashboard.md)
- [product/Decision-Confidence.md](product/Decision-Confidence.md)
- [product/Decision-Journal.md](product/Decision-Journal.md)
- [product/Community-and-Growth.md](product/Community-and-Growth.md)

### 4. Prototype Documentation

Approved or notable prototypes should be documented in [prototypes](prototypes/). Each prototype entry should capture purpose, sections, decisions embodied in the design, known limitations, and future enhancements.

## Editorial Rules

- Preserve existing decisions and historical context.
- Avoid duplicating concepts across multiple permanent documents.
- Keep the writing style consistent.
- Add cross-references whenever a concept moves between documents.
- Let workshop notes remain separate from permanent product documentation.
- Do not turn workshop discussions into permanent product requirements automatically.

## Session Closeout Questions

At the end of each design session, answer:

1. What did we decide?
2. Where is it documented?
3. What remains open?
4. Did a prototype become approved, superseded, or archived?
5. Does the roadmap or permanent documentation need to change?

## Role of Copilot

Copilot acts as a documentation editor:

- Integrates approved content
- Removes duplication
- Adds cross-references
- Preserves existing decisions
- Reports unresolved conflicts

Copilot should not invent product decisions.
