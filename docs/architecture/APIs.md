# APIs

## Authority Notice

The authoritative MVP HTTP API semantics are defined in [../engineering/API-Contracts-v1.md](../engineering/API-Contracts-v1.md) and the machine-readable [../engineering/openapi-v1.json](../engineering/openapi-v1.json). This document remains a high-level architectural overview.

## Purpose
APIs will connect the application to services such as market data, scoring logic, AI assistance, and internal workflows.

## Users
- frontend application surfaces
- future backend services
- AI-assisted features

## Features
- data retrieval
- service orchestration
- analysis and report generation
- integration points for future modules

## Future ideas
- public API surface for partner integrations
- internal service composition layer
- rate-limit and caching strategies

## Dependencies
- backend architecture decisions
- data source strategy
- AI service decisions

## Open Questions
- Phase 1 APIs are internal product APIs. Public partner APIs remain deferred.
- Phase 1 uses a long-lived `/api/v1` major compatibility boundary.

## Related Documents
- [../03-Architecture.md](../03-Architecture.md)
- [../09-Data-Model.md](../09-Data-Model.md)
- [../README.md](../README.md)
