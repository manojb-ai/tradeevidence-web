# Product Decision Log

## Documentation Status
Status: Approved
Version: 1.0
Owner: Product
Last Updated: 2026-07-18
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

## Engineering Governance Decisions

### Selective AI-DLC Adoption for Building TradeEvidence
- Decision: TradeEvidence adopts AI-DLC selectively, using risk-based rigor determined by the Chief Software Architect.
- Reason: The engineering phase requires stronger traceability, architecture discipline, and delivery consistency while preserving human accountability.
- Expected Product Impact: Product strategy and user-facing AI boundaries remain unchanged, while development execution quality and governance improve.
- Status: Active
- Date: 2026-07-18
- Related Documents: [governance/decisions/ADR-001-Adopt-AI-DLC.md](governance/decisions/ADR-001-Adopt-AI-DLC.md), [governance/AI-DLC-Adoption-Policy.md](governance/AI-DLC-Adoption-Policy.md), [engineering/TradeEvidence-Engineering-Lifecycle.md](engineering/TradeEvidence-Engineering-Lifecycle.md)

### Product AI and Development AI Are Governed Separately
- Decision: Product AI behavior is governed by product strategy, while development AI use is governed by AI-DLC policy and engineering governance.
- Reason: Separating these concerns prevents process decisions from being misread as user-facing product behavior changes.
- Expected Product Impact: TradeEvidence continues to position AI as educational decision support for traders, not autonomous advice, while engineering teams use AI under human-controlled delivery governance.
- Status: Active
- Date: 2026-07-18
- Related Documents: [08-AI-Strategy.md](08-AI-Strategy.md), [governance/AI-DLC-Adoption-Policy.md](governance/AI-DLC-Adoption-Policy.md), [governance/Human-AI-Responsibility-Matrix.md](governance/Human-AI-Responsibility-Matrix.md)

### Decision Intelligence Platform Architecture Adopted
- Decision: TradeEvidence architecture is approved as a layered Decision Intelligence Platform targeting Earned Confidence outcomes.
- Reason: A layered model with specialized analytical engines and shared platform services improves separation of concerns, explainability, and long-term evolvability.
- Expected Product Impact: Dashboard and workspace surfaces consume analytical outputs instead of performing business calculations, preserving consistency across user workflows.
- Status: Active
- Date: 2026-07-18
- Related Documents: [engineering/Master-System-Architecture.md](engineering/Master-System-Architecture.md), [engineering/Canonical-Analytical-Model.md](engineering/Canonical-Analytical-Model.md), [governance/decisions/ADR-002-Master-System-Architecture.md](governance/decisions/ADR-002-Master-System-Architecture.md)

### Workshop #1 Architecture Baseline Closed
- Decision: Architecture Workshop #1 is closed with approved architecture baseline documents.
- Reason: Workshop closure confirms the authoritative engineering architecture baseline for subsequent implementation planning and architecture workshops.
- Expected Product Impact: Future engineering specifications and implementation planning will reference the approved baseline rather than introducing alternate architectural interpretations.
- Status: Active
- Date: 2026-07-18
- Related Documents: [workshops/Architecture-Workshop-Plan.md](workshops/Architecture-Workshop-Plan.md), [engineering/Master-System-Architecture.md](engineering/Master-System-Architecture.md), [engineering/Canonical-Analytical-Model.md](engineering/Canonical-Analytical-Model.md), [governance/decisions/ADR-002-Master-System-Architecture.md](governance/decisions/ADR-002-Master-System-Architecture.md)

### MVP Phase 1 Uses CSV While Preserving Provider Abstraction
- Decision: MVP Phase 1 uses CSV as the authoritative market-data source while architecture is built around a Market Data Service abstraction.
- Reason: This enables deterministic MVP delivery and testing without coupling product behavior to a specific market-data provider.
- Expected Product Impact: Product workflows remain stable while market-data infrastructure can evolve from CSV to live providers with minimal downstream disruption.
- Status: Active
- Date: 2026-07-18
- Related Documents: [engineering/Market-Data-Strategy.md](engineering/Market-Data-Strategy.md), [governance/decisions/ADR-003-Market-Data-Evolution.md](governance/decisions/ADR-003-Market-Data-Evolution.md)

## Workshop #2 Decisions (2026-07-19)

### MVP Vertical Slice Approved
- Decision: The first slice moves an authenticated user from Today's Briefing and a deterministic Evidence-Aligned Opportunity into a symbol Decision Workspace with market and sector context, inspectable Technical Evidence, Devil's Advocate analysis, categorical Decision Confidence, educational strategy alignment, grounded Ask TradeEvidence, and a non-transactional checklist.
- Reason: One small end-to-end workflow validates the core decision-preparation value while preserving explainability and non-advisory boundaries.
- Expected Product Impact: Implementation can proceed without importing deferred portfolio, journal, brokerage, or personalization complexity.
- Status: Active
- Related Documents: [engineering/MVP-Implementation-Spec.md](engineering/MVP-Implementation-Spec.md), [workshops/Workshop-02-Summary.md](workshops/Workshop-02-Summary.md)

### Technical Evidence, Decision Confidence, and Strategy Alignment Remain Distinct
- Decision: Phase 1 uses a transparent Technical Evidence Score, separate categorical Decision Confidence, and separate Educational Strategy Alignment. Missing evidence is not negative evidence; incomplete results receive no normal opportunity classification; current weights remain unvalidated hypotheses.
- Reason: Separate concepts prevent false precision, hidden contradictions, and advisory interpretation.
- Expected Product Impact: Users can inspect what supports, contradicts, or limits a result without reading it as prediction or recommendation.
- Status: Active
- Related Documents: [engineering/MVP-Implementation-Spec.md](engineering/MVP-Implementation-Spec.md), [product/Decision-Confidence.md](product/Decision-Confidence.md)

### Deterministic Evidence-Aligned Opportunities
- Decision: The Homepage shows up to five complete, current Evidence-Aligned Opportunities selected by versioned deterministic rules, with visible constraints and sector diversity that never lowers evidence standards.
- Reason: The Homepage should focus attention without implying conviction, certainty, or recommendation.
- Expected Product Impact: Users receive a reproducible entry point into deeper research and a truthful no-opportunity state.
- Status: Active
- Related Documents: [engineering/MVP-Implementation-Spec.md](engineering/MVP-Implementation-Spec.md), [product/Dashboard.md](product/Dashboard.md)

### Grounded Ask TradeEvidence v1
- Decision: Ask TradeEvidence explains and challenges recorded evidence but cannot create evidence, alter scores, recommend actions, personalize suitability, predict outcomes, or invent missing information.
- Reason: AI improves understanding without becoming analytical or decision authority.
- Expected Product Impact: The AI experience is useful, traceable, provider-independent, and safely degradable.
- Status: Active
- Related Documents: [engineering/MVP-Implementation-Spec.md](engineering/MVP-Implementation-Spec.md), [08-AI-Strategy.md](08-AI-Strategy.md)

### Immutable Atomic Snapshot Publication and Retention
- Decision: Runs are versioned, validated, human-approved during Phase 1, atomically published, and immutable. Object storage preserves accepted bundles, an operational database serves historical queries, cache/CDN serves precomputed views, and the regular-session close is Phase 1's canonical observation.
- Reason: Reproducibility, trend analysis, honest outcome evaluation, and high website performance require separate archive, query, and delivery responsibilities.
- Expected Product Impact: Failed or partial runs cannot replace current data, every published score can be reproduced, and request performance remains independent of archive size.
- Status: Active
- Related Documents: [governance/decisions/ADR-004-Canonical-Market-Observations-and-Retention.md](governance/decisions/ADR-004-Canonical-Market-Observations-and-Retention.md), [engineering/MVP-Implementation-Spec.md](engineering/MVP-Implementation-Spec.md)

## Workshop #3 Decisions (2026-08-02)

### Hybrid MVP Persistence and Immutable Publication Model
- Decision: Accepted analytical artifacts use immutable object storage, while a PostgreSQL-compatible relational database provides the authoritative application read model. A transactional publication pointer exposes one complete approved run per channel, and caches remain disposable.
- Reason: Reproducibility, atomic publication, historical queries, and high website performance require separate archival, query, and delivery responsibilities.
- Expected Product Impact: The website can serve fast current and historical views without scanning archives or recalculating analytical results during requests.
- Status: Active
- Related Documents: [engineering/MVP-Data-Schema.md](engineering/MVP-Data-Schema.md), [governance/decisions/ADR-005-MVP-Persistence-and-Data-Integrity.md](governance/decisions/ADR-005-MVP-Persistence-and-Data-Integrity.md)

### Stable Identity, Versioned Lineage, and Semantic Duplicate Detection
- Decision: Analytical entities use stable opaque identities and single-run ownership. Imports preserve complete artifact/version lineage and distinguish execution identity, bundle integrity, and normalized analytical equivalence.
- Reason: Ticker changes, retries, corrected data, and repeated equivalent executions must not create ambiguous, mixed, duplicated, or silently rewritten history.
- Expected Product Impact: Exact retries are idempotent, equivalent runs are marked redundant, meaningful changes require a new approved candidate, and every published record remains reproducible.
- Status: Active
- Related Documents: [engineering/MVP-Data-Schema.md](engineering/MVP-Data-Schema.md), [workshops/Workshop-03-Summary.md](workshops/Workshop-03-Summary.md)

### Deny-by-Default Private User Data
- Decision: TradeEvidence separates stable internal user identity from authentication-provider identity and enforces owner isolation across application, API, database, cache, and object access. Normal users and normal staff roles cannot access another user's private information; exceptional staff access is selective, explicitly authorized, and audited.
- Reason: Private research data requires defense-in-depth isolation and must not depend on email addresses or a specific authentication vendor.
- Expected Product Impact: Phase 1 watchlists remain private and portable across future authentication choices, while privileged access is narrowly governed.
- Status: Active
- Related Documents: [engineering/MVP-Data-Schema.md](engineering/MVP-Data-Schema.md), [governance/decisions/ADR-005-MVP-Persistence-and-Data-Integrity.md](governance/decisions/ADR-005-MVP-Persistence-and-Data-Integrity.md)

### Versioned Append-Only Outcome Measurement
- Decision: Outcome measurements are versioned, append-only observations linked to immutable snapshots. Trading-session horizons, anchor basis, benchmark, corporate-action treatment, missing-data state, and corrections remain explicit.
- Reason: Later results must never change what TradeEvidence originally observed or silently treat missing, delisted, acquired, or complex-action cases as zero.
- Expected Product Impact: The platform gains an auditable foundation for future validation without claiming current predictive validity.
- Status: Active; outcome methodology validation remains deferred
- Related Documents: [engineering/MVP-Data-Schema.md](engineering/MVP-Data-Schema.md), [Evidence-History-and-Validation.md](Evidence-History-and-Validation.md)

### Workshop #3 Data Schema Closed
- Decision: Workshop #3 is closed with an implementation-ready MVP data schema, accepted persistence ADR, integrity constraints, query/index strategy, migration policy, privacy boundaries, acceptance tests, risks, and explicit deferred scope.
- Reason: API design requires a stable, authoritative data contract and clear integrity boundaries.
- Expected Product Impact: Workshop #4 can define provider-independent API contracts without inventing schema semantics.
- Status: Active
- Related Documents: [engineering/MVP-Data-Schema.md](engineering/MVP-Data-Schema.md), [workshops/Workshop-03-Summary.md](workshops/Workshop-03-Summary.md)

## Workshop #4 Decisions (2026-08-02)

### Long-Lived Internal API v1 Contract
- Decision: Phase 1 uses an internal resource-oriented HTTPS JSON API under `/api/v1`, with stable naming, value, envelope, compatibility, and major-version rules. `v1` is a long-lived contract boundary rather than a release number.
- Reason: One provider-independent contract prevents frontend features from coupling to database tables, engine files, vendors, or inconsistent response conventions.
- Expected Product Impact: The frontend and backend can evolve independently through compatible additive changes while genuine breaking changes receive explicit review.
- Status: Active
- Related Documents: [engineering/API-Contracts-v1.md](engineering/API-Contracts-v1.md), [governance/decisions/ADR-006-Internal-API-Contract-and-Evolution.md](governance/decisions/ADR-006-Internal-API-Contract-and-Evolution.md)

### Same-Run Analytical API Integrity
- Decision: Homepage, Decision Workspace, Evidence, and grounded AI responses resolve through the publication pointer or an explicit accessible run and remain pinned to one complete analytical run with server-owned freshness and observation identity.
- Reason: A user must never receive new market context combined with old symbol evidence or silently change evidence during active review.
- Expected Product Impact: Analytical journeys remain explainable, reproducible, stale-aware, and safe during publication changes or integrity failures.
- Status: Active
- Related Documents: [engineering/API-Contracts-v1.md](engineering/API-Contracts-v1.md), [engineering/MVP-Data-Schema.md](engineering/MVP-Data-Schema.md)

### Owner-Derived Private API Authorization
- Decision: Private APIs derive ownership from verified internal identity, never accept client-supplied ownership authority, conceal cross-user resources, and reserve exceptional staff access for a separate selective and audited boundary.
- Reason: API-level authorization must enforce the deny-by-default privacy model approved in Workshop #3.
- Expected Product Impact: Watchlists remain private across provider choices, normal users and staff cannot bypass ownership, and security behavior is testable and consistent.
- Status: Active
- Related Documents: [engineering/API-Contracts-v1.md](engineering/API-Contracts-v1.md), [governance/decisions/ADR-006-Internal-API-Contract-and-Evolution.md](governance/decisions/ADR-006-Internal-API-Contract-and-Evolution.md)

### Grounded Ask TradeEvidence API
- Decision: Ask TradeEvidence accepts a bounded question, intent, instrument, and published run identity; the server assembles same-run context and returns structured educational output with evidence references, counterpoints, missing information, and guardrail disposition.
- Reason: AI explanation must remain useful and traceable without becoming analytical authority, advisory behavior, or unrestricted data access.
- Expected Product Impact: AI failures remain isolated, advisory questions are productively redirected, retries are idempotent, and unavailable facts are not invented.
- Status: Active
- Related Documents: [engineering/API-Contracts-v1.md](engineering/API-Contracts-v1.md), [08-AI-Strategy.md](08-AI-Strategy.md)

### Workshop #4 API Contracts Closed
- Decision: Workshop #4 is closed with aligned human-readable and machine-readable API contracts, stable errors, retry/idempotency/concurrency behavior, performance and security targets, contract-test requirements, and explicit deferred modules.
- Reason: Frontend and backend architecture require stable product-facing contracts and acceptance boundaries before implementation decomposition.
- Expected Product Impact: Workshop #5 can choose routes, services, state, caching, and test seams without changing approved product or API semantics.
- Status: Active
- Related Documents: [engineering/API-Contracts-v1.md](engineering/API-Contracts-v1.md), [engineering/openapi-v1.json](engineering/openapi-v1.json), [workshops/Workshop-04-Summary.md](workshops/Workshop-04-Summary.md)

## Workshop #5 Decisions (2026-08-02)

### Modular Monolith with Pragmatic Clean Architecture
- Decision: Phase 1 uses one horizontally scalable Next.js modular monolith for the public site, authenticated product, and `/api/v1`, with inward dependencies and a separate deterministic analytics producer.
- Reason: The MVP needs enforceable separation without premature distributed-system cost or request-time duplication of analytical behavior.
- Expected Product Impact: Product delivery remains manageable while UI, use cases, domain rules, persistence, providers, and analytics retain extraction-ready boundaries.
- Status: Active
- Related Documents: [engineering/MVP-Application-Architecture.md](engineering/MVP-Application-Architecture.md), [governance/decisions/ADR-007-MVP-Application-Architecture.md](governance/decisions/ADR-007-MVP-Application-Architecture.md)

### Canonical Same-Origin Product and Server-First Frontend
- Decision: `https://www.tradeevidence.com` is the canonical production origin; public, product, and API surfaces remain same-origin; Server Components are the default with bounded Client Component interactions and approved feature boundaries.
- Reason: Canonical routing, secure sessions, efficient rendering, and limited browser authority reduce operational and security complexity.
- Expected Product Impact: Visitors converge through safe HTTPS redirects, protected journeys survive validated sign-in returns, and authenticated pages remain fast, private, and consistently structured.
- Status: Active
- Related Documents: [engineering/MVP-Application-Architecture.md](engineering/MVP-Application-Architecture.md), [workshops/Workshop-05-Summary.md](workshops/Workshop-05-Summary.md)

### Future Approved-Widget Dashboard Boundary
- Decision: MVP features preserve stable, authorized, state-explicit widget-ready presentation boundaries, while user-created dashboards, arbitrary JavaScript, saved layout implementation, and a grid library remain deferred.
- Reason: The architecture should preserve future personalization without weakening the validated default workflow or paying speculative accessibility, persistence, and migration cost.
- Expected Product Impact: TradeEvidence can later offer user-arranged approved widgets without moving calculations or ownership authority into the browser.
- Status: Active; implementation deferred
- Related Documents: [engineering/MVP-Application-Architecture.md](engineering/MVP-Application-Architecture.md), [product/Dashboard.md](product/Dashboard.md)

### Semantic Cache Separation and Scale Evolution
- Decision: Immutable/run-specific universal analytics, mutable publication pointers, and private responses use distinct cache policies. PostgreSQL remains authoritative; CDN and distributed in-memory caching may be introduced as non-authoritative scale infrastructure based on measurement.
- Reason: Fast analytical delivery must never mix runs, hide freshness, leak private data, or turn disposable acceleration into the system of record.
- Expected Product Impact: Phase 1 stays operationally simple while retaining a safe path toward high concurrency, coordinated invalidation, stampede protection, and horizontal scale.
- Status: Active
- Related Documents: [engineering/MVP-Application-Architecture.md](engineering/MVP-Application-Architecture.md), [engineering/MVP-Data-Schema.md](engineering/MVP-Data-Schema.md)

### Deny-by-Default Application Security and Abuse Resistance
- Decision: Provider-independent server sessions, per-use-case authorization, owner-scoped persistence, exceptional audited staff access, endpoint resource budgets, and layered DoS controls govern protected application behavior.
- Reason: Authentication alone does not prove resource access, and availability controls must not weaken privacy or analytical integrity.
- Expected Product Impact: Cross-user access is prevented at multiple tested layers, staff access remains selective, and expensive or abusive traffic can degrade safely before core evidence review fails.
- Status: Active
- Related Documents: [engineering/MVP-Application-Architecture.md](engineering/MVP-Application-Architecture.md), [engineering/API-Contracts-v1.md](engineering/API-Contracts-v1.md)

### Architecture and Cross-Browser Acceptance Gates
- Decision: Domain, database, API, component, end-to-end, browser, architecture, security, performance, and scale tests enforce Workshop 5 boundaries, with human approval for Level 3 concerns and releases.
- Reason: Architectural labels and browser compatibility are meaningful only when dependency direction, negative security behavior, run consistency, accessibility, and measured performance are continuously verified.
- Expected Product Impact: The critical journey is supported across current popular browsers and cannot be accepted on happy-path UI behavior alone.
- Status: Active
- Related Documents: [engineering/MVP-Application-Architecture.md](engineering/MVP-Application-Architecture.md), [workshops/Workshop-05-Summary.md](workshops/Workshop-05-Summary.md)

### Workshop #5 Application Architecture Closed
- Decision: Workshop #5 is closed with approved topology, routes, components, state, caching, services, security, resilience, scalability, and test seams.
- Reason: Evidence Engine design requires a stable application boundary that will consume published analytical outputs without absorbing scoring behavior.
- Expected Product Impact: Workshop #6 can define the Evidence Engine without reopening frontend/backend responsibilities or approved API semantics.
- Status: Active
- Related Documents: [engineering/MVP-Application-Architecture.md](engineering/MVP-Application-Architecture.md), [governance/decisions/ADR-007-MVP-Application-Architecture.md](governance/decisions/ADR-007-MVP-Application-Architecture.md), [workshops/Workshop-05-Summary.md](workshops/Workshop-05-Summary.md)

## Workshop #6 Decisions (2026-08-23)

### Direction-Aware Reconciled Technical Evidence
- Decision: Technical Evidence independently allocates bullish, bearish, neutral, and unavailable capacity; direction, alignment, coverage, classification, and Decision Confidence remain separate; missing required inputs produce Incomplete; every factor and snapshot reconciles exactly.
- Reason: Absence of bullish evidence is not bearish evidence, missing data is not neutrality, and an explainable score requires an auditable contribution ledger.
- Expected Product Impact: Traders can review Bullish, Bearish, Watch, Mixed, Neutral, and Incomplete evidence without forced labels, hidden missing data, or probability-like claims.
- Status: Active
- Related Documents: [engineering/Evidence-Engine-Specification.md](engineering/Evidence-Engine-Specification.md), [governance/decisions/ADR-008-Evidence-Engine-Governance.md](governance/decisions/ADR-008-Evidence-Engine-Governance.md)

### Provider-Neutral Versioned Evidence Pipeline
- Decision: Provider adapters create canonical normalized observations; a versioned factor registry evaluates them; exact reconciliation creates immutable Evidence Snapshots; controlled publication exposes them to downstream consumers. CSV remains a Phase 1 adapter, not an engine dependency.
- Reason: Provider transport, scoring semantics, storage, and presentation must evolve independently without silent analytical changes.
- Expected Product Impact: TradeEvidence can validate CSV today and add future market-data sources without rewriting the core engine or losing reproducibility.
- Status: Active
- Related Documents: [engineering/Evidence-Engine-Specification.md](engineering/Evidence-Engine-Specification.md), [engineering/Canonical-Analytical-Model.md](engineering/Canonical-Analytical-Model.md)

### Immutable Evidence History and Traceable Reruns
- Decision: Snapshot content is append-only and retains input checksums, factor ledgers, explanations, support, contradiction, invalidation, and all applicable versions. Retries are idempotent, intentional reruns remain distinct events, and equivalent content may be deduplicated without losing run history.
- Reason: Later review must recover exactly what TradeEvidence calculated and why without overwriting history or confusing retries with new analysis.
- Expected Product Impact: Historical timelines, alerts, audits, corrections, and future validation can reference trustworthy immutable evidence.
- Status: Active
- Related Documents: [Evidence-History-and-Validation.md](Evidence-History-and-Validation.md), [engineering/Evidence-Engine-Specification.md](engineering/Evidence-Engine-Specification.md), [engineering/MVP-Data-Schema.md](engineering/MVP-Data-Schema.md)

### Layered Explanations with Timeframe-Aware Devil's Advocate
- Decision: Deterministic explanations preserve principal support, contradiction, unavailable evidence, invalidation, and distinct daily/weekly/monthly roles. Beginner and detailed views use progressive disclosure over the same canonical facts; AI may explain but cannot create or alter evidence.
- Reason: Newer traders need clarity without overload, while experienced traders need factor allocations and higher-timeframe contradictions.
- Expected Product Impact: Explanations remain approachable, inspectable, and honest about conflicting evidence without changing scores by audience.
- Status: Active
- Related Documents: [engineering/Evidence-Engine-Specification.md](engineering/Evidence-Engine-Specification.md), [08-AI-Strategy.md](08-AI-Strategy.md)

### Controlled Ruleset and Validation Lifecycle
- Decision: Rulesets move through Draft, Candidate, Approved, Production, and Retired states. Promotion requires structural tests, mirrored bullish/bearish tests, founder chart review, multi-date shadow runs, approved outcome methodology, documentation, and explicit human approval.
- Reason: Passing software tests or matching selected examples does not establish production suitability or predictive validity.
- Expected Product Impact: Material scoring changes remain versioned, reversible, evidence-backed, and unable to silently replace production history.
- Status: Active; Candidate 2 remains experimental
- Related Documents: [engineering/Evidence-Engine-Specification.md](engineering/Evidence-Engine-Specification.md), [governance/decisions/ADR-008-Evidence-Engine-Governance.md](governance/decisions/ADR-008-Evidence-Engine-Governance.md), [workshops/Workshop-06-Summary.md](workshops/Workshop-06-Summary.md)

### Evidence Engine Product Boundary
- Decision: The engine owns deterministic evidence evaluation and snapshots. It does not own acquisition, authentication, user state, alert delivery, AI conversation, Decision Confidence, trader decisions, execution, personalized advice, outcome claims, or production promotion. Alerts consume committed snapshots and do not calculate evidence.
- Reason: Analytical authority must remain deterministic and cannot leak into UI, AI, alerts, or transactional behavior.
- Expected Product Impact: Many analytical engines and consumers can share one canonical model without duplicating scoring or weakening non-advisory positioning.
- Status: Active
- Related Documents: [engineering/Evidence-Engine-Specification.md](engineering/Evidence-Engine-Specification.md), [engineering/Master-System-Architecture.md](engineering/Master-System-Architecture.md), [engineering/Canonical-Analytical-Model.md](engineering/Canonical-Analytical-Model.md)

### Workshop #6 Evidence Engine Closed
- Decision: Workshop #6 is closed with approved direction, pipeline, normalized input, factor registry, score, completeness, reconciliation, immutable history, explanations, timeframe roles, validation, ruleset lifecycle, execution semantics, and product boundaries.
- Reason: AI Workflow design requires a stable evidence authority and explicit constraints on what AI may consume and explain.
- Expected Product Impact: Workshop #7 can define grounded AI behavior without reopening evidence calculation or allowing AI to become the source of truth.
- Status: Active
- Related Documents: [engineering/Evidence-Engine-Specification.md](engineering/Evidence-Engine-Specification.md), [governance/decisions/ADR-008-Evidence-Engine-Governance.md](governance/decisions/ADR-008-Evidence-Engine-Governance.md), [workshops/Workshop-06-Summary.md](workshops/Workshop-06-Summary.md)

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
- [governance/decisions/ADR-001-Adopt-AI-DLC.md](governance/decisions/ADR-001-Adopt-AI-DLC.md)
- [governance/decisions/ADR-002-Master-System-Architecture.md](governance/decisions/ADR-002-Master-System-Architecture.md)
- [governance/decisions/ADR-003-Market-Data-Evolution.md](governance/decisions/ADR-003-Market-Data-Evolution.md)
- [governance/decisions/ADR-004-Canonical-Market-Observations-and-Retention.md](governance/decisions/ADR-004-Canonical-Market-Observations-and-Retention.md)
- [governance/decisions/ADR-005-MVP-Persistence-and-Data-Integrity.md](governance/decisions/ADR-005-MVP-Persistence-and-Data-Integrity.md)
- [governance/decisions/ADR-006-Internal-API-Contract-and-Evolution.md](governance/decisions/ADR-006-Internal-API-Contract-and-Evolution.md)
- [governance/decisions/ADR-007-MVP-Application-Architecture.md](governance/decisions/ADR-007-MVP-Application-Architecture.md)
- [governance/decisions/ADR-008-Evidence-Engine-Governance.md](governance/decisions/ADR-008-Evidence-Engine-Governance.md)
- [governance/AI-DLC-Adoption-Policy.md](governance/AI-DLC-Adoption-Policy.md)
- [engineering/Master-System-Architecture.md](engineering/Master-System-Architecture.md)
- [engineering/Canonical-Analytical-Model.md](engineering/Canonical-Analytical-Model.md)
- [engineering/TradeEvidence-Engineering-Lifecycle.md](engineering/TradeEvidence-Engineering-Lifecycle.md)
- [engineering/Market-Data-Strategy.md](engineering/Market-Data-Strategy.md)
- [engineering/MVP-Data-Schema.md](engineering/MVP-Data-Schema.md)
- [engineering/API-Contracts-v1.md](engineering/API-Contracts-v1.md)
- [engineering/MVP-Application-Architecture.md](engineering/MVP-Application-Architecture.md)
- [engineering/Evidence-Engine-Specification.md](engineering/Evidence-Engine-Specification.md)
- [workshops/Workshop-06-Summary.md](workshops/Workshop-06-Summary.md)
