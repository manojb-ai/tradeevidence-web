# Decision Workspace v1 — Concept Specification

## Status

Concept development in progress.

## Purpose

The Decision Workspace helps a user evaluate a new opportunity or revisit an existing position.

It is the central product experience after the homepage.

## Four Questions

1. What is happening?
2. Why does it matter?
3. What should I consider?
4. What do I decide?

TradeEvidence supports the first three. The user owns the fourth.

## Proposed Section Order

### 1. Market Context

- Current market regime
- Risk environment
- Relevant sector context
- Important events

### 2. Security or Position Summary

- Symbol and name
- Current price
- Evidence Score
- Decision Confidence
- Entry-zone or position context
- What changed recently

### 3. Supporting Evidence

- Trend
- Momentum
- Relative strength
- Volume
- Sector alignment
- Fundamental or event context where available

### 4. Counter-Evidence / Devil's Advocate

- Conflicting signals
- Weaknesses
- Risks
- Upcoming events
- Alternative interpretation

### 5. Thesis Invalidation

- Conditions that would weaken or invalidate the thesis
- Technical levels
- Market or sector changes
- Fundamental or event changes

### 6. Position-Sizing Considerations

- Risk concentration
- Volatility
- Maximum acceptable loss inputs
- Relationship to portfolio and stated risk rules

This is educational guidance, not a personalized recommendation.

### 7. Education

- Relevant concepts
- Strategy trade-offs
- Options education where appropriate
- Plain-language explanations

### 8. Before You Decide

A dynamic Decision Checklist tailored to the current evidence and risk context.

### 9. Save / Export

MVP possibility:

- Print or export Decision Summary

Future:

- Save immutable Decision Snapshot
- Add to Decision Journal

### 10. Ask TradeEvidence

AI capabilities:

- Explain
- Challenge
- Compare
- Teach
- Generate Devil's Advocate view
- Review risk
- Clarify terminology

## New Opportunity vs. Existing Position

### New Opportunity

Focus on:

- Why it deserves attention
- Timing
- Entry context
- Risk
- Position-sizing preparation

### Existing Position

Focus on:

- Original thesis
- Current thesis
- What changed
- Evidence improvement or deterioration
- Whether original invalidation criteria occurred
- Decision review

## Signature Capabilities

- Decision Confidence
- Devil's Advocate
- Thesis invalidation
- Decision Checklist
- Future Decision Snapshot and Journal integration

## Implementation Alignment — 2026-09-17

The local founder-review slice follows the approved section order beginning
with Market Context, then Security Summary, Technical Evidence, Devil's
Advocate, Thesis Invalidation, Decision Confidence, Before You Decide,
Position Sizing, Education, and Ask TradeEvidence. It displays the exact
publication-time price and available instrument identity from the same local
acquisition set; unavailable context remains visibly unavailable.

No Decision Workspace visual mockup is currently preserved in the repository.
The current implementation therefore follows this concept specification and
the approved design-system principles, but pixel-level comparison with an
earlier visual prototype remains open until that prototype is recovered and
committed under `docs/prototypes/`.

The Technical Evidence section uses Trend Structure plus one Momentum group
with explicit Daily Momentum and Weekly Momentum rows. It explains that daily
momentum reacts faster while weekly momentum changes more slowly and supplies
broader context; neither timeframe is described as mechanically driving the
other.

The Devil's Advocate and Thesis Invalidation cards use presentation version
`founder-review-guided-v2`. Each card leads with a plain-English takeaway and a
short why-it-matters explanation, then preserves the Candidate 2 wording in an
expandable technical disclosure. The guided layer may translate recorded
facts, but it may not add a price target, stop, prediction, or unrecorded
factor. The founder hypothesis uses a direction-opposing close across the
21-day EMA as an early warning and two consecutive direction-opposing closes
across the 50-day SMA as a stronger reassessment reference. These are
educational references, not stops or Candidate 2 scoring rules.
