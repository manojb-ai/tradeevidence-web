# Product Decision Log

## Documentation Status
Status: Approved
Version: 1.0
Owner: Product
Last Updated: 2026-07-14
Applies To: Product decisions, rationale, and historical record
Related Documents: [00-PRD.md](00-PRD.md), [01-Product-Vision.md](01-Product-Vision.md), [06-Roadmap.md](06-Roadmap.md), [Documentation-Governance.md](Documentation-Governance.md), [Canonical-Terminology.md](Canonical-Terminology.md)

This document is the authoritative product decision record for TradeEvidence. It preserves the reasoning behind major product choices so future work remains aligned with the platform's intent. It is not a changelog, and it does not overwrite earlier history; instead, it records the current and emerging product direction in a structured way.

## Decision Record Structure

Each decision entry below includes:

- Decision
- Reason
- Expected Product Impact
- Status
- Date
- Related Documents

## Core Product Decisions

### Earned Confidence
- Decision: TradeEvidence should help traders build earned confidence through evidence, education, and reflection.
- Reason: Confidence is more valuable when it is grounded in understanding and disciplined process rather than prediction.
- Expected Product Impact: The product will emphasize learning, clarity, and decision preparation over forecasting or automation.
- Status: Active
- Date: Pre-2026
- Related Documents: [01a-Product-Philosophy.md](01a-Product-Philosophy.md), [01-Product-Vision.md](01-Product-Vision.md)

### Decision Preparation Software
- Decision: TradeEvidence should be designed as decision preparation software.
- Reason: The product's core value is preparing the user to make a better decision, not making the decision for them.
- Expected Product Impact: Features will focus on context, evidence, risk framing, sizing, and learning.
- Status: Active
- Date: Pre-2026
- Related Documents: [01a-Product-Philosophy.md](01a-Product-Philosophy.md), [07-Decision-Workspace-Concept.md](07-Decision-Workspace-Concept.md)

### Market Context is Universal
- Decision: Market context should be consistent for every user.
- Reason: Facts about the market should remain objective and shared, while interpretation can vary by trader.
- Expected Product Impact: The product will preserve a common factual layer while allowing personalization to shape guidance and education.
- Status: Active
- Date: Pre-2026
- Related Documents: [01b-User-Personas.md](01b-User-Personas.md), [product/Dashboard.md](product/Dashboard.md)

### Progressive Complexity
- Decision: The product experience should begin simply and become more sophisticated over time.
- Reason: New users need clarity and focus, while experienced users require more flexibility and control.
- Expected Product Impact: The interface will evolve from curated workflows to persona-based templates and eventually to customizable dashboards.
- Status: Active
- Date: Pre-2026
- Related Documents: [06-Roadmap.md](06-Roadmap.md), [product/Product-Evolution.md](product/Product-Evolution.md)

### Personas Drive Personalization
- Decision: Personas should inform personalization, but not override the trader's judgment or the market facts.
- Reason: Personalization should feel relevant and helpful without becoming overly prescriptive.
- Expected Product Impact: Templates, educational examples, and guidance will adapt to user context while staying grounded in a shared product model.
- Status: Active
- Date: Pre-2026
- Related Documents: [01b-User-Personas.md](01b-User-Personas.md), [Trading-Profile.md](Trading-Profile.md)

### Decision Workspace Replaces the Traditional Dashboard
- Decision: The core authenticated experience should be centered on a Decision Workspace rather than a traditional dashboard.
- Reason: Traders need a place to understand the market, assess evidence, evaluate risks, and prepare a plan.
- Expected Product Impact: The primary experience will emphasize decision preparation, workflow clarity, and post-decision reflection.
- Status: Active
- Date: 2026-07-14
- Related Documents: [07-Decision-Workspace-Concept.md](07-Decision-Workspace-Concept.md), [ui/Decision-Workspace-v1.md](ui/Decision-Workspace-v1.md)

### AI Teaches Instead of Recommending
- Decision: AI should teach, explain, and support reflection rather than make recommendations on the user's behalf.
- Reason: The product should cultivate understanding and ownership rather than replace the trader's judgment.
- Expected Product Impact: AI will act as a decision coach that helps the trader think through assumptions, risks, and trade-offs.
- Status: Active
- Date: Pre-2026
- Related Documents: [08-AI-Strategy.md](08-AI-Strategy.md)

### Every Thesis Needs an Exit
- Decision: Every opportunity should include a thesis, risks, invalidation criteria, and sizing logic.
- Reason: Good decision-making requires a plan for both entry and exit conditions.
- Expected Product Impact: The product will encourage more disciplined evaluation and clearer risk management.
- Status: Active
- Date: Pre-2026
- Related Documents: [07-Decision-Workspace-Concept.md](07-Decision-Workspace-Concept.md), [product/Decision-Journal.md](product/Decision-Journal.md)

### Respectful Personalization
- Decision: Personalization should be respectful, helpful, and non-intrusive.
- Reason: The experience should adapt to the user without undermining their ownership of the decision.
- Expected Product Impact: Personalization will influence education and workflow structure, but it will not replace the trader's judgment or change objective context.
- Status: Active
- Date: Pre-2026
- Related Documents: [01b-User-Personas.md](01b-User-Personas.md), [Trading-Profile.md](Trading-Profile.md)

## Homepage and Orientation Decisions

### Homepage as Orientation and Invitation
- Decision: The authenticated homepage will orient users, educate them, summarize relevant market intelligence, and invite them to choose their next activity.
- Reason: A homepage should not attempt to contain the full product or overwhelm users with raw market data.
- Expected Product Impact: The page will function as an inviting starting point rather than a dense trading terminal.
- Status: Active
- Date: 2026-07-14
- Related Documents: [prototypes/Dashboard-v1-Baseline.md](prototypes/Dashboard-v1-Baseline.md), [product/Dashboard.md](product/Dashboard.md)

### Dashboard v1 Approved Baseline
- Decision: The final light-theme prototype is approved as the Dashboard v1 baseline.
- Reason: It provides an inviting, clean hierarchy that combines a market briefing, user-intent actions, concise intelligence modules, and prominent AI assistance.
- Expected Product Impact: Homepage design work is frozen unless implementation or usability testing reveals a material issue.
- Status: Active
- Date: 2026-07-14
- Related Documents: [prototypes/Dashboard-v1-Baseline.md](prototypes/Dashboard-v1-Baseline.md)

### Today's Briefing as the Hero
- Decision: Today's Briefing will be the dominant homepage section.
- Reason: Users need plain-English market orientation before they review securities or opportunities.
- Expected Product Impact: Market data will be translated into context, meaning, risk, and themes instead of presented as isolated index moves.
- Status: Active
- Date: 2026-07-13
- Related Documents: [product/Dashboard.md](product/Dashboard.md), [prototypes/Dashboard-v1-Baseline.md](prototypes/Dashboard-v1-Baseline.md)

### Intent-Based Homepage Actions
- Decision: The homepage includes a prominent “What would you like to do today?” section.
- Reason: Traders may arrive with different immediate needs even when they share the same persona.
- Expected Product Impact: Users can quickly enter research, position review, portfolio review, learning, journaling, or AI-assisted workflows.
- Status: Active
- Date: 2026-07-13
- Related Documents: [product/Dashboard.md](product/Dashboard.md)

### Homepage Summarizes; Workspaces Provide Detail
- Decision: Homepage modules show concise summaries and contextual links rather than large tables.
- Reason: The homepage should reduce cognitive load and direct users into focused workspaces.
- Expected Product Impact: Summary sections such as YES, WATCH, breakout, pullback, alert, and market-statistics modules provide a preview rather than a full terminal view.
- Status: Active
- Date: 2026-07-13
- Related Documents: [product/Dashboard.md](product/Dashboard.md), [07-Decision-Workspace-Concept.md](07-Decision-Workspace-Concept.md)

### Prominent Single AI Experience
- Decision: TradeEvidence will expose one prominent AI experience rather than separate AI Coach and AI Decision Coach modules.
- Reason: Duplicate AI entry points confuse the product model and weaken the experience.
- Expected Product Impact: A large Ask TradeEvidence or Decision Coach panel is available from the homepage and integrated throughout later workflows.
- Status: Active
- Date: 2026-07-14
- Related Documents: [08-AI-Strategy.md](08-AI-Strategy.md), [product/Dashboard.md](product/Dashboard.md)

## Decision Workspace and Decision Quality Decisions

### Evidence Score and Decision Confidence Are Distinct
- Decision: Introduce Decision Confidence as a separate concept from Evidence Score.
- Reason: Evidence can be strong while the current decision context is less favorable because of timing, earnings, extension, weak market context, or elevated risk.
- Expected Product Impact: Users can distinguish objective evidence quality from confidence in acting at the current moment.
- Status: Active
- Date: 2026-07-14
- Related Documents: [product/Decision-Confidence.md](product/Decision-Confidence.md), [07-Decision-Workspace-Concept.md](07-Decision-Workspace-Concept.md)

### Decision Checklist as the Pre-Decision Feature
- Decision: Every Decision Workspace will end with a “Before You Decide” checklist.
- Reason: The checklist directly supports disciplined preparation while preserving user ownership.
- Expected Product Impact: Users review thesis, counter-evidence, risk, sizing, timing, and invalidation before acting.
- Status: Active
- Date: 2026-07-14
- Related Documents: [07-Decision-Workspace-Concept.md](07-Decision-Workspace-Concept.md), [product/Decision-Journal.md](product/Decision-Journal.md)

### Decision Journal Lifecycle
- Decision: The long-term product will support a Decision Journal lifecycle of Checklist → Snapshot → Review → Reflection → Learning → Milestone.
- Reason: TradeEvidence should remember the user's reasoning, not merely the resulting trade.
- Expected Product Impact: Users can revisit what they knew, what changed, and how their decision process evolved.
- Status: Active
- Date: 2026-07-14
- Related Documents: [product/Decision-Journal.md](product/Decision-Journal.md)

## Evidence History and Validation Decisions

### Immutable Evidence Snapshots
- Decision: TradeEvidence should preserve immutable evidence snapshots for each analytical run.
- Reason: Historical evidence is a strategic asset that enables later validation, comparison, and learning.
- Expected Product Impact: The platform will maintain an evidence history repository, preserve both supporting and contradicting evidence, and retain model and data versions alongside each snapshot.
- Status: Active
- Date: 2026-07-14
- Related Documents: [Evidence-History-and-Validation.md](Evidence-History-and-Validation.md), [Evidence-Snapshot-Data-Contract.md](Evidence-Snapshot-Data-Contract.md)

### Devil's Advocate Posture
- Decision: The product should maintain a Devil's Advocate posture in its analysis workflow.
- Reason: Preserving the strongest bullish and bearish case helps reduce confirmation bias and supports more disciplined thinking.
- Expected Product Impact: Users will be able to review both sides of an argument before forming a conclusion.
- Status: Active
- Date: 2026-07-14
- Related Documents: [07-Decision-Workspace-Concept.md](07-Decision-Workspace-Concept.md), [Evidence-History-and-Validation.md](Evidence-History-and-Validation.md)

### Versioned Scoring and Data Models
- Decision: Scoring models and underlying data should be versioned.
- Reason: Historical scores must remain interpretable as the product evolves.
- Expected Product Impact: The platform will support historical validation and outcome measurement over time.
- Status: Active
- Date: 2026-07-14
- Related Documents: [07-Scoring-Engine.md](07-Scoring-Engine.md), [09-Data-Model.md](09-Data-Model.md)

## Community and Growth Decisions

### Community Features Remain Phase 3+
- Decision: Community features such as Decision Stories, mentor mode, milestones, and investment clubs are part of the long-term product vision rather than the MVP.
- Reason: Users first need a strong private decision and learning experience that produces meaningful content worth sharing.
- Expected Product Impact: Social sharing can support organic growth later while remaining aligned with education and disciplined growth.
- Status: Active
- Date: 2026-07-14
- Related Documents: [product/Community-and-Growth.md](product/Community-and-Growth.md)

## Related Documents

- [01a-Product-Philosophy.md](01a-Product-Philosophy.md)
- [01b-User-Personas.md](01b-User-Personas.md)
- [03-Architecture.md](03-Architecture.md)
- [04-Design-System.md](04-Design-System.md)
- [06-Roadmap.md](06-Roadmap.md)
- [07-Decision-Workspace-Concept.md](07-Decision-Workspace-Concept.md)
- [08-AI-Strategy.md](08-AI-Strategy.md)
- [product/Dashboard.md](product/Dashboard.md)
- [product/Decision-Confidence.md](product/Decision-Confidence.md)
- [product/Decision-Journal.md](product/Decision-Journal.md)
- [product/Community-and-Growth.md](product/Community-and-Growth.md)
- [Documentation-Governance.md](Documentation-Governance.md)
