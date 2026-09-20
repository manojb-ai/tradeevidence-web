# Founder MVP Delivery Plan

- **Status:** Approved
- **Version:** 1.0
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-09-01
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [MVP-Implementation-Spec.md](MVP-Implementation-Spec.md), [MVP-Application-Architecture.md](MVP-Application-Architecture.md), [Vertical-Slice-01-Delivery-Foundation.md](Vertical-Slice-01-Delivery-Foundation.md)

## Decision

TradeEvidence will prioritize a functioning, reviewable MVP and add features in small vertical slices. Product delivery and assurance work proceed as parallel lanes; compliance and SDLC controls remain required guardrails but do not require completing every future-state policy before founder testing.

## Delivery sequence

1. Founder preview using sanitized or fictional analytical fixtures: Today's Briefing, opportunity cards, and Decision Workspace.
2. Connect the versioned analytics output contract and render one published run without calculating scores in the web request path.
3. Add authentication, user isolation, persistence, and controlled ingestion required for trusted-user testing.
4. Add watchlists, Decision Confidence interaction, and bounded Ask TradeEvidence capabilities incrementally.

## Non-negotiable boundaries

- Evidence Score and Decision Confidence remain separate.
- Product language remains educational, explainable, and non-advisory.
- Illustrative fixtures are visibly labeled and cannot be mistaken for current market analysis.
- The website consumes structured, versioned analytics output and never parses generated reports or recalculates authoritative scores.
- No real user or sensitive data is introduced before authentication, authorization, encryption, audit, and data-retention controls are ready.
- Scoring, financial-language, authentication, sensitive-data, and release changes retain Level 3 human approval.

## First-slice acceptance criteria

- The Homepage presents a concise Today's Briefing and no more than five deterministic opportunities from one fixture run.
- Every opportunity identifies its direction, timeframe, Evidence Score, principal support, and key constraint.
- A user can open a Decision Workspace that shows evidence, timeframe tension, a devil's-advocate view, reassessment conditions, and a visibly separate Decision Confidence area.
- Every screen states that the data is illustrative and the product is educational rather than advisory.
- Automated tests protect the product boundary and primary navigation.

## Open work after the first slice

- Define and implement the analytics-to-web publication adapter.
- Select and implement the approved authentication provider behind the provider-independent boundary.
- Add persistence and ownership enforcement for trusted-user testing.
- Add browser-level journey and accessibility testing before controlled release.
