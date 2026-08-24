# API Contracts v1

**Status:** Approved
**Version:** 1.0
**Owner:** Founder and Chief Software Architect
**Approved:** 2026-08-02
**AI-DLC Level:** Level 3 - Controlled

## Purpose

This specification defines the provider-independent HTTP API contract for the first TradeEvidence vertical slice. It governs resource naming, versioning, authentication and authorization boundaries, published-run consistency, Homepage, Decision Workspace, Evidence, watchlists, grounded Ask TradeEvidence, historical trends, errors, retries, performance, security, and acceptance testing.

It does not select an authentication provider, backend framework, cache, database host, AI provider, or deployment platform.

## API Scope and Style

Phase 1 exposes an internal product API for the authenticated TradeEvidence frontend. It is not a public partner API.

- Base path: `/api/v1`
- Transport: HTTPS in deployed environments
- Representation: JSON
- URLs: lowercase plural resource nouns; hyphens only when needed
- JSON fields: lower camel case
- IDs: opaque strings; clients do not parse meaning from them
- Enums: stable lowercase snake-case values
- Instants: RFC 3339 with `Z` or explicit offset
- Trading dates: `YYYY-MM-DD`
- Scores and percentages: JSON numbers
- Currency and precision-sensitive monetary values: decimal strings plus currency

API representations are independent from database tables, analytical-engine files, authentication vendors, market-data providers, AI providers, and object-storage vendors.

## Version Policy

`v1` represents the long-lived MVP contract, not a product release number.

Compatible additive changes may remain within v1. Existing fields cannot silently change meaning, type, unit, required status, null behavior, ordering, or authorization semantics. Breaking changes require `/api/v2` and human approval.

Only one major version should normally be active. Temporary overlap requires an owner, migration plan, security support, and retirement date. Versions share application services; the backend is not copied wholesale.

API, engine, ruleset, database, payload, outcome, and AI workflow versions remain independent.

## Successful Response Envelope

```json
{
  "data": {},
  "meta": {
    "apiVersion": "v1",
    "requestId": "req_..."
  }
}
```

Analytical responses also include applicable run and freshness identity:

```json
{
  "analysisRunId": "run_...",
  "marketDataAsOf": "2026-08-01T20:00:00Z",
  "marketDate": "2026-08-01",
  "exchangeTimezone": "America/New_York",
  "publishedAt": "2026-08-01T21:14:08Z",
  "snapshotType": "eod",
  "tradingSession": "regular",
  "barInterval": "1d",
  "observationPoint": "official_close",
  "freshness": {
    "state": "current",
    "reason": null
  }
}
```

## Missing and Unavailable Values

Contracts distinguish:

- A field not included in this representation
- A genuine `null`
- `unavailable`
- `not_evaluated`
- `stale`
- `incomplete`

Missing analytical data is never silently interpreted as neutral, negative, or zero.

Example:

```json
{
  "earningsProximity": {
    "status": "not_evaluated",
    "value": null
  }
}
```

## Authentication and Authorization

The API resolves an external authenticated identity to the stable internal TradeEvidence user. Email and client-supplied user IDs are not ownership authority.

Private requests require:

1. Valid authentication
2. Active internal account
3. Permission for the operation
4. Ownership of the private resource
5. Approved privileged scope when applicable

Normal product endpoints never accept `userId` to select an owner. A nonexistent private resource and a resource owned by another user both return `404 Not Found` to avoid disclosure.

Normal staff roles receive no ownership bypass. Exceptional access uses a separate, strongly authenticated, least-privileged, purpose-specific, time-bounded where practical, explicitly authorized, and audited administrative boundary. Administrative endpoints are deferred.

State-changing endpoints apply CSRF, origin, secure-session, replay, request-size, and rate-limit protections appropriate to the authentication mechanism selected later.

## Published-Run Consistency

Analytical endpoints resolve either:

- The current run through the authoritative publication pointer; or
- An explicit published or superseded `analysisRunId`.

Staged, rejected, redundant, and unapproved runs are not exposed to normal product APIs.

Every composite response contains only records belonging to the selected run. Missing required same-run data causes safe failure; the API never fills gaps from another run.

### Journey Pinning

The Homepage returns its `analysisRunId`. Workspace and Evidence requests carry that ID so the user reviews the same published evidence. If a newer run appears, the current review remains pinned and may advertise that newer evidence exists.

### Freshness

The server owns freshness classification. Valid stale data returns `200 OK` with explicit stale metadata. Clients do not calculate freshness independently.

### Conditional Requests

Analytical GET responses support validators such as `ETag` based on stable run and representation identity. Cache implementation remains a Workshop 5 decision.

## Endpoint Catalog

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/v1/homepage` | Current or explicitly pinned briefing and opportunities |
| `GET` | `/api/v1/instruments/{instrumentId}/workspace` | Compact same-run Decision Workspace |
| `GET` | `/api/v1/instruments/{instrumentId}/evidence` | Detailed Technical Evidence calculation |
| `GET` | `/api/v1/instruments/{instrumentId}/history` | Compact like-for-like analytical history |
| `GET` | `/api/v1/watchlists` | Owner-scoped watchlist summaries |
| `POST` | `/api/v1/watchlists` | Create a private watchlist |
| `GET` | `/api/v1/watchlists/{watchlistId}` | Retrieve one private watchlist |
| `PATCH` | `/api/v1/watchlists/{watchlistId}` | Update mutable watchlist fields |
| `DELETE` | `/api/v1/watchlists/{watchlistId}` | Delete a watchlist preference |
| `PUT` | `/api/v1/watchlists/{watchlistId}/items/{instrumentId}` | Idempotently add membership |
| `PATCH` | `/api/v1/watchlists/{watchlistId}/items/{instrumentId}` | Update mutable item note |
| `DELETE` | `/api/v1/watchlists/{watchlistId}/items/{instrumentId}` | Remove membership |
| `POST` | `/api/v1/ask-tradeevidence` | Grounded educational AI explanation |

## Homepage Contract

### Request

```http
GET /api/v1/homepage?analysisRunId=run_...
```

`analysisRunId` is optional. Without it, the endpoint resolves the current production EOD run.

### Response Data

The compact universal response contains:

- `briefing`: regime, risk environment, deterministic headline and summary, supporting, contradicting, and unavailable factors
- `benchmarks`: SPY, QQQ, IWM, and approved context summaries required by the briefing
- `opportunities`: persisted rank, instrument and snapshot IDs, publication-time symbol/name, sector alignment, Technical Evidence summary, Decision Confidence summary, principal support, principal constraint, why it appeared, and Workspace link
- `opportunitySummary`: eligible/displayed/maximum counts and valid empty-state reason

The endpoint returns persisted publication-time ranking and explanation. It does not recalculate, personalize, fill empty positions, or hide material constraints.

No qualifying opportunities returns `200 OK` with an empty collection and `no_instruments_met_current_evidence_criteria`. It is not a forecast or failure.

The response excludes full factors, history, strategy tables, option chains, diagnostic JSON, archives, and staff validation details. Target serialized data size is approximately 200 KB or less.

## Decision Workspace Contract

### Request

```http
GET /api/v1/instruments/{instrumentId}/workspace?analysisRunId=run_...
```

### Response Data

The compact same-run response contains:

- Stable instrument identity, publication-time symbol, current symbol, exchange, canonical price, and currency
- Workspace headline, why it deserves review, why it surfaced, and optional like-for-like prior-run change summary
- Market context and sector context with same-run snapshot IDs
- Technical Evidence summary and link to details
- Deterministic Devil's Advocate contradictions, timing concerns, contextual risks, missing information, and alternative interpretations
- Categorical Decision Confidence with supporting, constraining, and unavailable reasons and `notProbability: true`
- Deterministic thesis-invalidation conditions already present in the snapshot
- Compact Educational Strategy Alignment with `notSuitabilityAssessment: true`
- Versioned nonpersistent Before You Decide checklist
- Ask TradeEvidence supported intents and endpoint link

The endpoint performs no scoring or AI generation. A directly requested incomplete symbol returns `200 OK` with incomplete evidence, named missing inputs, Incomplete Decision Confidence, and no fabricated classification.

## Detailed Evidence Contract

### Request

```http
GET /api/v1/instruments/{instrumentId}/evidence?analysisRunId=run_...
```

### Response Data

- Technical Evidence snapshot identity, score, band, status, coverage, summary, and engine/rules/template versions
- Ordered factor groups
- Factor result ID, code, definition version, label, evaluation status, observed state/value/unit, effect, contribution, maximum contribution, explanation code/template/rendered text, and display order
- Calculation method, supporting/contradicting/neutral totals, normalization, caps/floors, missing-data treatment, rounding, published score, and reconciliation status
- Material contradiction summary
- Required/evaluated/missing factor coverage

Evaluation status is `evaluated`, `unavailable`, or `not_evaluated`. Evaluated effect is `supporting`, `contradicting`, or `neutral`. Unavailable factors use null observed state/effect/contribution rather than zero.

Incomplete evidence returns null user-facing score and band plus named missing required factors. Internal diagnostic scores are not exposed as complete scores. Reconciliation failure causes an integrity error and operational event.

This endpoint contains symbol-level Technical Evidence only. It does not mix market/sector context, entry location, Decision Confidence, portfolio context, personal risk tolerance, strategy education, or AI interpretation.

## Watchlist Contract

### Create

```http
POST /api/v1/watchlists
Idempotency-Key: <opaque-key>
```

Body: `name` and optional `description`. Owner is derived from authentication. Same key plus equivalent body returns the original result; same key with different content returns `409`.

### Membership

```http
PUT /api/v1/watchlists/{watchlistId}/items/{instrumentId}
```

Body may include immutable `sourceSymbolSnapshotId` provenance and mutable `note`. PUT is idempotent and does not overwrite an existing note on retry; note changes use PATCH.

The source snapshot must be published/superseded and belong to the instrument. Current evidence is a separate same-current-run overlay. If the instrument is absent from the current run, the overlay reports `not_available` rather than modifying provenance.

### Retrieval

`GET /watchlists` returns compact owner-scoped summaries. `GET /watchlists/{id}?include=currentEvidence` may return items with same-run current summaries to avoid per-item requests.

### Concurrency

PATCH and other lost-update-sensitive mutations use `If-Match` with ETag/revision. Stale revision returns `412 revision_conflict`.

### Deletion

Deleting an item or watchlist changes only mutable user preferences. It never deletes instruments or analytical history. Non-owned resources return 404. Private responses never enter shared public caches.

## Ask TradeEvidence Contract

### Request

```http
POST /api/v1/ask-tradeevidence
Idempotency-Key: <opaque-key>
```

```json
{
  "instrumentId": "inst_...",
  "analysisRunId": "run_...",
  "intent": "challenge_thesis",
  "question": "What is the strongest contrary interpretation?",
  "sessionId": "session_..."
}
```

Supported intents:

```text
explain_evidence
explain_score_contribution
challenge_thesis
explain_decision_confidence
compare_supporting_and_contradicting_evidence
explain_market_alignment
explain_sector_alignment
explain_invalidation_conditions
compare_strategy_education
explain_terminology
identify_missing_information
```

The server assembles bounded same-run context. The client does not submit authoritative scores, factors, confidence, context, or hidden instructions. The AI receives no unrestricted database or service access.

### Response

Structured output contains:

- `responseDisposition`: `answered`, `redirected`, `insufficient_context`, or safe refusal state
- Direct educational answer
- Traceable deterministic `evidenceUsed`
- Important counterpoint
- Missing or unevaluated information
- Educational boundary when relevant
- Suggested approved next questions
- Run, snapshot, workflow, prompt, response, and guardrail identity

Advisory requests are productively redirected without buy/sell/hold/entry/exit/target/stop/position-size/suitability instructions. Missing information is not supplemented from memory or live internet data. Strategy comparisons remain general education without contract selection.

Phase 1 sessions are temporary, do not include portfolio/journal/financial-profile context, and expire under an approved short-lived policy. Exact ephemeral storage and AI latency are deferred to Workshop 7. Idempotency prevents duplicate calls and cost within the supported retry window.

AI service failure affects only this endpoint; deterministic product endpoints remain available. The MVP guarantees a normal JSON response. Streaming is optional later only if it preserves the same final structured response and guardrails.

## Historical Trends Contract

### Request

```http
GET /api/v1/instruments/{instrumentId}/history?fromMarketDate=2026-01-01&toMarketDate=2026-08-01&limit=60&order=desc&cursor=<opaque>
```

### Response

Returns stable instrument context, one explicit comparison basis, compact points, coverage, and cursor metadata.

Each point includes market date/as-of, run and snapshot IDs, publication-time symbol, canonical price, Technical Evidence score/band/status/coverage, Decision Confidence, and publication revision lineage when applicable.

Phase 1 comparison is `eod + regular + 1d + official_close` under a compatible adjustment policy. Unlike bases are never mixed silently.

Default history returns one current valid publication revision per market date. Earlier corrected publications remain retrievable by explicit run ID. Incomplete points retain null score/band and explicit status. Missing dates are never zero-filled.

Pagination uses opaque cursors bound to resource, filters, sort, and ownership where applicable. Provisional default is 50 and maximum is 100. Stable history ordering uses market as-of plus snapshot ID. Unknown filters and unsupported sort fields fail visibly.

Outcome measurements are not exposed until an outcome methodology, presentation contract, and non-predictive language satisfy the Workshop 6 validation gates and receive explicit human approval.

## Error Contract

```json
{
  "error": {
    "code": "validation_failed",
    "message": "One or more request values are invalid.",
    "category": "client_error",
    "retryable": false,
    "details": [
      {
        "field": "name",
        "code": "required",
        "message": "Name is required."
      }
    ]
  },
  "meta": {
    "apiVersion": "v1",
    "requestId": "req_..."
  }
}
```

| Status | Contract use |
|---:|---|
| `400` | Malformed JSON/query or unusable cursor |
| `401` | Missing/invalid authentication |
| `403` | General capability denial or disabled account |
| `404` | Absent, inaccessible, or ownership-concealed resource |
| `409` | Operation or idempotency conflict |
| `412` | ETag/revision precondition failed |
| `413` | Request too large |
| `422` | Semantic/domain validation failure |
| `429` | Rate limit exceeded |
| `500` | Unexpected internal failure |
| `503` | Required dependency or published data unavailable |
| `504` | Approved upstream operation timed out |

Stable codes include `malformed_request`, `validation_failed`, `authentication_required`, `authentication_invalid`, `account_disabled`, `resource_not_found`, `revision_conflict`, `idempotency_key_conflict`, `payload_too_large`, `unsupported_intent`, `rate_limit_exceeded`, `published_data_unavailable`, `analytical_integrity_failure`, `ai_service_unavailable`, `dependency_timeout`, and `internal_error`.

Responses never expose SQL, constraint names, stack traces, internal paths/services, credentials, tokens, provider secrets, or another user's identity.

## Retries, Idempotency, and Degraded States

- GET may retry transient 503/504 with bounded exponential backoff and jitter.
- PUT may retry with identical request identity/body.
- POST retries require the same idempotency key and equivalent body.
- PATCH retries require documented idempotency and the same ETag/revision.
- Clients do not retry 400-422 without changing the request.
- 429 and retryable 503 honor `Retry-After` when provided.

Idempotency keys are scoped to authenticated user, endpoint, and operation. Stored records use fingerprints and response identity rather than unnecessary sensitive request content.

Valid stale run, incomplete evidence, optional unavailable data, and zero qualifying opportunities return labeled `200` responses. Missing required same-run data returns 503. The first MVP avoids ambiguous partial-success mutations.

## Performance and Cache Requirements

Initial p95 targets to validate:

- Cached Homepage: below 200 ms
- Frequently accessed cached Workspace: below 200 ms
- Uncached Workspace: below 500 ms
- Detailed Evidence: below 500 ms for normal factor counts
- Watchlist summary: below 500 ms within MVP limits
- Historical first page: below 500 ms
- Watchlist mutation excluding network retry: below 500 ms
- Ask TradeEvidence: deferred to Workshop 7

Universal analytical representations may cache by endpoint, run ID, and representation version. Private responses never enter shared public caches and must include ownership in any private cache scope. Publication refreshes current aliases after the database transaction; run-specific historical responses remain immutable.

## Security Requirements

- Authentication and deny-by-default authorization at trusted server boundaries
- Ownership enforcement for every private operation
- Cross-user concealment and negative tests
- Input/schema/content-type/request-size validation
- Safe output encoding
- Rate limits by analytical read, intensive read, mutation, authentication, AI, and privileged category
- CSRF/origin/session protections appropriate to the selected mechanism
- No arbitrary database filters, sorts, analytical context, or AI tool access
- Scoped and audited privileged access
- No reliance on hidden frontend controls for authorization

## Contract and Integration Tests

Every endpoint requires positive and negative schema, authentication, authorization, ownership, validation, unavailable/null, stale/incomplete, integrity, idempotency, concurrency, rate-limit, dependency-failure, and compatibility tests as applicable.

Critical scenarios prove:

1. Homepage, Workspace, and Evidence remain pinned to one run.
2. Publication during review does not silently switch evidence.
3. Mixed-run data fails safely.
4. Empty opportunities are valid.
5. Incomplete evidence exposes no complete score.
6. Contributions reconcile and contradictions remain visible.
7. Watchlist provenance does not change with current evidence.
8. Cross-user and normal-staff bypass attempts fail.
9. Retries do not duplicate resources or AI calls.
10. History remains like-for-like and revision-aware.
11. AI failure leaves deterministic endpoints available.
12. Errors reveal no internal or private details.

CI compares changes against the approved v1 baseline. Removing/renaming fields, changing required/null/type/unit/enum/order/authorization semantics, or moving universal data into personalized behavior requires compatibility review. New enum values also require client review.

## Observability

Safe structured telemetry covers request rate, status/error code, latency, payload size, cache result, rate-limit result, dependency failure, run/snapshot identity, authorization-denial category, and AI workflow/guardrail state as applicable.

Telemetry excludes credentials, tokens, unrestricted user questions, and private research notes by default.

## Deferred APIs

No v1 endpoints are defined yet for:

- Portfolio, holdings, or trades
- Journal entries or Decision Snapshots
- Persistent AI conversations
- Brokerage integration
- Alerts
- Public partner API
- Staff administration

Portfolio was named in the original workshop plan but remains deferred because Workshop 3 approved no physical portfolio entities for this slice.

## Acceptance Criteria

Workshop 4 implementation is accepted only when:

1. Human and machine-readable contracts agree.
2. Sanitized examples validate against the machine-readable schema.
3. Authorization, ownership, integrity, idempotency, errors, and degraded states have positive and negative coverage.
4. Representative performance targets are measured.
5. Cache and telemetry behavior cannot leak private data.
6. API compatibility checks run in CI.
7. Deferred modules remain outside implementation.

## Related Documents

- [MVP Implementation Specification](MVP-Implementation-Spec.md)
- [MVP Data Schema](MVP-Data-Schema.md)
- [OpenAPI v1 Contract](openapi-v1.json)
- [ADR-005](../governance/decisions/ADR-005-MVP-Persistence-and-Data-Integrity.md)
- [ADR-006](../governance/decisions/ADR-006-Internal-API-Contract-and-Evolution.md)
- [Workshop #4 Summary](../workshops/Workshop-04-Summary.md)
