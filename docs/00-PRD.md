# 00. Product Requirements Document

## Product Overview
TradeEvidence is an evidence-based trading intelligence platform for self-directed traders. It helps users organize research, review evidence, understand scoring logic, maintain a journal of decisions, and reflect on outcomes in a structured environment.

TradeEvidence is not a financial advisor, signal service, or automated execution tool. The trader remains responsible for the final decision.

## Vision
TradeEvidence exists to bring clarity to a noisy and often emotionally charged trading environment. The product helps traders understand what evidence exists, how it is being interpreted, and how their own assumptions and risks fit into the decision process.

## Problem Statement
Self-directed traders often work across fragmented tools and scattered information. They may have charts, notes, watchlists, reports, and market context in different places, yet still lack a clear and explainable way to connect evidence to decisions. Many existing experiences emphasize speed, alerts, or prediction, but traders need a calmer, more disciplined environment where reasoning is visible, assumptions are explicit, and decisions can be reviewed over time.

TradeEvidence addresses this need by providing a structured workspace for evidence review, scoring, reflection, and learning.

## Target Users

### Primary Users
- self-directed traders who prefer independent analysis
- active traders who value transparency and structured thinking
- traders who want a better way to organize their research and decision process

### Secondary Users
- investors who want a more organized research workflow
- traders who want a personal journal and review experience
- users who want clearer context around market analysis and scoring

### Future Users
- teams or collaborators working on shared research workflows
- advanced traders who want richer scanning and reporting capabilities
- education-focused users who want a structured learning environment

## Product Goals
TradeEvidence should help users achieve the following outcomes:

### Outcome Goals
- help traders make more deliberate decisions
- make evidence and analysis easier to understand
- support explainable scoring and transparent reasoning
- encourage disciplined journaling and review
- improve consistency over time without replacing trader judgment

### Experience Goals
- make the product feel calm, trustworthy, and professional
- keep the experience structured enough to support focused analysis
- preserve clear user ownership of decisions and risk management

## Non-Goals
TradeEvidence is not intended to:
- provide financial advice
- issue investment recommendations
- guarantee market outcomes
- automate trading decisions on behalf of the user
- rely on hidden or opaque scoring logic
- replace personal judgment, risk management, or responsibility

The product also does not aim to become a full brokerage, execution, or advisory platform.

## Core Product Pillars

### Evidence
The platform is centered on evidence, research, and context rather than speculation.

### Transparency
Users should be able to see the basis of analysis, assumptions, and scoring logic.

### Explainability
Scores, alerts, and insights should be understandable and reviewable.

### Education
The product should help users learn from their own process and improve over time.

### Discipline
The product should support consistent research habits, reflection, and decision quality.

### Consistency
The experience should be dependable, structured, and coherent across modules.

## Major Modules
The product experience will be organized around a small set of core modules that support research, review, and reflection.

### Landing Website
Public-facing product overview, positioning, and onboarding entry points.

### Dashboard
Primary workspace for research, market context, and quick analysis.

### Market Summary
Broader market context including index and sector awareness.

### Watchlists
Curated tracking and monitoring of assets of interest.

### Evidence Engine
Structured capture and review of supporting evidence for ideas and setups.

### Scoring Engine
Explainable scoring based on multiple evidence categories and criteria.

### Journal
Personal reflection, note-taking, and decision review.

### Reports
Summaries of research, scores, assumptions, and outcomes.

### Portfolio
Context around holdings, positions, or tracked activity.

### Alerts
Conditions and triggers for monitoring attention-worthy changes.

### AI Review
AI-assisted explanation, summarization, and review support.

### Administration
Future management surfaces for account, settings, and platform administration.

## Version 1 Scope
Version 1 will focus on the core foundation of the platform:
- a public landing experience
- an authenticated product experience
- a dashboard-oriented workspace
- watchlists and market context surfaces
- an explainable scoring experience
- journaling and notes
- basic reports and review flows
- light and dark theme support
- responsive and accessible user experience

Version 1 will prioritize clarity, usability, and explainability over breadth. The initial release should establish a strong foundation for research, scoring, and reflection without trying to solve every future use case at once.

### Out of Scope for Version 1
- fully automated advisory or recommendation workflows
- broad collaboration capabilities beyond the core product experience
- a large set of advanced integrations or feature breadth that would reduce clarity

## Future Vision
Over the next several years, TradeEvidence could evolve into a broader trading intelligence environment that includes:
- deeper analytics and scoring workflows
- enhanced AI-assisted review and summarization
- richer reports and education experiences
- more advanced scanning, alerts, and portfolio context
- stronger personalization and workflow customization
- richer collaboration and knowledge-sharing capabilities

These future directions should extend the product's core value without changing its role as an evidence-based, user-owned decision-support platform.

## Success Metrics
Success will be measured through a combination of product and user outcomes:
- users return to the platform regularly
- users complete core research and journaling workflows
- users find the scoring and evidence views understandable
- users report improved clarity in their process
- users engage with reports and journal reflections over time
- the product maintains strong accessibility and usability standards

### Product Health Signals
- users can complete the core workflow without confusion
- the experience feels trustworthy and coherent across modules
- the product supports repeatable research habits rather than one-off usage

## Risks

### Product Risks
- the product could be perceived as too advisory if language is not carefully managed
- users may expect automated recommendations that the product does not provide
- feature breadth may outpace clarity if the experience becomes too complex

### Technical Risks
- market data integration may introduce complexity and reliability concerns
- AI features may create expectations that exceed the product's role
- design system and theme support may become inconsistent without strong governance

## Open Questions

### Product Decisions
- What is the first set of workflows for Version 1?
- Which modules should be included in the initial authenticated experience?
- How much personalization should be supported at launch?

### Technical Decisions
- Which backend services are required for the first production-ready release?
- Which authentication provider will be used?
- What data storage and market data strategy should be adopted?

### UX and Content Decisions
- Which scoring categories should be available first?
- How should uncertainty and confidence be presented?
- What level of AI assistance should be introduced in early releases?

---

## TODO

### High
- What decision must be made first to unblock the next milestone?
- What user or product risk is most urgent to resolve?
- Which requirement is still ambiguous and needs stakeholder input?

### Medium
- What implementation choice should be clarified before development begins?
- What additional product or UX detail should be defined next?
- Which trade-off should be documented before the feature is prioritized?

### Low
- What future enhancement would benefit from early documentation?
- What minor detail should be captured as the product evolves?
- What open question is useful to keep visible for later refinement?

## Related Documents
- [01-Product-Vision.md](01-Product-Vision.md)
- [03-Architecture.md](03-Architecture.md)
- [05-Product-Decisions.md](05-Product-Decisions.md)
- [06-Roadmap.md](06-Roadmap.md)
- [07-Scoring-Engine.md](07-Scoring-Engine.md)
