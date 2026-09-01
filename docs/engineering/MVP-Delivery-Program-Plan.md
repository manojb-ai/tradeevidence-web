# MVP Delivery Program Plan

- **Status:** Proposed for Founder Review
- **Version:** 0.1
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-09-01
- **AI-DLC Level:** Level 3 - Controlled
- **Scope:** 100% of approved TradeEvidence MVP v1 through public launch
- **Related Documents:** [../MVP-v1.md](../MVP-v1.md), [MVP-Implementation-Spec.md](MVP-Implementation-Spec.md), [Definition-of-Done.md](Definition-of-Done.md), [Deployment-Architecture.md](Deployment-Architecture.md), [Security-and-Privacy-Baseline.md](Security-and-Privacy-Baseline.md)

## 1. Objective

Deliver 100% of the approved MVP as one coherent product, beginning with local
real-data operation, progressing through persistent staging and founder alpha,
opening to invited family and friends in a protected production controlled
beta, and finally becoming publicly available after measured acceptance.

This is a delivery plan, not a replacement for the approved product,
architecture, schema, API, evidence, AI, security, or operational contracts.
Where those sources conflict, the conflict is a founder decision gate.

## 2. Planning Model

```text
Program: TradeEvidence MVP v1
  Epic: major user or platform outcome
    Capability: independently demonstrable ability
      Feature: releasable product behavior
        User story: user-observable value and acceptance criteria
          Task: implementation, test, documentation, or operational work
```

Work is delivered in vertical slices. A slice connects UI, application use
case, domain policy, API, persistence, security, telemetry, tests, and
documentation where applicable. Epics express the complete scope; milestones
control the sequence.

## 3. Scope Closure Required

### Confirmed MVP scope

- Authenticated Homepage and Today's Briefing
- Real CSV-sourced, versioned analytics publications
- Evidence-Aligned Opportunities and Decision Workspace
- Evidence Score and separate Decision Confidence
- Market, sector, multi-timeframe, contradiction, and invalidation context
- Private watchlists
- Profile and privacy preferences
- Ask TradeEvidence within its approved grounded, non-advisory boundary
- Decision Summary export or print
- Supported desktop and mobile web browsers
- Operational, security, recovery, and controlled-release capabilities

### Founder decision D-01: basic portfolio conflict

`MVP-v1.md` includes “Portfolio (basic).” Later Workshop 3, data-schema, and API
contracts intentionally contain no portfolio entities and state that portfolio
is deferred. Before backlog estimation is baselined, the founder must approve
one outcome:

1. **Recommended:** defer portfolio from MVP v1 and correct `MVP-v1.md`; or
2. reopen the schema, API, security, UX, and AI contracts to define a basic
   portfolio capability and add its delivery estimate.

### Explicitly deferred unless D-01 changes

- persistent Decision Journal;
- community and social sharing;
- brokerage integration or transaction execution;
- native mobile application;
- user-configurable dashboards;
- unrestricted AI web browsing or long-term AI memory;
- automated live market-data acquisition; and
- payments and paid plans for the controlled beta.

## 4. Release Milestones

| Milestone | Audience | Exit outcome |
|---|---|---|
| M0 — Local real-data product | Founder on local machine | Latest accepted engine run powers Homepage and Workspace without fixture data |
| M1 — Persistent staging | Founder/development | Production-like environment, database, identity, publication, telemetry, and core journey work end to end |
| M2 — Founder alpha | Founder | 100% deterministic MVP features accepted; Ask TradeEvidence behind a flag |
| M3 — Controlled beta | Invited family and friends | Protected production, invitation-only access, recovery, isolation, operations, feedback, and bounded AI |
| M4 — Public MVP | Public registrants | Public sign-up or approved access policy, production support, legal approval, scale evidence, and founder release approval |

Merging, deploying, enabling, and releasing remain separate actions. Every
production release requires explicit founder approval.

## 5. Epic Backlog

### Epic E0 — Product and vendor closure

**Outcome:** the team can implement without unresolved scope or subscription
ambiguity.

Capabilities and features:

- Resolve D-01 portfolio scope and synchronize source-of-truth documents.
- Confirm launch geography, target beta size, public-access model, and support
  expectations.
- Approve provider evaluation criteria: security, privacy, encryption, U.S.
  operation, reliability, cost caps, portability, data export, and exit plan.
- Select hosting, database, identity, storage, background-work, email,
  observability, AI, DNS/edge, and market-data approaches.
- Approve privacy notice, terms, educational/non-advisory disclosures, cookie
  behavior, market-data display rights, and incident contacts before beta.
- Establish provider owners, billing alerts, budgets, credential ownership,
  MFA, recovery contacts, and account-export procedures.

Exit gate: signed vendor decision record, cost envelope, scope baseline, and
resolved D-01.

### Epic E1 — Delivery foundation and environments

**Outcome:** every change can move safely from local development to production.

Capabilities and features:

- Complete protected GitHub pull-request workflow and required CI checks.
- Define a validated environment-variable schema with strict public/server
  separation and no secrets in source control.
- Create isolated local, preview/test, staging, and production configurations.
- Establish Vercel preview, persistent staging, and production projects with
  canonical domain and safe redirect behavior.
- Add release identity, correlation identifiers, structured logs, liveness,
  readiness, and dependency health.
- Add server-controlled feature flags and kill switches for publication, AI,
  exports, providers, and incomplete features.
- Add dependency, secret, and deployed-artifact scanning.
- Document promotion, rollback, and founder release approval runbooks.

Exit gate: one immutable artifact passes CI, deploys to staging, reports its
release identity, and can be rolled back without production data.

### Epic E2 — PostgreSQL data platform and persistence

**Outcome:** approved analytical and user records have durable, isolated,
recoverable authority.

Capabilities and features:

- Select migration and database access libraries compatible with the approved
  clean architecture.
- Implement the approved PostgreSQL schema through ordered migrations.
- Create separate test/staging/production databases and least-privileged roles
  for application, migration, ingestion, and operations.
- Implement repositories and transactional units of work without leaking raw
  rows to product UI or APIs.
- Enforce UUID identities, ownership, constraints, immutable publication data,
  indexes, and retention jobs.
- Configure encrypted backups and point-in-time recovery.
- Prove restore into an isolated environment and verify ownership, publication
  lineage, and application behavior.
- Add database integration and negative isolation tests.

Exit gate: a clean database can be created from zero, seeded with sanitized
data, backed up, restored, and queried only through approved boundaries.

### Epic E3 — Identity, sessions, and user isolation

**Outcome:** a user can securely access TradeEvidence and only their records.

Capabilities and features:

- Implement a provider-independent identity adapter using immutable issuer and
  subject identifiers rather than email as identity.
- Build registration/invitation, sign-in, sign-out, verification, account
  recovery, session expiration, device/session revocation, and account-disabled
  behavior.
- Use secure, HTTP-only, narrowly scoped cookies with CSRF and origin controls.
- Create internal users and provider-identity mappings through idempotent,
  signed synchronization.
- Add server authorization policies and owner-scoped repository queries.
- Conceal non-owned resources as not found.
- Implement invitation-only beta access and a public-launch access policy.
- Add authentication events, anomaly signals, brute-force/bot protections, and
  comprehensive cross-user negative tests.
- Keep exceptional staff access outside normal product routes; implement only
  the minimum selective, strongly authenticated, reason-bound, time-bounded,
  immutable-audit workflow needed for beta support.

Exit gate: account and recovery journeys pass, and database/API/browser tests
prove that one user cannot access another user's private data.

### Epic E4 — Analytics ingestion and controlled publication

**Outcome:** the website consumes real, validated, immutable analytics runs.

Capabilities and features:

- Define a versioned engine-output bundle and JSON schemas for manifest,
  source lineage, symbol evidence, market/sector context, selection, and
  validation results.
- Build the Thinkorswim CSV adapter and preserve source/checksum lineage.
- Extend the current engine output only where approved MVP contracts require
  data not yet produced; never invent missing values in the web application.
- Implement file-backed local ingestion for M0.
- Implement encrypted immutable artifact storage and staged database import for
  deployed environments.
- Validate checksums, versions, timestamps, universe reconciliation, duplicate
  symbols, score/factor agreement, completeness, language, and opportunity
  eligibility.
- Implement Generated → Staged → Validated → Human Approved → Published →
  Superseded or Rejected lifecycle.
- Publish through one atomic current-run pointer and preserve the previous
  approved run on failure.
- Build founder approval/rejection controls, publication audit, rollback, and
  cache invalidation.
- Add deterministic fixtures and contract/integration tests for bullish,
  bearish, watch, neutral, incomplete, stale, and invalid bundles.

Exit gate: the latest real engine run can be approved and published without
editing or mixing history, and a bad run cannot alter the current product.

### Epic E5 — Homepage and evidence discovery

**Outcome:** users can quickly understand data status and find a small set of
qualified opportunities.

Capabilities and features:

- Implement the authenticated Homepage and Today's Briefing from the current
  published run.
- Display market date, freshness, coverage, run/version lineage, stale,
  incomplete, unavailable, and honest zero-opportunity states.
- Render no more than five persisted deterministic opportunities.
- Show direction, timeframe, Evidence Score summary, Decision Confidence
  summary, principal support, principal constraint, and why each appeared.
- Support bullish, bearish, watch, and approved neutral behavior without
  creating noisy neutral/unaligned opportunity categories.
- Add safe search/symbol resolution and Workspace links pinned to the selected
  analysis run.
- Meet responsive, accessibility, browser, caching, and performance targets.

Exit gate: Homepage data always comes from one published run and never
recalculates, personalizes, or hides material constraints.

### Epic E6 — Decision Workspace and Evidence

**Outcome:** users can inspect enough evidence and contradiction to prepare
their own decision.

Capabilities and features:

- Implement stable instrument resolution and same-run Workspace/Evidence
  orchestration.
- Display publication-time identity and price anchor, direction, setup state,
  freshness, completeness, engine/ruleset identity, and data status.
- Present daily, weekly, and monthly trend/momentum evidence with progressive
  beginner/guided/technical disclosure.
- Display Evidence Score, coverage, factors, contribution explanations, and
  unavailable/not-evaluated states.
- Keep Decision Confidence categorical and visibly separate from Evidence
  Score; explain its deterministic reasons without implying probability.
- Add market and sector context without silently modifying the symbol score.
- Add Devil's Advocate, contradictions, assumptions, and deterministic
  invalidation/reassessment conditions.
- Add educational strategy-alignment comparisons within the approved boundary.
- Implement Before You Decide and print/export Decision Summary without trade
  instructions.
- Add loading, not-found, stale, incomplete, unavailable, integrity-failure,
  retry, and optional-service-degradation states.

Exit gate: a user can trace every material statement to the current pinned
snapshot while retaining ownership of the decision.

### Epic E7 — Watchlists, profile, and privacy preferences

**Outcome:** users can maintain private research organization and control
privacy behavior.

Capabilities and features:

- Create, list, rename, describe, and delete private watchlists.
- Add, annotate, and remove instruments idempotently while retaining the source
  snapshot that motivated the addition.
- Show current same-run evidence summaries without copying analytical truth into
  mutable user records.
- Enforce ownership, ETags/revision conflict behavior, private caching, bounded
  lists, and authorization-safe errors.
- Add profile settings for presentation depth and AI history: Off by default,
  then 1, 3, or 7 days maximum.
- Implement AI-history deletion/expiry and account deletion workflows,
  including restore-time deletion reapplication.
- Add privacy notice, consent where legally required, data export/request
  intake, and selective support workflow.

Exit gate: two-user adversarial tests prove isolation; expiration and deletion
work across application records and restored backups.

### Epic E8 — Basic portfolio, only if D-01 includes it

**Outcome:** to be defined only after scope reconciliation.

If included, this epic requires a separate approved workshop/contract covering
positions, quantities, cost basis, transactions, pricing/freshness, ownership,
tax-sensitive information, Decision Confidence interaction, AI boundaries,
imports, corrections, deletion, schema, API, tests, and disclosures. No
implementation estimate is valid before those decisions.

### Epic E9 — Ask TradeEvidence

**Outcome:** users receive bounded, grounded educational explanations without
turning the product into an advisor or exposing proprietary logic.

Capabilities and features:

- Implement the provider-neutral AI gateway, model routing, timeouts, one
  bounded retry, circuit breaker, global kill switch, and deterministic
  fallback states.
- Authenticate and authorize before assembling minimal, same-run context.
- Classify requests into approved intents and reject unsupported authority.
- Ground responses in internal snapshots and approved pre-ingested sources;
  controlled beta has no unrestricted web browsing.
- Return structured direct answer, Data Status, evidence, counterpoint,
  citations, disposition, grounding state, and optional follow-up questions.
- Support quick, guided, and technical depth without changing facts.
- Validate output for citations, advisory language, secrets, proprietary
  formulas, cross-user content, prompt injection, and schema conformance.
- Implement per-request, per-user, daily, and global token/cost budgets with
  warnings, no automatic user overages, idempotency, and abuse detection.
- Implement Off/1/3/7-day history and non-content recipe/cost telemetry.
- Build and version the approved evaluation dataset across intents, states,
  attacks, provider failures, latency, and cost.
- Require automated and founder evaluation approval for every production model,
  prompt, guardrail, retrieval, or workflow change.

Exit gate: no critical privacy, proprietary, fabricated-citation, or direct
personalized-trade failure; AI failure never blocks deterministic features.

### Epic E10 — Operations, security, and resilience

**Outcome:** the product can be operated, recovered, and defended during beta
and public use.

Capabilities and features:

- Add safe logs, metrics, traces, dashboards, release markers, synthetic checks,
  and alert routing for application, publication, authentication, database,
  queue, AI, security, and cost behavior.
- Meet telemetry retention: searchable operational records approximately 30
  days, aggregated metrics at least 90 days, and security/privileged audits at
  least one year subject to approved privacy constraints.
- Add managed edge DDoS/WAF controls, endpoint/body/result/time limits, rate
  limits, bot protections, database pooling/timeouts, queue bounds, circuit
  breakers, and load shedding.
- Complete threat reviews for identity, private data, publication, AI,
  privileged access, exports, and any payment behavior.
- Prove encrypted transport and at-rest storage, environment-separated secrets,
  rotation, least privilege, and provider account MFA.
- Rehearse backup restore, application rollback, bad-publication rollback,
  AI rollback/kill switch, provider degradation, cache loss, queue buildup,
  incident declaration, containment, communication, and post-incident review.
- Test expected beta load, bursts, and at least 100 concurrent active-user
  journeys before beta.

Exit gate: no critical security finding, restore and rollback evidence exists,
and actionable alerts reach the responsible human.

### Epic E11 — Controlled family-and-friends beta

**Outcome:** invited users can use the complete approved MVP safely in protected
production.

Capabilities and features:

- Configure canonical `https://www.tradeevidence.com`, HTTPS, non-indexed
  protected routes, environment isolation, and invitation-only registration.
- Publish an approved real analytics run under confirmed display rights.
- Complete supported-browser, mobile-responsive, accessibility, security,
  performance, load, abuse, recovery, and end-to-end tests.
- Prepare onboarding, limitations, educational disclosures, privacy/terms,
  feedback, support, incident, and account-deletion workflows.
- Set beta cohort, invitation waves, AI allowance, provider budgets, alerts,
  feature flags, kill switches, and stop/go thresholds.
- Conduct founder acceptance, release approval, monitored launch, daily review,
  feedback triage, and measured corrections.

Exit gate: the controlled-beta Definition of Done is satisfied and founder
approval is recorded.

### Epic E12 — Public MVP launch

**Outcome:** the approved MVP is available to its intended public audience with
an operable growth and support model.

Capabilities and features:

- Decide public sign-up, waitlist, free allowance, and whether payments remain
  deferred.
- Add public marketing, methodology, pricing/allowance if applicable, support,
  status, privacy, terms, accessibility, and contact surfaces.
- Confirm business identity, tax/contact information, data-processing terms,
  market-data rights, customer commitments, and legal review.
- Review beta usability, retention, incidents, costs, model quality, capacity,
  browser support, SLOs, and unresolved risks.
- Establish public budgets, rate limits, abuse handling, on-call expectations,
  provider escalation, release calendar, vulnerability intake, and customer
  support process.
- Run staged public rollout with monitored cohorts and rollback thresholds.

Exit gate: public-release Definition of Done, accepted residual risks, legal and
vendor readiness, and explicit founder authorization.

## 6. Recommended Provider Baseline

These are proposed selections, not approved commitments. All production
accounts must be company-owned, use MFA, separate environments and credentials,
least privilege, billing alerts, spend caps where available, and documented
recovery/export procedures.

| Capability | Proposed MVP provider | Initial tier | Activation point | Notes |
|---|---|---|---|---|
| Source control/CI | GitHub | Existing | Active | Protected `main`, required validation |
| Web hosting/CDN/WAF | Vercel | Pro | Before persistent staging | Existing deployment path; commercial use, previews, CDN, WAF, spend controls |
| PostgreSQL | Neon | Launch usage-based | E2 | Separate staging/production projects or branches; pooled connections; configure and test restore |
| Identity | Clerk | Pro monthly | E3 | Dedicated auth, invitations, MFA/passkeys, recovery; internal IDs remain provider-neutral |
| Object storage | Vercel Blob | Pro usage-based | E4 | Low operational overhead for immutable bundles/exports; portability through object-storage port |
| Durable background work | Inngest | Hobby, then Pro if measured | E4/E9 | Ingestion, reports, AI and notification jobs; do not upgrade before free limits/reliability need require it |
| Transactional email | Resend | Free, then Pro | E3 | Verification/invitation/recovery/operational mail; authenticate domain with SPF/DKIM/DMARC |
| Error/performance monitoring | Sentry | Developer locally; Team for beta | E1/E10 | Scrub sensitive content; safe release/error/performance telemetry |
| Product/infrastructure telemetry | Vercel + structured app telemetry | Included/usage-based | E1 | Add OpenTelemetry-compatible export when retention or cross-provider analysis requires it |
| AI | OpenAI API behind internal gateway | Usage-based with hard project budget | E9 | Model selection follows evaluation; use low-cost model for simple intents and evaluated escalation only |
| DNS/edge | Existing registrar + Vercel DNS initially | Existing | E1/E11 | Cloudflare becomes an option only if additional edge/DNS controls materially justify another vendor |
| Cache/rate-limit store | None initially; Upstash when measured | Free or pay-as-you-go | E10 or scale trigger | PostgreSQL remains authoritative; add only for multi-instance coordination or measured traffic |
| Market data | Thinkorswim CSV | Existing | E4 | Approved Phase 1 source; confirm display/redistribution rights before external beta |
| Payments | Deferred | None | After beta unless founder expands MVP | Avoid pricing/billing work before usefulness and AI cost are measured |

### Provider decisions that require explicit founder approval

- D-02: Vercel Pro as hosting and primary edge platform.
- D-03: Neon Launch as managed PostgreSQL.
- D-04: Clerk Pro as identity provider.
- D-05: Vercel Blob as immutable object storage.
- D-06: Inngest as the durable background-work provider, initially free.
- D-07: Resend as transactional email provider.
- D-08: Sentry Team for controlled-beta application monitoring.
- D-09: OpenAI API as the first evaluated AI provider with a founder-set monthly
  ceiling and per-user beta allowance.
- D-10: Thinkorswim CSV remains the MVP market-data source, subject to documented
  permission for the intended beta/public display.

## 7. Subscription and Cost Envelope

Pricing is a planning estimate and must be rechecked at purchase. Taxes,
market-data licensing, legal services, domain renewal, and unexpected usage are
excluded.

| Stage | Expected recurring software cost | Main contributors |
|---|---:|---|
| Local development | $0–$25/month | Existing tools; optional AI API evaluation budget |
| Persistent staging/founder alpha | approximately $55–$150/month | Vercel Pro, Neon usage, Clerk Pro when production auth is enabled, modest AI/storage |
| Controlled beta | approximately $100–$300/month | Above plus Sentry Team, AI budget, email/storage/queue usage |
| Early public MVP | approximately $200–$600/month | Usage-dependent hosting, database, AI, email, telemetry, storage, and possible queue/cache upgrades |

Cost controls:

- organization-owned billing with MFA and two recovery contacts;
- provider spend alerts and hard caps/pauses where safe;
- no unrestricted AI usage or automatic user monetary overage;
- monthly provider cost review by feature and user;
- kill switches for AI and optional expensive work;
- capacity upgrades only from measured saturation, reliability, or retention
  needs; and
- formal approval before any annual or enterprise commitment.

## 8. Sequencing and Dependencies

```text
E0 Scope/vendor closure
  └─ E1 Delivery foundation
      ├─ E2 PostgreSQL ─ E3 Identity/isolation ─ E7 Private user features
      └─ E4 Analytics publication ─ E5 Homepage ─ E6 Workspace/Evidence
                                      └───────────┬───────────────┘
                                                  └─ E9 Ask TradeEvidence

E10 Operations/security runs alongside E1–E9 and gates releases.
E11 Controlled beta requires E1–E7, E9 if enabled, and E10.
E12 Public launch requires measured E11 acceptance and public commitments.
E8 exists only if D-01 includes portfolio.
```

Recommended vertical-slice order:

1. M0 real-data local Homepage and Workspace.
2. Environment, migration, telemetry, and staging skeleton.
3. Database-backed real-run ingestion and founder publication.
4. Identity and two-user isolation proof.
5. Same-run Homepage → Workspace → Evidence journey.
6. Watchlists and privacy preferences.
7. Decision Confidence, strategy education, checklist, and export completion.
8. Ask TradeEvidence gateway, evaluation, budgets, and guarded UI.
9. Operational/staff controls, restore, load, security, and incident exercises.
10. Invitation-only controlled beta and measured public-launch preparation.

## 9. Indicative Schedule

For one founder plus an AI-assisted development workflow, assuming timely human
decisions and no portfolio-contract expansion:

| Period | Primary target |
|---|---|
| Week 1 | D-01–D-10 decisions, merge current preview, M0 real-data adapter |
| Weeks 2–3 | E1 foundation, E2 schema/migrations/database, persistent staging |
| Weeks 3–4 | E3 identity/isolation and E4 controlled analytics publication |
| Weeks 5–6 | E5 Homepage and E6 full Workspace/Evidence journey |
| Week 7 | E7 watchlists, profile/privacy, deletion/expiry, export |
| Weeks 8–9 | E9 Ask TradeEvidence implementation and evaluation |
| Weeks 9–10 | E10 security, observability, recovery, load, browser/accessibility |
| Weeks 11–12 | E11 family-and-friends beta readiness and staged invitations |
| Weeks 13–14 | Beta correction buffer and E12 public-launch decision |

This is an indicative 12–14 week plan, not a deadline. Portfolio inclusion,
market-data licensing problems, failed AI evaluations, provider procurement,
security findings, or beta feedback can extend it. Ask TradeEvidence may remain
disabled at the start of beta only if the founder explicitly accepts that the
beta is not yet 100% of the approved MVP; public MVP completion requires it.

## 10. Program Controls and Reporting

Track each feature with:

- requirement and source-of-truth link;
- epic, capability, feature, story, and task identity;
- owner, dependency, risk level, target milestone, and status;
- acceptance criteria and test evidence;
- security/privacy/threat review status;
- provider and recurring-cost impact;
- feature flag, rollout, telemetry, alert, rollback, and kill-switch behavior;
- documentation and ADR impact; and
- human approval required and recorded.

Weekly founder review should answer:

1. What demonstrable user outcome became available?
2. What is blocked by a founder or vendor decision?
3. What changed in scope, risk, schedule, or recurring cost?
4. What evidence supports the next release gate?
5. What should be stopped, deferred, or simplified?

## 11. Immediate Next Actions

1. Approve or revise D-01 through D-10.
2. Merge the founder-preview branch through the protected pull-request flow.
3. Inspect and schema-map the latest real analytics-engine JSON.
4. Implement the M0 file-backed analytics publication adapter.
5. Demonstrate the real-data Homepage and Workspace locally.
6. Create the detailed E1/E2 implementation backlog only after the applicable
   provider commitments are approved.

No production account, paid subscription, external data transmission, or public
release is authorized by this proposed plan alone.

## 12. Provider Pricing References

- [Vercel pricing](https://vercel.com/pricing)
- [Neon pricing](https://neon.com/pricing)
- [Clerk pricing](https://clerk.com/pricing)
- [Vercel Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)
- [Inngest pricing](https://www.inngest.com/pricing)
- [Resend pricing](https://resend.com/pricing)
- [Sentry pricing](https://sentry.io/pricing/)
- [OpenAI models and API pricing](https://platform.openai.com/docs/models)
- [Upstash Redis pricing](https://upstash.com/pricing/redis)
