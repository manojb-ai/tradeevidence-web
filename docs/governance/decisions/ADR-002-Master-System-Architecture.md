# ADR-002 — Master System Architecture

## Status

Accepted

---

## Decision

TradeEvidence will be implemented as a Decision Intelligence Platform.

The architecture follows a layered model consisting of:

- Presentation Layer
- Application Layer
- Analytical Engines
- Platform Services
- Data Layer
- Provider Layer

---

## Architectural Outcome

The platform exists to help users build Earned Confidence through evidence, disciplined evaluation, explainable reasoning, and continuous learning.

---

## Principles

The architecture adopts the following principles:

- Decision-centered design
- Explainability
- Separation of concerns
- Provider independence
- AI assists but does not replace business logic
- Immutable evidence history
- Shared canonical analytical model

---

## Consequences

Analytical logic resides inside specialized engines.

Dashboard components consume engine outputs.

Business logic never depends directly on market-data providers.

The architecture supports CSV for MVP while remaining provider-independent.
