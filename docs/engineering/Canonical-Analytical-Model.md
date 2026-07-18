# Canonical Analytical Model

**Status:** Approved

---

# Purpose

This document defines the conceptual analytical model shared across TradeEvidence.

It is not a database specification.

It defines the common language used by analytical engines.

---

# Philosophy

Every supported symbol has one canonical analytical representation.

This representation is shared throughout the platform.

---

# Shared Analytical Profile

Each symbol contains analytical information describing:

- Market Context
- Technical Evidence
- Fundamental Evidence
- Relative Strength
- Sector Context
- Setup Classification
- Opportunity Classification
- Evidence Score
- Decision Confidence
- Risk Indicators
- Freshness
- Version Information

---

# Consumers

The shared model is consumed by:

- Dashboard
- Decision Workspace
- Portfolio
- Watchlists
- Reports
- Alerts
- AI Coach
- Sector Intelligence
- Market Context

---

# Ownership

Analytical engines populate the shared model.

Consumers never modify it.

---

# Versioning

Every analytical result carries:

- calculation timestamp
- source
- engine version
- data version

Historical results remain reproducible.

---

# Freshness

Every analytical profile records:

- last updated
- current
- stale
- superseded

Consumers should display freshness appropriately.

---

# Phase 1

Analytical profiles are populated from validated CSV imports.

---

# Phase 2

Analytical profiles are generated internally from live market data.

The canonical model remains unchanged.

Only the data acquisition mechanism evolves.

---

# Relationship to Evidence Engine

The Evidence Engine owns evidence generation.

The canonical model stores evidence results.

---

# Relationship to AI

AI consumes the canonical model.

AI never becomes the source of truth.

---

# Relationship to Alerts

Alerts observe changes in analytical profiles.

Alerts do not independently calculate analytical values.

---

# Relationship to Market Context

Market Context contributes information to the canonical model.

The model provides consistent information to all consumers.

---

# Architectural Principle

One shared analytical model.

Many analytical engines.

Many consumers.

One source of truth.
