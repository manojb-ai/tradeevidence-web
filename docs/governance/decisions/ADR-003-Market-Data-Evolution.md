# ADR-003 — Market Data Evolution Strategy

## Status

Accepted

## Decision

TradeEvidence will implement market data in phases.

Phase 1 uses CSV files as the authoritative data source.

Future phases will introduce live market-data providers through a Market Data Service abstraction.

## Rationale

This approach:

- minimizes MVP complexity
- reduces operating cost
- enables deterministic testing
- validates product-market fit before infrastructure investment
- prevents vendor lock-in
- isolates provider-specific code

## Consequences

Business logic must never depend directly on provider SDKs.

Only the Market Data Service may interact with provider implementations.

Future provider migration should require minimal changes outside the Market Data Service.
