# Observability and Operations

- **Status:** Approved
- **Version:** 1.0
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-08-25
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [MVP-Application-Architecture.md](MVP-Application-Architecture.md), [Security-and-Privacy-Baseline.md](Security-and-Privacy-Baseline.md), [Deployment-Architecture.md](Deployment-Architecture.md), [Definition-of-Done.md](Definition-of-Done.md), [../governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md](../governance/decisions/ADR-010-Delivery-Readiness-and-Controlled-Beta.md)

## Signals

TradeEvidence collects privacy-safe metrics, structured logs, distributed
traces, audit/security events, synthetic journey checks, and business-health
signals. Coverage includes route and use-case outcomes, latency, saturation,
database/cache/queue health, dependencies, rate limiting, costs, release and
ruleset versions, evidence freshness and completeness, analytics publication,
AI grounding failures, and controlled-beta activation.

Every request receives a support-safe correlation ID. Liveness indicates that a
process runs; readiness indicates that it may safely receive traffic. Telemetry
must distinguish application failure, dependency failure, stale or missing
market data, user error, rate limiting, and intentional degradation.

Secrets, tokens, private bodies, unnecessary personal information, full AI
conversations, and proprietary logic are not logged by default. Telemetry access
is role restricted and audited where appropriate.

## Controlled-Beta Objectives

These are internal validation objectives, not customer guarantees:

- Core deterministic availability: at least 99.5% per calendar month.
- Cached homepage API: p95 below 200 ms under approved beta load.
- Uncached Decision Workspace API: p95 below 500 ms.
- Homepage LCP: p75 below 2.5 seconds.
- Published evidence: explicit observation date and no incomplete run presented
  as current.
- Publication: complete previous or complete new run, never a mixture.
- Cross-user disclosure: zero tolerated.
- Recovery validation: RPO no greater than 15 minutes and essential-service RTO
  no greater than four hours.

Ask TradeEvidence and optional providers use separate objectives and may degrade
without taking deterministic evidence offline. Each objective has an indicator
and error budget. Persistent budget exhaustion prioritizes reliability work.

## Alerts and Incidents

Operational alerts differ from future user-facing market alerts. Each alert has
an owner, severity, actionable trigger, safe diagnostic context, response guide,
and escalation path. Related signals are grouped to prevent alert storms.

- **SEV-1:** cross-user disclosure, credential compromise, destructive loss,
  corrupted publication, broad outage, proprietary disclosure, or materially
  unsafe AI behavior. Contain immediately and notify the founder.
- **SEV-2:** significant degradation, failed publication, sustained sign-in
  failure, important provider failure, recovery-target risk, or uncontrolled
  cost. Respond promptly and consider rollback or degradation.
- **SEV-3:** limited defect, elevated latency, or nonessential feature failure.
- **SEV-4:** informational trend or anomaly.

Response protects users and evidence first, preserves necessary audit material,
restricts and audits production access, and uses factual human-approved
communications. SEV-1 and material SEV-2 events receive blameless reviews with
timeline, impact, causes, detection, response, recovery, and tracked actions.

Before beta, exercises cover restore, bad-deployment rollback, failed analytics
publication, compromised credentials, AI outage, and suspected cross-user
access. Monitoring is continuous; human response is founder-led and best effort
until TradeEvidence truthfully establishes staffed 24/7 operations.
