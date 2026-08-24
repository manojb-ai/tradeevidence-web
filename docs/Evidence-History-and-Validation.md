# Evidence History and Validation

## Purpose
TradeEvidence should preserve, evaluate, and learn from its own evidence.

Every intentional execution creates a traceable analysis-run event. A
successful evaluation creates or references immutable Evidence Snapshot
content recording:
- What TradeEvidence believed
- Why it believed it
- The surrounding market context
- What happened afterward

## Guiding Principles
- Never overwrite history.
- Every run creates a new snapshot.
- Preserve supporting and contradicting evidence.
- Preserve model version.
- Evaluate outcomes without hindsight bias.

## Objectives
- Detect major market turns.
- Detect major stock turns.
- Measure score evolution.
- Measure confidence evolution.
- Improve future scoring models.
- Build user trust through transparency.

## Evidence Snapshot
Suggested fields:
- Timestamp
- Symbol
- Price
- Evidence Score
- Coverage and completeness
- Market Regime
- Sector Context
- Supporting Evidence
- Contradicting Evidence
- Risks
- Thesis Invalidation
- Non-advisory risk considerations
- Model Version
- Data Version
- Factor, schema, and explanation-template versions
- Source checksum and analysis-run identity

Technical Evidence remains separate from Decision Confidence and the trader's
decision. Equivalent snapshot content may be deduplicated without erasing
intentional run history. Failed and incomplete runs remain traceable.

## Devil's Advocate
Every snapshot should preserve material evidence for and against the leading
direction. Beginner and expert presentations may use different depth, but they
must use the same canonical facts.

## Authority

The approved semantics, lifecycle, and validation gates are defined in
[Evidence Engine Specification](engineering/Evidence-Engine-Specification.md)
and [ADR-008](governance/decisions/ADR-008-Evidence-Engine-Governance.md).

## Future
Evidence Lab, historical timelines, AI historical reasoning and model validation.
