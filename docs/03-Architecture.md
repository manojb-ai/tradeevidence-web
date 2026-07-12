# 03. Architecture

## Overview
TradeEvidence will be built as a modular product experience with a clear separation between a public website and an authenticated trading application.

## Core Product Domain

The product experience is organized around the user's journey from identity and profile to decision-making and learning.

```mermaid
flowchart TD
    U[User] --> TP[Trading Profile]
    TP --> P[Persona]
    P --> DW[Decision Workspace]
    DW --> E[Evidence]
    E --> D[Decision]
    D --> J[Journal]
    J --> CI[Continuous Improvement]
```

The Decision Workspace becomes the primary surface for market context, evidence review, risk framing, and post-decision reflection. The trading profile and persona inform personalization, while the journal and continuous improvement loop help the trader develop judgment over time.

## High-level Architecture

```mermaid
flowchart LR
    A[Public Website] --> B[Authenticated App]
    B --> C[Research Workspace]
    C --> D[Scoring Engine]
    C --> E[AI Services]
    C --> F[Market Data]
    C --> G[Database]
    D --> H[Explainable Scores]
    E --> I[Summaries and Review]
```

## Frontend
The user-facing experience will be built with:
- Next.js
- React
- TypeScript
- Tailwind CSS

The frontend will support:
- desktop-first trading workflows
- responsive layouts for broader access
- modular dashboard and workspace surfaces
- light, dark, and system theme support

```mermaid
flowchart LR
    subgraph Frontend[Frontend Surface]
        Landing[Landing Pages]
        App[Authenticated App]
        Dash[Dashboard]
        Modules[Workspace Modules - Placeholder]
    end

    Landing --> App
    App --> Dash
    App --> Modules
```

## Backend (Future)
A backend layer will be introduced when the product requires authenticated services, persistent analysis workflows, and data synchronization.

```mermaid
flowchart TD
    Client[Frontend] --> API[API Layer - Placeholder]
    API --> Services[Core Services - Placeholder]
    Services --> Store[(Persistent Storage - Placeholder)]
```

## Authentication
Authentication will support secure access to the authenticated application and protect personal workspaces, journals, and saved analysis.

```mermaid
flowchart LR
    User[Trader] --> Auth[Authentication Layer - Placeholder]
    Auth --> App[Protected App Experience]
    Auth --> Profile[User Profile - Placeholder]
```

## Market Data
Market data services will provide the context required for:
- watchlists
- sector views
- scanners
- market summaries
- score inputs

## Scoring Engine
The scoring engine will combine multiple evidence categories into explainable scores. It will remain transparent and non-black-box in nature.

```mermaid
flowchart TD
    Inputs[Evidence Inputs - Placeholder] --> Engine[Scoring Engine]
    Engine --> Output[Explainable Score]
    Output --> Review[Trader Review]
```

## Evidence History and Validation
TradeEvidence should treat evidence as a durable asset rather than a transient calculation. Each scoring run should produce an immutable Evidence Snapshot that captures the market context, the evidence used, the model version, the data version, and the later outcome. This supports historical validation and enables the platform to learn from its own past assessments without overwriting earlier beliefs.

The architecture should therefore preserve:
- an Evidence History Repository for persisted snapshots and review trails
- model versioning and data versioning for every score and analysis run
- outcome measurements that compare earlier expectations with what later occurred
- a Devil's Advocate perspective that preserves both supporting and contradicting evidence
- a Future Evidence Lab for retrospective analysis and product learning

This pattern is described in more detail in [Evidence-History-and-Validation.md](Evidence-History-and-Validation.md) and the expected record structure is defined in [Evidence-Snapshot-Data-Contract.md](Evidence-Snapshot-Data-Contract.md).

## AI Services
AI services may be used for:
- explaining scores
- summarizing evidence
- reviewing journals
- generating reports
- supporting educational assistance

AI should support trader decisions without replacing them.

```mermaid
flowchart LR
    Evidence[Evidence and Scores] --> AI[AI Services - Placeholder]
    AI --> Explain[Plain-language Explanation]
    AI --> Summaries[Journal and Report Summaries]
    Explain --> Trader[Trader Decision]
    Summaries --> Trader
```

## Database
A persistent data store will be needed for user content, saved analyses, journals, alerts, portfolios, and market context.

```mermaid
flowchart TB
    App[Application Services] --> DB[(Database - Placeholder)]
    DB --> UserData[User Content]
    DB --> MarketData[Market Context]
    DB --> Analysis[Saved Analysis]
```

## Deployment
The product will use:
- GitHub for source control and collaboration
- Vercel for deployment and hosting

```mermaid
flowchart LR
    Repo[GitHub Repository - Placeholder] --> Deploy[Vercel or Similar Hosting - Placeholder]
    Deploy --> App[Frontend Application]
    Deploy --> API[API Services - Placeholder]
    API --> DB[(Database - Placeholder)]
```

## GitHub
GitHub will serve as the collaboration and source-control layer for the product.

```mermaid
flowchart TD
    Repo[Repository - Placeholder] --> PR[Pull Requests - Placeholder]
    Repo --> Issues[Issues and Planning - Placeholder]
    Repo --> Actions[CI/CD - Placeholder]
```

## Vercel
Vercel will be considered for hosting and deployment once the initial application and deployment workflow are defined.

```mermaid
flowchart LR
    Vercel[Vercel Project - Placeholder] --> Preview[Preview Deployments - Placeholder]
    Vercel --> Prod[Production Deployments - Placeholder]
    Vercel --> Env[Environment Configuration - Placeholder]
```

## Future Cloud Architecture
As the platform grows, the architecture may evolve to include:
- managed application hosting
- API services for market and scoring data
- asynchronous background processing for alerts and reports
- observability and analytics

```mermaid
flowchart LR
    Client[Frontend] --> Edge[Edge or CDN - Placeholder]
    Client --> API[API Services - Placeholder]
    API --> Queue[Background Jobs - Placeholder]
    API --> DB[(Primary Database - Placeholder)]
    API --> Cache[(Cache - Placeholder)]
    Queue --> Notify[Alerts and Reports - Placeholder]
```

## Request Flow

```mermaid
sequenceDiagram
    participant User as Trader
    participant UI as Frontend
    participant Auth as Auth
    participant Data as Market Data
    participant Score as Scoring Engine
    participant AI as AI Services

    User->>UI: Open dashboard
    UI->>Auth: Verify access
    UI->>Data: Load market context
    UI->>Score: Request score context
    Score-->>UI: Return explainable results
    UI->>AI: Request summary or explanation
    AI-->>UI: Return assisted insights
    UI-->>User: Display workspace
```

## Deployment Concept

```mermaid
flowchart LR
    GH[GitHub Repository] --> Vercel[Vercel Hosting]
    Vercel --> FE[Frontend Application]
    Vercel --> API[Future API Services]
    API --> DB[(Database)]
    API --> MD[Market Data Providers]
```

---

## TODO

### High
- Define the initial backend service boundaries for the first production-ready release.
- Clarify the authentication provider and account model assumptions.
- Decide the storage strategy for user content, market context, and saved analysis.

### Medium
- Document the expected interaction between the frontend, scoring services, and AI-assisted review flows.
- Clarify whether the first release needs asynchronous processing for reports or alerts.

### Low
- Add a more detailed deployment diagram once hosting and operational responsibilities are finalized.

## Related Documents
- [00-PRD.md](00-PRD.md)
- [01a-Product-Philosophy.md](01a-Product-Philosophy.md)
- [04-Design-System.md](04-Design-System.md)
- [05-Product-Decisions.md](05-Product-Decisions.md)
- [06-Roadmap.md](06-Roadmap.md)
- [07-Decision-Workspace-Concept.md](07-Decision-Workspace-Concept.md)
- [08-AI-Strategy.md](08-AI-Strategy.md)
- [09-Data-Model.md](09-Data-Model.md)
- [Trading-Profile.md](Trading-Profile.md)
