# ADR-006 - Internal API Contract and Evolution

## Status

Accepted

## Date

2026-08-02

## Context

The first TradeEvidence vertical slice needs stable contracts between the authenticated frontend and application services. The API must preserve analytical run integrity, evidence explainability, user isolation, safe AI boundaries, compatibility, and provider independence without exposing database tables or analytical files directly.

## Decision

TradeEvidence Phase 1 uses an internal resource-oriented HTTPS JSON API under `/api/v1`.

`v1` is a long-lived major compatibility boundary, not a release number. Compatible additive changes remain in v1. Breaking structural or semantic changes require human approval and a new major API version. Only one major version should normally remain active; temporary overlap requires ownership and a retirement plan.

API representations use camel-case JSON, opaque identifiers, stable lowercase snake-case enums, explicit time and decimal semantics, consistent success/error envelopes, and explicit unavailable/incomplete states. They remain independent from database tables and external providers.

Analytical responses resolve through the publication pointer or an explicit published/superseded run. Composite responses are pinned to one run and fail safely on required mixed or missing data. Valid stale and incomplete states remain available with clear labels.

Private operations derive owner identity from verified authentication and enforce deny-by-default ownership. Cross-user resources are concealed as not found. Normal staff roles receive no bypass; exceptional access uses a separate selective and audited boundary.

Ask TradeEvidence accepts only bounded question, intent, instrument, and run identity. The server assembles grounded context, and structured output cites deterministic evidence, preserves counterpoints and missing information, and cannot create evidence or advise the user.

Machine-readable and human-readable contracts must agree. Contract, authorization, integrity, idempotency, compatibility, error, degraded-state, performance, and privacy tests are required before implementation acceptance.

## Consequences

- Database schema and provider changes do not automatically change the API contract.
- The frontend cannot submit authoritative analytical values or arbitrary owner identity.
- API version proliferation and copied backend implementations are prohibited.
- Universal analytical responses and private user responses require different cache boundaries.
- Portfolio, journal, alerts, persistent AI, brokerage, public API, and staff administration remain deferred.
- Workshop 5 must define implementation boundaries without changing approved API semantics.

## Related Documents

- [API Contracts v1](../../engineering/API-Contracts-v1.md)
- [OpenAPI v1](../../engineering/openapi-v1.json)
- [MVP Data Schema](../../engineering/MVP-Data-Schema.md)
- [MVP Implementation Specification](../../engineering/MVP-Implementation-Spec.md)
- [Workshop #4 Summary](../../workshops/Workshop-04-Summary.md)
