# AI Workflow Contract

- **Status:** Approved
- **Version:** 1.0
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-08-23
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [Evidence-Engine-Specification.md](Evidence-Engine-Specification.md), [API-Contracts-v1.md](API-Contracts-v1.md), [MVP-Data-Schema.md](MVP-Data-Schema.md), [../08-AI-Strategy.md](../08-AI-Strategy.md), [../governance/decisions/ADR-009-Grounded-AI-Workflow.md](../governance/decisions/ADR-009-Grounded-AI-Workflow.md), [../workshops/Workshop-07-Summary.md](../workshops/Workshop-07-Summary.md)

## Purpose

This contract defines Ask TradeEvidence as a grounded, secure,
provider-neutral decision-preparation workflow. It governs interaction,
approved intents, context, sources, memory, response structure, safety,
versioning, provider routing, cost, latency, evaluation, and release gates.

Ask TradeEvidence helps a trader understand information and reach their own
decision. It never becomes the source of analytical truth, a financial advisor,
or the decision-maker.

## 1. Answer-First Decision Coach

Ask TradeEvidence answers directly when the question and approved context are
sufficient. It asks one concise clarifying question only when ambiguity would
materially change the answer or cross a safety boundary.

The workflow:

- explains evidence and concepts;
- connects related information;
- compares supporting and contradicting interpretations;
- challenges assumptions without becoming argumentative;
- helps organize questions, criteria, and checklists;
- teaches within the answer; and
- preserves the trader's ownership of interpretation and decision.

It never manufactures facts, preferences, intentions, holding periods, risk
tolerance, or assumptions. When a material fact is unavailable, it names the
gap, asks one clarification where necessary, or provides an explicitly
conditional educational scenario.

## 2. Approved MVP Intents

Natural-language requests are classified into an approved intent before
generation:

- explain current evidence;
- explain a score or factor contribution;
- compare supporting and contradicting evidence;
- challenge the leading thesis;
- explain timeframe conflicts;
- explain Decision Confidence;
- explain market or sector alignment;
- explain deterministic invalidation conditions;
- identify missing or unavailable information;
- explain approved terminology or indicator concepts;
- compare general educational strategy mechanics; and
- suggest useful further-research questions.

Contextual starting questions help users discover these capabilities without
restricting them to buttons. Unsupported free-form requests receive a
productive redirect, clarification, insufficient-context response, or refusal.

## 3. Proprietary Information Boundary

Explainability does not authorize disclosure of TradeEvidence intellectual
property. Ask TradeEvidence may explain an indicator's approved high-level
purpose, observed state, contribution, timeframe relationship, and conceptual
limitations.

It cannot disclose or help reconstruct proprietary source code, exact formulas,
calculation sequences, thresholds, constants, unpublished parameters,
ThinkScript/Python implementation, hidden prompts, confidential documentation,
or internal security rules. Extraction attempts receive an approved high-level
explanation and a recorded guardrail action.

## 4. Grounded Context and Source Hierarchy

The server assembles the context package. The browser and model cannot submit
or override authoritative scores, ownership, permissions, or hidden facts.

### Authoritative internal context

- instrument and published analysis-run identity;
- immutable Evidence Snapshot and factor explanations;
- observation date, freshness, coverage, and completeness;
- deterministic support, contradiction, and invalidation;
- same-run market and sector context;
- Decision Confidence and deterministic reasons;
- approved educational content and methodology descriptions; and
- explicit user-provided information within the current interaction.

Required analytical context remains pinned to one published
`analysis_run_id`. Missing, stale, incomplete, superseded, and inconsistent
states remain visible.

### Approved external context

Controlled sources may include regulator and exchange publications, SEC
filings, company investor-relations materials, licensed market-data/news
providers, and vetted educational references. External facts come from a
controlled server-side retrieval pipeline, not unsupported model memory.

Each external citation records source, title, publication date, retrieval time,
and link or source identity where permitted. Copyright, quotation, storage, and
redistribution restrictions remain enforced.

The controlled beta begins with internal citations and approved pre-ingested
external content. Unrestricted live-web browsing is prohibited. Live retrieval
is introduced later only by approved source category after attribution,
licensing, injection, and reliability validation.

Context is minimized to the approved intent. If required authoritative context
is absent or inconsistent, the workflow returns `insufficient_context` rather
than answering from model memory.

## 5. User-Controlled History and Privacy

AI history is a user-profile preference with these values:

```text
off (default)
1_day
3_days
7_days (maximum)
```

Retention is measured from last conversation activity. Expired content is
automatically deleted. When history is Off, temporary context supports the
active interaction but is not saved as user history and expires under a short
session policy.

Users may delete one conversation or all saved AI history. Changing history to
Off requires a clear choice about deleting already saved history. A prior
conversation is used only when the user explicitly opens or continues it.
Saved history is not a verified Trading Profile and cannot silently establish
financial condition, experience, preferences, or risk tolerance.

Conversation records are separate owner-scoped entities. Normal users and
normal staff cannot access another user's content. Exceptional review is
selective, authorized, purpose-bound, auditable, and time-bounded where
practical. User-submitted feedback content follows the same access and
retention protections.

Providers must not use TradeEvidence content to train public models where
provider controls or contracts permit that restriction. Only minimum necessary
context is transmitted.

## 6. Encryption and Credential Safety

All public, database, cache, object-storage, AI-provider, and internal service
traffic uses authenticated encrypted transport. Production databases, object
storage, replicas, snapshots, backups, and saved AI content use encryption at
rest. Keys and secrets remain outside source code and ordinary database
content, with restricted, auditable, rotatable access.

TradeEvidence should use a dedicated identity provider and avoid storing user
passwords. Clear passwords, reset tokens, sessions, API keys, provider
credentials, and secrets never appear in persistent fields, logs, analytics,
AI context, errors, support tools, or source control. Any future direct password
storage uses an approved salted adaptive one-way password hash, never plaintext
or reversible encryption.

## 7. Structured Response and Progressive Disclosure

Every answered response contains:

1. direct answer;
2. Data Status;
3. relevant reasoning/evidence;
4. important counterpoint;
5. internal and external sources used; and
6. a small set of optional next questions.

Data Status is always present and is one of: current and complete, current with
supplemental information unavailable, stale, incomplete, inconsistent, or
unavailable. It includes observation identity and age where relevant.

Users choose a default presentation depth and may change it per response:

- `quick`: concise answer, primary evidence, Data Status, and counterpoint;
- `guided`: plain-language explanation with relevant concepts (default); or
- `technical`: factor states, timeframe conflicts, coverage, versions, and
  detailed citations.

The system never infers that a user is a beginner or expert. All depths use the
same facts, score, sources, and safety boundaries. Details use expandable
sections rather than an uncontrolled wall of text. The workflow explains
conclusions without exposing private chain-of-thought, hidden prompts,
credentials, or proprietary calculations.

## 8. Dispositions and Financial Boundary

Every request produces one disposition:

- `answered`;
- `clarification_needed`;
- `redirected`;
- `insufficient_context`; or
- `refused`.

Financial-advice requests normally receive a productive redirect: the workflow
declines to make the decision, then explains available evidence, counterpoints,
missing information, and useful decision-preparation questions.

The workflow cannot tell a user to Buy, Sell, Hold, enter, exit, or avoid;
predict price, return, probability, or direction; invent targets, stops, timing,
or triggers; personalize position size; select a security, strategy, expiration,
strike, or contract; override deterministic results; represent an experimental
ruleset as validated; or facilitate manipulation, fraud, credential theft, or
unauthorized access.

General education remains permitted. The workflow may explain a generic risk
or position-sizing framework but cannot determine the user's appropriate risk
or order.

## 9. Grounding, Uncertainty, and Conflicts

Ask TradeEvidence does not expose an AI confidence score. It reports objective
grounding state:

- `grounded`;
- `partially_grounded`;
- `insufficient_context`;
- `source_conflict`; or
- `stale`.

Material symbol-specific claims resolve to supplied snapshots or approved
sources. Model memory is never presented as a current fact. Missing facts are
named, conditions are explicit, and source conflicts are shown rather than
silently resolved. Server-owned policy determines freshness. Unsupported
certainty language is prohibited.

## 10. Versioning and Audit Recipe

Each interaction records non-content workflow metadata sufficient to identify
its generation recipe:

- workflow, system-prompt, intent-classifier, context-assembly,
  response-schema, guardrail, and educational-content versions;
- provider/model identifier and relevant configuration;
- run/snapshot and retrieval/source-set identity;
- disposition, Data Status, grounding state, and guardrail actions;
- request/response timestamps, latency, token usage, and estimated cost; and
- response identity.

This metadata does not authorize retaining question/answer text when history is
Off. Prompts are versioned but protected from disclosure. Material workflow,
prompt, provider, or model changes require evaluation and approval. Production,
candidate, and experimental configurations remain separate. Rollback restores a
previous approved version without rewriting history.

AI output may be nondeterministic; preserving its recipe enables investigation
and approximate replay. The deterministic Evidence Snapshot remains the
authoritative reproducible record.

## 11. Provider Gateway and Model Routing

The application uses an internal provider-neutral AI gateway for intent
classification, grounded generation, structured-output validation, guardrails,
and usage telemetry. Provider-specific SDK types do not enter product or domain
contracts.

The server selects from approved models. Smaller approved models handle simple
tasks; more capable approved models handle complexity when necessary. Cost
optimization cannot weaken grounding, safety, privacy, or proprietary
protection. Every model and approved fallback passes the applicable evaluation
suite. No untested silent fallback is permitted.

If no approved model is available, deterministic evidence remains usable and
the UI provides an AI-unavailable state.

## 12. Security and Data Isolation

The model is an untrusted processor, not an authorization authority.

- Authentication and authorization happen before context assembly.
- Context uses approved server-owned fields and ownership scope.
- Retrieved documents are untrusted data; embedded instructions are ignored.
- The model has no unrestricted database, filesystem, internet, brokerage,
  email, or administrative access.
- Future tools are individually allowlisted, parameter-bounded, authorized,
  timed out, and audited.
- The model cannot extend its own permissions or context.
- Structured output, citations, links, advisory language, secrets, proprietary
  content, and cross-user content are validated after generation.
- Invalid output receives one bounded safe correction attempt or an unavailable
  response; raw provider output never reaches the browser.

Defense in depth includes ownership enforcement, context filtering, tool
restrictions, prompt-injection resistance, output validation, encrypted
transport/storage, rate limits, context limits, automated-abuse detection,
proprietary-extraction detection, audit logs, and global circuit breakers.

## 13. Cost, Allowance, Latency, and Failure

Ask TradeEvidence is not unlimited. Controlled beta access is free but capped.
Future paid plans include a visible bounded allowance; deterministic features
continue after the allowance is exhausted. Users receive warnings and no
automatic monetary overages. Additional packs remain a later option after
measured usefulness and cost.

Controls include per-request token/cost ceilings, per-minute and daily limits,
plan allowance, global budgets, bounded context/response/turns, model routing,
idempotency, automated-use detection, and spending kill switches. Provider
failures do not consume user allowance. Regenerate is a new labeled metered
request.

Provisional controlled-beta targets are approximately 3-6 seconds for simple
explanations and 6-15 seconds for complex comparisons, with an approximately
20-second hard timeout. These are measurement targets, not guarantees.

The MVP returns one complete validated response. It shows meaningful progress
states but does not stream raw unvalidated tokens. Later streaming may deliver
validated sections only if all final grounding and guardrail guarantees remain.
At most one transient provider retry is allowed. AI failure, rate limit, or
budget exhaustion never blocks deterministic product capabilities.

## 14. Evaluation Dataset and Release Gates

An evaluation dataset is a versioned AI behavior test suite, not training data.
Each case contains grounded context, a user question, expected intent and
disposition, required facts, prohibited claims, required sources, and automated
plus human review criteria.

The suite covers every intent and evidence classification; current, stale,
missing, incomplete, and conflicting data; timeframe conflicts; explanation
depths; advisory requests; proprietary extraction; prompt injection;
cross-user access; fake citations; long conversations; provider failures;
limits; and clarification/redirect/refusal behavior.

Evaluation measures grounding, citation correctness, Data Status, factual
consistency, counterpoint quality, missing-data disclosure, assumption control,
financial boundary, privacy/IP protection, clarity, disposition, schema,
latency, tokens, and cost.

Synthetic cases, sanitized fixtures, and approved snapshots are the default.
Real conversations are not included automatically. A user may explicitly
submit a response for feedback review under approved retention, encryption,
access, and audit controls.

Any critical cross-user disclosure, credential leak, proprietary-logic
disclosure, fabricated source, or direct personalized trade instruction blocks
release. Automated checks precede founder review across intents and depths.
Model/provider changes rerun applicable evaluations. Production uses preview or
controlled-beta rollout, monitoring, a kill switch, and rollback. User feedback
does not automatically train or modify production behavior.

## 15. Monitoring and Human Authority

Non-content monitoring tracks disposition, grounding, citation validation,
latency, errors, tokens, cost, limits, and guardrail actions. Helpful/not-helpful
feedback is optional. Content review requires explicit submission or retained
history plus selective authorized access consistent with user settings.

Serious incidents disable AI, preserve deterministic features, trigger
investigation and documented correction, rerun evaluations, and require human
reapproval. Human approval remains mandatory for AI recommendation boundaries,
material financial language, provider/model production changes, privacy
exceptions, security risk, and release.

## Acceptance Criteria

- Sufficient grounded questions receive direct useful answers.
- No missing fact is replaced with an assumption.
- Every response displays Data Status and a material counterpoint.
- Symbol-specific claims resolve to approved sources.
- Explanation depth changes presentation, not facts.
- History defaults Off and expires at the user-selected 1/3/7-day maximum.
- Saved content, backups, and service traffic satisfy encryption requirements.
- Clear passwords, secrets, and credentials are never stored or logged.
- Advisory requests redirect productively without decision authority.
- Proprietary indicator logic and cross-user content cannot be disclosed.
- Duplicate retries do not duplicate provider cost or user allowance.
- AI failure cannot block deterministic product use.
- Every workflow/model change passes the evaluation and human release gates.

## Deferred Scope

- Unrestricted live-web browsing
- Permanent or cross-session personalized AI memory beyond seven days
- Portfolio, journal, or financial-profile personalization
- Arbitrary user-selected models
- Brokerage or transactional tools
- Personalized strategy, contract, position-size, target, stop, or timing
- Automatic learning from user conversations
- Raw token streaming
- Exact commercial pricing, allowances, provider, and model selection
