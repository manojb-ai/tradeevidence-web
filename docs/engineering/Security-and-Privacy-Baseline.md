# Security and Privacy Baseline

- **Status:** Approved
- **Version:** 1.0
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-08-25
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [MVP-Data-Schema.md](MVP-Data-Schema.md), [MVP-Application-Architecture.md](MVP-Application-Architecture.md), [AI-Workflow-Contract.md](AI-Workflow-Contract.md), [Testing-Strategy.md](Testing-Strategy.md), [../governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md](../governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md)

## Security Principles

TradeEvidence uses deny-by-default access, least privilege, defense in depth,
privacy by default, data minimization, secure failure, and auditable exception
handling. Security is enforced on the server and at persistence boundaries;
hidden UI controls do not grant or deny authority.

## Identity and Data Isolation

- A normal user may access only their own private records.
- Normal staff roles have no cross-user bypass.
- Exceptional staff access is purpose-specific, explicitly authorized,
  least-privileged, time-bounded where practical, revocable, and fully audited.
- Infrastructure access is separately restricted, monitored, and never routine
  product access.
- Authentication uses a dedicated provider and secure, bounded sessions.
  TradeEvidence never stores clear-text passwords.
- Ownership and concealment receive negative database, API, and browser tests.

## Encryption and Secrets

All service and user traffic uses encryption in transit. Production databases,
object storage, replicas, snapshots, backups, retained AI history, and other
sensitive durable stores use encryption at rest. Encryption keys, credentials,
API tokens, and provider secrets are separated by environment and stored in an
approved secrets system.

Passwords, session tokens, API keys, credentials, private request bodies,
unnecessary personal information, full AI conversations, proprietary formulas,
protected prompts, and confidential thresholds must not enter source control,
logs, analytics, error reports, exports, or unrelated AI context.

## Privacy and Retention

Only data needed for approved behavior is collected. AI history is Off by
default; a user may choose 1, 3, or 7 days and may delete retained history.
Conversation content is encrypted, owner-scoped, and not a hidden profile.
Active deletion is prompt; encrypted backup expiry follows documented
retention, and deletion records are reapplied after restoration.

Operational telemetry uses safe identifiers and minimizes content. Retention is
purpose-specific: operational logs and traces generally remain searchable for
30 days, aggregated metrics for at least 90 days, and security or privileged
access audit records for at least one year, subject to approved legal, privacy,
incident, and deletion constraints.

## Application and Provider Controls

Inputs are validated, outputs safely encoded, state-changing requests protected,
and uploads or documents treated as untrusted. Dependencies and deployed
artifacts are scanned. Origins and internal data services are not unnecessarily
public. Providers receive only minimum authorized context and are evaluated for
security, privacy, data use, location, reliability, and exit options.

The AI model is an untrusted processor. It cannot authorize access, reveal
other users, expose credentials or proprietary indicator implementation, or
change deterministic evidence. Approved guardrails, bounded tools, injection
resistance, citation/output validation, rate limits, and circuit breakers apply.

## Threat Reviews, Exceptions, and Incidents

Authentication, private-data storage, privileged tools, payments, ingestion,
analytics publication, AI workflows, and other Level 3 work require a recorded
threat or failure review. Critical unresolved vulnerabilities block release.

Security exceptions require founder approval, an owner, reason, compensating
controls, review date, and expiration. Suspected cross-user disclosure,
credential compromise, destructive loss, or proprietary disclosure is a SEV-1
incident and triggers immediate containment and restricted investigation.
