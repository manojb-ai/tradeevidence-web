<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## TradeEvidence source of truth

- Read `docs/AI_CONTEXT.md` before material product or implementation work.
- Use `docs/Source-of-Truth.md` to identify the authoritative document for each
  decision domain.
- Treat approved product decisions and ADRs as constraints. Escalate conflicts
  instead of silently overriding them.
- Preserve the distinction between Evidence Score and Decision Confidence.
- Product language must remain educational, explainable, and non-advisory.

## AI-DLC working model

- Scale rigor to risk and reversibility.
- Level 1 covers low-risk reversible changes; Level 2 covers ordinary features;
  Level 3 covers scoring, AI behavior, financial language, authentication,
  sensitive data, security, and production architecture.
- Humans retain approval of product direction, scoring methodology, AI
  recommendation boundaries, material security risk, and releases.
- Prefer small, testable vertical slices and keep requirements, implementation,
  tests, and documentation synchronized.

## Session closure

At the end of meaningful work, record material decisions, changed artifacts,
open questions, risks, and next steps. Update the appropriate specification,
decision log, ADR, workshop summary, or project-status artifact. Do not rely on
chat history as the sole record of a decision.

## Analytics engine

- `analytics-engine/` is a deterministic Phase 1 baseline.
- Current weights are unvalidated hypotheses; do not describe them as
  predictive or historically validated.
- Preserve behavior until Workshop #2 approves Evidence Score semantics.
- Scoring or financial-language changes require tests, documentation, a
  ruleset/version update, and human review.
- Generated reports and local market-data exports must not be committed unless
  intentionally sanitized as test fixtures.
