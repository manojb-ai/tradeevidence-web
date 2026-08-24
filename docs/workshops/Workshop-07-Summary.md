# Workshop #7 Summary

- **Status:** Completed
- **Completion Date:** 2026-08-23
- **Owner:** Founder and Chief Software Architect
- **Scope:** AI Workflow
- **AI-DLC Level:** Level 3 - Controlled

## Objective

Define an Ask TradeEvidence workflow that materially improves usability while
remaining grounded, non-advisory, private, secure, cost-bounded, explainable,
testable, and independent from analytical authority.

## Approved Decisions

1. Ask TradeEvidence is an answer-first Decision Coach. It asks one material
   clarification only when necessary and never fills gaps with assumptions.
2. Natural language maps to bounded educational and decision-preparation
   intents; unsupported requests redirect, clarify, report insufficient
   context, or refuse.
3. The workflow guides, explains, connects, challenges, and cites approved
   internal/external information while the trader retains the decision.
4. AI history is Off by default; users may select 1, 3, or 7 days; conversation
   content is owner isolated, deletable, encrypted, and never a hidden profile.
5. Structured responses always show Data Status, direct answer, reasoning,
   material counterpoint, sources, and optional follow-ups with Quick, Guided,
   and Technical presentation depths over the same facts.
6. Advisory questions receive constructive redirects; the AI cannot direct
   trades, predict outcomes, personalize sizing/contracts, override evidence,
   or reveal protected information.
7. The workflow uses grounding states rather than an AI confidence score;
   missing, stale, and conflicting sources remain explicit.
8. Workflow, prompt, context, guardrail, provider/model, schema, source, cost,
   and outcome metadata are versioned, traceable, and reversible without
   retaining conversation text when history is Off.
9. A provider-neutral gateway selects only evaluated models and fallbacks under
   per-request, user, plan, and global budgets. AI is capped, not unlimited;
   controlled beta is free with limits and future paid plans use included
   allowances without surprise charges.
10. The model is untrusted. Authorization, minimal context, encrypted services,
    prompt-injection resistance, bounded tools, output/citation validation,
    proprietary protection, rate limits, and circuit breakers enforce defense
    in depth.
11. The MVP returns a complete validated response with meaningful progress
    states, bounded retry/cost/latency, no raw token streaming, and graceful
    degradation that preserves deterministic product use.
12. A versioned evaluation dataset tests required and prohibited behavior
    across normal, ambiguous, stale, incomplete, adversarial, privacy, cost, and
    failure cases; critical failures block release and founder approval is
    mandatory.

## Deliverables

- [AI Workflow Contract](../engineering/AI-Workflow-Contract.md)
- [ADR-009 - Grounded AI Workflow](../governance/decisions/ADR-009-Grounded-AI-Workflow.md)
- Updated [AI Strategy](../08-AI-Strategy.md)
- Updated API, OpenAPI, and MVP data contracts
- Updated [Product Decision Log](../Product-Decision-Log.md)
- Updated [Architecture Workshop Plan](Architecture-Workshop-Plan.md)

## Risks and Open Questions

- Actual provider/model selection requires evaluation, privacy terms, cost,
  structured-output reliability, latency, and contractual data-use review.
- Exact beta allowance, paid-plan pricing, and reset periods require measured
  cost and usefulness.
- External retrieval requires source-category licensing, attribution, storage,
  prompt-injection, and reliability controls.
- User-selected history requires verified expiry, deletion, backup, and staff
  access behavior.
- Evaluation quality depends on representative cases and ongoing human review.
- Candidate 2 evidence remains experimental; AI cannot make it validated.

## Deferred Scope

- Unrestricted live-web browsing
- AI memory longer than seven days or automatic behavioral profiles
- Portfolio/journal personalization
- Brokerage or transactional tools
- Raw token streaming
- User-selected arbitrary models
- Automatic training or production changes from user conversations
- Final provider, model, pricing, allowance, and operational thresholds

## Next Workshop

Workshop #8 defines Delivery Readiness: testing, security, privacy,
observability, deployment, environments, release controls, Definition of Done,
and the first implementation backlog.

## Repository Closure

This summary, the AI Workflow Contract, ADR-009, aligned API/data/product
documentation, and decision-log updates are the durable Workshop #7 record.
