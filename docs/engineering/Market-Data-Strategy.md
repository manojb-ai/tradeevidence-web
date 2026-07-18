# Market Data Strategy

**Status:** Approved for MVP Phase 1
**Owner:** Engineering
**Related Documents:**

- Master-System-Architecture.md
- MVP-Implementation-Spec.md
- MVP-Data-Schema.md
- API-Contracts-v1.md
- Evidence-Engine-Specification.md
- ADR-002 (Architecture)
- ADR-003 (Market Data Evolution)

---

# Purpose

This document defines how TradeEvidence acquires, manages, and evolves market data.

The objective is to ensure that market-data decisions remain independent from the rest of the application architecture while enabling a phased implementation strategy.

---

# Design Principles

## Principle 1

The application must never depend directly on a specific market-data provider.

Every consumer of market data communicates only through the internal Market Data Service.

---

## Principle 2

The source of market data is an implementation detail.

Consumers should not know whether data originates from:

- CSV files
- Cached datasets
- REST APIs
- Streaming APIs
- Future providers

---

## Principle 3

Market data shall be replaceable without changing business logic.

Changing providers must not require modifications to:

- Evidence Engine
- Decision Workspace
- Scoring Engine
- Decision Confidence
- AI explanations
- User workflows

---

# MVP Phase 1 Strategy

## Data Source

Phase 1 uses CSV files as the official market-data source.

Reasons:

- Simplifies development
- Eliminates external dependencies
- Enables deterministic testing
- Reduces operating costs
- Improves reproducibility
- Supports rapid product iteration

CSV files are considered the authoritative source for market data during MVP.

---

# Why CSV First?

TradeEvidence is validating product-market fit before investing in commercial market-data infrastructure.

The primary objective of MVP is validating:

- product usefulness
- workflow quality
- evidence presentation
- educational value
- decision discipline

rather than demonstrating real-time infrastructure.

---

# Future Evolution

Once the application gains active users and validates demand, TradeEvidence will migrate toward live market-data providers.

Potential providers include:

- Polygon
- Alpaca
- Twelve Data
- Finnhub
- Interactive Brokers
- IEX Cloud

Provider selection remains an engineering decision and is intentionally deferred.

---

# Market Data Service

All market data enters the application through a single abstraction.

```
                Market Data Service
                     │
        ┌────────────┼────────────┐
        │            │            │
      CSV       REST API     Streaming
```

Every downstream component depends only on the Market Data Service.

---

# Data Consumers

Consumers include:

- Dashboard
- Homepage
- Watchlists
- Portfolio
- Evidence Engine
- Decision Workspace
- Alerts
- AI Explanation Service

None of these components should know the underlying provider.

---

# Data Freshness

## Phase 1

CSV snapshots represent the current trading session.

Data freshness is determined by the latest imported dataset.

---

## Future

Provider-specific freshness policies will be introduced.

Possible update frequencies:

- Daily
- Hourly
- On-demand
- Near real-time
- Streaming

The application architecture shall support multiple refresh strategies.

---

# Failure Strategy

Phase 1

CSV loading failures should:

- report validation errors
- preserve previous valid dataset
- prevent partial imports

Future

Provider failures should:

- retry gracefully
- degrade gracefully
- preserve cached data
- notify operations

---

# Provider Independence

Every provider adapter must expose the same internal interface.

Example:

```
MarketDataProvider

getQuote()

getHistory()

getIndicators()

getFundamentals()

getMarketContext()
```

Business logic shall never call provider SDKs directly.

---

# Testing

CSV provides deterministic datasets for:

- regression testing
- scoring validation
- AI validation
- historical comparisons

Future providers will be validated against the same test suite.

---

# Architectural Decision

TradeEvidence intentionally separates:

Business Logic

from

Market Data Acquisition.

This allows engineering teams to improve infrastructure independently from product behavior.

---

# Evolution Timeline

Phase 1

CSV
↓

Phase 2

CSV + Provider Abstraction
↓

Phase 3

Live Provider Integration
↓

Phase 4

Multiple Providers
↓

Phase 5

Provider Redundancy and Failover

---

# Success Criteria

The migration from CSV to live providers should require minimal or no changes to:

- Evidence Engine
- Decision Workspace
- User Interface
- AI Layer
- Decision Confidence
- Scoring Engine

Only the Market Data Service should change.

---

# Summary

CSV is an implementation choice.

Provider abstraction is the architecture.

Real-time data is a future capability—not an architectural dependency.
