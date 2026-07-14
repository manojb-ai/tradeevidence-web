# Decision Workspace and Decision Journal Workshop

**Date:** 2026-07-14  
**Status:** In Progress

## Executive Summary

With Dashboard v1 locked, product design shifted to the core TradeEvidence experience: the Decision Workspace.

The Decision Workspace is not designed as a chart or indicator page. It is a structured thinking environment for evaluating new opportunities and reviewing existing positions.

## Core Questions

Every decision begins with:

1. What is happening?
2. Why does it matter?
3. What should I consider?
4. What do I decide?

TradeEvidence answers the first three. The user owns the fourth.

## Proposed Information Flow

```text
Market Context
→ Security / Position
→ Evidence
→ Counter-Evidence
→ Risk
→ Position Sizing
→ Education
→ Decision Checklist
→ Decision Review
→ AI Discussion
```

## Decision Confidence

### Approved Concept

Decision Confidence is distinct from Evidence Score.

- **Evidence Score:** Strength and quality of the available evidence.
- **Decision Confidence:** How supportive the current context is for acting now.

Decision Confidence may be reduced by:

- Upcoming earnings
- Weak market context
- Excessive extension
- Event risk
- Conflicting evidence
- Poor timing
- Elevated volatility

## “Appropriate For” Concern

An early idea proposed labeling an opportunity as appropriate for different investor types.

This was rejected because:

- It may sound prescriptive.
- Users may interpret it as a platform recommendation.
- It could generate criticism or misuse.

The discussion evolved toward a Decision Checklist that asks the user to evaluate fit for themselves.

## Decision Checklist

### Approved Concept

Every Decision Workspace should include a dynamic “Before You Decide” checklist.

Potential questions include:

- Why am I interested in this opportunity?
- What supports my thesis?
- What contradicts it?
- What would invalidate it?
- Does the timing match my horizon?
- Is the position size consistent with my risk rules?
- Have I considered the bearish case?
- Am I responding to evidence or emotion?

## Decision Journal Lifecycle

Long-term vision:

```text
Decision Checklist
→ Decision Snapshot
→ Decision Review
→ Reflection
→ Learning
→ Milestone
→ Decision Journey
```

MVP priority:

- Deliver the checklist.
- Consider print/export if inexpensive.
- Database persistence is a later capability.

## Celebration and Positive Reinforcement

The product should celebrate:

- Profitable outcomes
- Patience
- Disciplined execution
- Position-sizing adherence
- Decision reviews
- Learning milestones
- Investment anniversaries
- Journaling consistency

The product should not imply that one profitable trade proves the process was sound. It may celebrate the outcome while inviting reflection on what contributed to it.

## Community and Social Sharing

Future Phase 3–4 ideas:

- Shareable Decision Stories
- Learning summaries
- Market Briefings
- Milestones
- Social-media integrations
- Mentor mode
- Investment clubs

Initial social sharing should be opt-in and privacy-conscious.

## Open Questions

- Exact Decision Workspace section order
- Decision Confidence calculation and presentation
- Checklist persistence in MVP
- Decision Snapshot database design
- Milestone taxonomy
- How AI summarizes changes between original and current evidence

## Next Session Agenda

1. Prototype the Decision Workspace.
2. Define Decision Confidence inputs.
3. Define the MVP Decision Checklist.
4. Specify the new-position and existing-position variants.
