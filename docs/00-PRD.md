# 00. Product Requirements Document

## Product Overview
TradeEvidence is an evidence-based trading education and intelligence platform for self-directed traders. It helps users organize research, review evidence, understand scoring logic, maintain a journal of decisions, and reflect on outcomes in a structured environment.

TradeEvidence is not a financial advisor, signal service, or automated execution tool. The trader remains responsible for the final decision.

## Documentation Status
Status: Approved
Version: 1.0
Owner: Product
Last Updated: 2026-07-14
Applies To: Product direction and MVP scope
Related Documents: [01-Product-Vision.md](01-Product-Vision.md), [01a-Product-Philosophy.md](01a-Product-Philosophy.md), [06-Roadmap.md](06-Roadmap.md), [MVP-v1.md](MVP-v1.md)

## Vision
TradeEvidence exists to bring clarity to a noisy and often emotionally charged trading environment. The product helps traders understand what evidence exists, how it is being interpreted, and how their own assumptions and risks fit into the decision process.

## Problem Statement
Self-directed traders often work across fragmented tools and scattered information. They may have charts, notes, watchlists, reports, and market context in different places, yet still lack a clear and explainable way to connect evidence to decisions. Many existing experiences emphasize speed, alerts, or forecast-like outputs, but traders need a calmer, more disciplined environment where reasoning is visible, assumptions are explicit, and decisions can be reviewed over time.

TradeEvidence addresses this need by providing a structured workspace for evidence review, scoring, reflection, and learning while focusing on risk control and risk tolerance. 

## Target Users

### Primary Users
- self-directed traders who prefer independent analysis
- active traders who value transparency and structured thinking
- traders who want a better way to organize their research and decision process
- Stock traders who jump into the trading but don't know what stocks to trade
- Stock traders who have heard about stock options but don't have proper education on what option strategies are out there and should be employed
- Traders who want to trade options but don't know the pros and cons of various option strategies
- Educate Stock and Option Traders regarding risks of various stock and option strategies, capital requirements, market structure suitable for different option strategies
- Educate users with demonstrable examples of proper capital allocation and risk control 

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
- help traders make more deliberate decisions that are based on data rather than intuition or hunch
- make evidence and analysis easier to understand and in greater detail
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

### Homepage
Primary authenticated workspace for research, market context, and quick analysis.

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
- an authenticated homepage and workspace experience
- Scoring and technical analysis of major market indexes like SPY, QQQ, IWM
- Scoring and technical analysis of major commodities like Gold, Silver, Corn, Soybean
- Scoring and technical analysis of major currency pairs like EURUSD, GBPUSD, USDJPY
- watchlists and market context surfaces
- an explainable scoring experience
- journaling and notes
- basic reports and review flows
- light and dark theme support
- responsive and accessible user experience
- AI Chatbot that can help pull the scoring logic, technical levels of stocks, various option strategies and their pros and cons, and risk tolerance questions based on the user query, refer to educational websites. AI Chatbot must always mention that the provided information is for educational purpose only and not financial advice
- Platform security and stability
- Protection from Cybersecurity and Denial of Service type attacks
- Extreme awareness to focus on educational and analysis content but never a financial recommendation

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
- users provide platform features
- users request additional features
- users vote on feature prioritization

### Product Health Signals
- users can complete the core workflow without confusion
- the experience feels trustworthy and coherent across modules
- the product supports repeatable research habits rather than one-off usage

## Risks

### Product Risks
- the product could be perceived as overly directive if language is not carefully managed
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

Workflows

Workflow 1 - User lands on the homepage -> views Today's Briefing -> reviews market context -> evaluates opportunities
Workflow 2 - Users are encouraged to create their user profile to get additional features
Workflow 3 - User signs in -> opens the Homepage -> reviews Highest Conviction Opportunities -> enters the Decision Workspace -> adds to a watchlist
Workflow 4 - Review and Maintain Watchlist
Workflow 5 - Query Individual Stock -> Review Evidence -> Review Option Strategies -> Review Risk, Pros & Cons -> Add to Watchlist
Workflow 6 - Open Journal -> Add Trade -> Upload Screenshot -> Write Notes

Modules

Module 1 - Homepage
Module 2 - Market Summary, Statistics and Charts
Module 3 - Watchlists
Module 4 - Journal
Module 5 - Settings
Module 6 - User Profile, Password Management

Success Metrics

Success 1 - User Returns Multiple Times during the week
Success 2 - User returns every morning and evening
Success 3 - Users refers to other users
Success 4 - Stable and Increasing website traffic

### Medium
- Document the initial scoring categories and their intended role in the product.
- Define how confidence and uncertainty should be communicated in core views.
- Decide whether the first release should include AI-assisted summaries or keep that capability as a later milestone.

### Low
- Capture any regulatory or compliance considerations that become relevant during early rollout.
- Record any product language changes that may affect the non-advisory positioning.
- Keep this document aligned with future roadmap decisions as the product evolves.

## Related Documents
- [01-Product-Vision.md](01-Product-Vision.md)
- [03-Architecture.md](03-Architecture.md)
- [05-Product-Decisions.md](05-Product-Decisions.md)
- [06-Roadmap.md](06-Roadmap.md)
- [07-Scoring-Engine.md](07-Scoring-Engine.md)
