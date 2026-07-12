# Evidence History and Validation

## Purpose
TradeEvidence should preserve, evaluate, and learn from its own evidence.

Every execution of the Evidence Engine creates an immutable Evidence Snapshot recording:
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
- Confidence
- Market Regime
- Sector Context
- Supporting Evidence
- Contradicting Evidence
- Risks
- Thesis Invalidation
- Position Sizing Guidance
- Model Version
- Data Version

## Devil's Advocate
Every snapshot should preserve both the bullish and bearish case.

## Future
Evidence Lab, historical timelines, AI historical reasoning and model validation.
