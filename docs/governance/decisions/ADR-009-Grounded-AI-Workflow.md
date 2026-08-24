# ADR-009 - Grounded AI Workflow

## Status

Accepted

## Date

2026-08-23

## Context

Ask TradeEvidence can materially improve product usability by explaining dense
evidence, surfacing contradictions, teaching concepts, and guiding decision
preparation. The same capability can undermine trust through invented facts,
advisory behavior, proprietary-information disclosure, cross-user leakage,
unbounded cost, stale sources, or model changes that occur without review.

The approved Evidence Engine is deterministic and authoritative. The AI
workflow must consume rather than replace it while remaining helpful to both
newer and experienced traders.

## Decision

TradeEvidence adopts an answer-first, provider-neutral, snapshot-grounded AI
workflow. It answers directly when approved context is sufficient, asks one
material clarification when necessary, never fills gaps with assumptions, and
helps the user reach their own decision without acting as financial advisor or
decision-maker.

Requests map to approved educational and decision-preparation intents. The
server assembles minimal same-run internal context plus approved traceable
sources. Controlled beta uses internal and approved pre-ingested external
sources; unrestricted live-web browsing is prohibited.

Responses use a validated structured contract with a direct answer, always
visible Data Status, reasoning, material counterpoint, citations, and optional
follow-ups. Quick, Guided, and Technical depths present the same facts. The
workflow exposes high-level indicator meaning and contribution but protects
proprietary formulas, code, thresholds, prompts, and confidential rules.

AI history is Off by default. Users may opt into 1-, 3-, or 7-day retention,
delete conversations, and disable history. Conversation content is owner
isolated, encrypted at rest and in transit, and separate from non-content
workflow audit metadata. Clear passwords, credentials, and secrets are never
persisted or logged.

The model is an untrusted processor. Server-side authorization, bounded context,
untrusted-document handling, tool allowlists, prompt-injection resistance,
structured output validation, citation verification, proprietary/privacy
filters, rate limits, and circuit breakers provide defense in depth.

Workflow, prompt, context, schema, guardrail, provider, and model versions are
traceable and reversible. Approved model routing operates under per-request,
user, plan, and global budgets. AI is capped rather than unlimited; controlled
beta is free with limits, and future paid plans use included allowances without
surprise overages. Deterministic features remain available during provider,
budget, or guardrail failure.

Every production change must pass a versioned AI evaluation dataset containing
grounded contexts, questions, expected behavior, required facts, prohibited
claims, sources, and human review criteria. Critical advice, fabricated-source,
credential, proprietary-logic, or cross-user failures block release. Founder
approval remains required.

## Consequences

- Ask TradeEvidence remains useful rather than responding with dead-end
  disclaimers.
- Grounded citations and mandatory Data Status improve trust and reviewability.
- Users control short-lived history and database growth remains bounded.
- Provider/model evolution remains possible behind one internal contract.
- Security and output validation add latency and implementation cost.
- No raw streaming is available initially because output is validated before
  display.
- External retrieval expands more slowly because source categories require
  licensing, attribution, and injection evaluation.
- AI cost is measurable and bounded without disabling deterministic research.
- A maintained evaluation dataset becomes a required product asset.

## Alternatives Considered

- **Open-ended general chatbot:** rejected because it weakens grounding,
  privacy, financial boundaries, and predictable cost.
- **Ask before every answer:** rejected because unnecessary questioning harms
  usability when context is already sufficient.
- **Unlimited AI in every plan:** rejected because usage and provider cost can
  grow disproportionately.
- **Permanent memory by default:** rejected because it increases privacy,
  storage, stale-context, and behavioral-profiling risk.
- **Model memory as a current source:** rejected because current claims require
  traceable approved sources.
- **Raw token streaming:** deferred because unsafe or invalid output could reach
  the user before validation.
- **AI access to proprietary indicator implementation:** rejected because
  product explainability does not require disclosure of protected logic.

## Related Documents

- [AI Workflow Contract](../../engineering/AI-Workflow-Contract.md)
- [AI Strategy](../../08-AI-Strategy.md)
- [Evidence Engine Specification](../../engineering/Evidence-Engine-Specification.md)
- [API Contracts v1](../../engineering/API-Contracts-v1.md)
- [Workshop #7 Summary](../../workshops/Workshop-07-Summary.md)
