# ADR-004 — Canonical Market Observations and Retention

## Status

Accepted

## Date

2026-07-19

## Decision

The official regular-session close is the canonical market observation for
Phase 1. Each accepted end-of-day Evidence Snapshot is immutable and retained
permanently.

Intraday and real-time observations introduced in later phases must be stored
as separate snapshot types. Comparisons must be like-for-like: end-of-day with
end-of-day, or intraday observations with the same defined observation point.

TradeEvidence will retain the market data needed to reproduce every published
score. It will not retain second-level or tick data indefinitely unless an
approved analytical, operational, audit, or regulatory use case requires it
and the applicable data license permits it.

## Required Snapshot Identity

Every published snapshot must identify:

- snapshot type (`eod`, `intraday`, or `realtime`)
- market-data `as_of` timestamp and timezone
- trading session (`regular`, `premarket`, or `afterhours`)
- bar interval
- canonical price used by the analytical engine
- provider or source and data version
- adjustment policy and relevant corporate-action information
- engine, ruleset, and schema versions

## Retention by Phase

### Phase 1

- Permanently retain daily OHLCV, the canonical close, corporate-action and
  adjustment information, accepted analytical snapshots, and outcome anchors.
- Never overwrite an accepted snapshot.

### Phase 2

- Retain each published intraday snapshot and enough aggregated intraday data
  to reproduce it.
- Prefer one-minute or five-minute bars unless a finer interval has an approved
  product or analytical requirement.
- Keep the canonical end-of-day snapshot distinct from intraday snapshots.

### Phase 3

- Real-time events may be processed through transient streaming or cache
  infrastructure.
- Permanently retain published score events and the data required to reproduce
  them.
- Raw tick or second-level data may use a bounded retention window followed by
  aggregation or deletion, subject to provider licensing and an approved need.

## Storage Responsibilities

- Object storage holds immutable source files, accepted run bundles, and
  compressed historical datasets.
- The operational database holds indexed current and historical snapshots,
  factor contributions, and outcome measurements for fast product queries.
- Cache and CDN layers serve precomputed current views and common trends.
- User-facing requests must not scan the raw archive.

## Rationale

This policy preserves reproducibility, historical integrity, and outcome
measurement without imposing premature tick-data cost and complexity. It also
keeps website performance independent from the size of the historical archive.

## Consequences

- The data model must prevent silent comparison of observations from different
  snapshot types or market-session cutoffs.
- Historical adjustments must not erase the exact price and policy used by an
  earlier published run.
- Real-time retention requirements must be approved before acquiring or
  storing high-frequency data.
- Market-data contracts must be reviewed for storage, derived-data, display,
  and redistribution rights before provider integration.

## Related Documents

- [ADR-003 — Market Data Evolution Strategy](ADR-003-Market-Data-Evolution.md)
- [Market Data Strategy](../../engineering/Market-Data-Strategy.md)
- [Evidence Snapshot Data Contract](../../Evidence-Snapshot-Data-Contract.md)
- [Evidence History and Validation](../../Evidence-History-and-Validation.md)
- [MVP Implementation Specification](../../engineering/MVP-Implementation-Spec.md)
- [Workshop #2 Summary](../../workshops/Workshop-02-Summary.md)
- [MVP Implementation Specification](../../engineering/MVP-Implementation-Spec.md)
- [Workshop #2 Summary](../../workshops/Workshop-02-Summary.md)
