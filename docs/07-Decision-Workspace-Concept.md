# Decision Workspace Concept

## Documentation Status
Status: Approved
Version: 1.0
Owner: Product
Last Updated: 2026-07-14
Applies To: Primary authenticated experience and decision-preparation workflow
Related Documents: [04-Design-System.md](04-Design-System.md), [08-AI-Strategy.md](08-AI-Strategy.md), [product/Decision-Confidence.md](product/Decision-Confidence.md), [product/Decision-Journal.md](product/Decision-Journal.md), [Canonical-Terminology.md](Canonical-Terminology.md)

## Purpose

The Decision Workspace is the primary authenticated experience in TradeEvidence. It is the place where a trader gathers market context, evaluates an opportunity or position, examines evidence, considers risk, and prepares a decision.

Its purpose is not simply to display information. It exists to help the trader answer the next meaningful question: What should I be thinking about right now?

## Primary Authenticated Experience

The Decision Workspace should be the main destination after the homepage for users who are preparing to act. It supports two core journeys:

- evaluating a new opportunity
- reviewing an existing position

In both cases, the workspace helps the trader move from context to judgment without losing the discipline of evidence, risk, and reflection.

## Section Hierarchy

The workspace should organize information in a way that supports decision preparation:

1. Market Context
2. Security or Position Summary
3. Evidence
4. Counter Evidence and Devil's Advocate
5. Risks and Thesis Invalidation
6. Position Sizing
7. Education
8. Decision Checklist
9. Decision Review and Journal
10. Ask TradeEvidence

This order reflects the product's emphasis on understanding the environment before acting on a specific setup.

## Evidence Score and Decision Confidence

The workspace should clearly distinguish between the two concepts:

- Evidence Score measures how strong and internally consistent the available evidence appears to be.
- Decision Confidence measures how supportive the current decision environment is for acting now.

A high-quality thesis can still carry only moderate Decision Confidence if the market context is weak, volatility is elevated, earnings are approaching, or the setup is extended.

## Counter Evidence and Devil's Advocate

The workspace should not present a one-sided argument. It should make the strongest contrary case visible so the trader can confront uncertainty rather than simply confirm an existing view.

This supports a Devil's Advocate posture by surfacing:

- conflicting signals
- weak points in the thesis
- risks that could invalidate the idea
- alternative interpretations of the same evidence

## Position Sizing

Position sizing should be treated as a core part of preparation. The workspace should help the trader think about risk concentration, volatility, maximum acceptable loss, and fit with stated risk rules.

This remains educational guidance rather than a personalized recommendation. The user remains responsible for the decision.

## Education

The workspace should make relevant concepts understandable without overwhelming the user. It can include plain-language explanations of:

- strategy logic
- risk trade-offs
- evidence quality
- timing considerations
- portfolio context

## Decision Checklist

Every Decision Workspace should end with a “Before You Decide” checklist that prompts the user to review the core questions before acting. The checklist should support discipline while preserving user ownership.

Potential prompts include:

- Why am I interested in this opportunity?
- What supports my thesis?
- What contradicts it?
- What would invalidate it?
- Does the timing match my horizon?
- Does the position size fit my risk rules?
- Have I considered the bearish case?
- Am I reacting to evidence or emotion?

## Decision Review

The workspace should connect naturally to the later Decision Journal experience. After acting, the user should be able to review the original thesis, current evidence, new developments, and what changed over time.

This creates a bridge from preparation to reflection and learning.

## AI Integration

AI should act as a decision coach inside the workspace. It can help the user:

- explain evidence in plain language
- challenge the current thesis
- compare supporting and opposing evidence
- teach important concepts
- generate a Devil's Advocate view
- review the risk and invalidation logic

AI should support understanding and reflection, not replace the user's judgment.

## Evidence History and Validation

The workspace should make past evidence visible and reviewable. Each opportunity or thesis should eventually connect to an evidence history trail that shows:

- the immutable evidence snapshot created at the time of analysis
- the model and data versions used
- the supporting and contradicting evidence preserved for review
- later outcome measurements that show what happened

The broader architectural context for this concept is documented in [Evidence-History-and-Validation.md](Evidence-History-and-Validation.md), and the expected record structure is described in [Evidence-Snapshot-Data-Contract.md](Evidence-Snapshot-Data-Contract.md).

## Future Evolution

The Decision Workspace will evolve through the product's broader design roadmap:

- Version 1: a curated workspace that surfaces the most important context and next steps
- Version 2: persona-based workspace templates that adapt the experience to different trading styles
- Version 3: user-customizable dashboards built from modular widgets

## Desired Outcome

When a trader finishes using the workspace, they should be able to say:

- I understand the market.
- I understand the evidence.
- I understand the risks.
- I have a plan.
- I have earned confidence.

## Related Documents

- [01a-Product-Philosophy.md](01a-Product-Philosophy.md)
- [01b-User-Personas.md](01b-User-Personas.md)
- [03-Architecture.md](03-Architecture.md)
- [04-Design-System.md](04-Design-System.md)
- [product/Dashboard.md](product/Dashboard.md)
- [product/Decision-Confidence.md](product/Decision-Confidence.md)
- [product/Decision-Journal.md](product/Decision-Journal.md)
- [Trading-Profile.md](Trading-Profile.md)
- [08-AI-Strategy.md](08-AI-Strategy.md)
