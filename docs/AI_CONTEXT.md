# AI Context for TradeEvidence

This document is intended for future AI coding assistants working on TradeEvidence. It should be read before making code changes so that implementation choices stay aligned with the product's purpose, voice, and boundaries.

## Project Vision
TradeEvidence is an evidence-based trading intelligence platform for self-directed traders. It exists to help users organize research, understand evidence, evaluate scoring logic, maintain a journal of decisions, and reflect on outcomes in a structured environment.

The product should support better decisions without replacing the trader's judgment. It is not an advisory platform, not an execution platform, and not a black-box prediction engine.

## Coding Philosophy
When making changes, prefer the following approach:
- keep changes focused and easy to reason about
- preserve readability and maintainability over cleverness
- favor small, deliberate improvements over broad rewrites
- document significant decisions when the product intent is not obvious
- maintain consistency with existing product language and UI patterns

Do not introduce speculative functionality that is not justified by the documented product direction.

## Architecture Principles
TradeEvidence should remain modular and understandable as it grows.

- keep the public website and the authenticated product experience conceptually separate
- prefer clear boundaries between product modules, UI surfaces, and supporting services
- avoid coupling unrelated features together when a cleaner separation is possible
- make architectural decisions in the context of explainability, transparency, and maintainability
- use placeholders rather than invented implementation details when the architecture is still undecided

When uncertain, prefer the simplest structure that supports the stated product goals without overcommitting to an implementation path.

## Preferred Terminology
Use terminology that reflects the product's evidence-based and non-advisory identity.

Prefer:
- Evidence
- Research
- Confidence
- Assumptions
- Strategy Alignment
- Risk Considerations
- Trader Decision

Avoid:
- Buy
- Sell
- Recommendation
- Guaranteed
- Prediction

Keep UI copy, documentation, and code comments aligned with this terminology whenever possible.

## UI Philosophy
The interface should feel professional, calm, analytical, and trustworthy. It should help traders work in dense information environments without overwhelming them.

Implementation guidance:
- support clear hierarchy and readable structure
- preserve accessible interaction patterns
- support Light Mode and Dark Mode
- keep the experience calm and focused rather than flashy or promotional
- make evidence, assumptions, and scoring logic easy to inspect

## Documentation Standards
Documentation is part of the product surface and should be treated as a first-class artifact.

- keep documentation concise, current, and useful
- update docs when behavior, architecture, or workflows change
- keep product docs, architecture docs, and engineering guidance aligned
- use TODO sections for unresolved decisions rather than leaving ambiguity silently
- preserve the same terminology across docs, UI, and implementation notes

## How to Make Architectural Decisions
When making or proposing architectural changes, follow this order:
1. Confirm the product need and user outcome.
2. Check whether the change is consistent with the documented vision and principles.
3. Prefer the smallest structure that can support the requirement.
4. Keep the decision explainable and reversible where possible.
5. Document any unresolved questions instead of assuming a path that has not been agreed upon.

Do not invent backend services, data models, or deployment patterns unless the product documentation already supports them.

## How to Avoid Unnecessary Complexity
Keep the product simple and deliberate.

- do not add abstractions before they are clearly needed
- avoid introducing unnecessary dependencies
- prefer straightforward flows over clever engineering patterns
- avoid feature breadth that weakens clarity
- question any solution that adds complexity without improving explainability, usability, or maintainability

If a feature could be implemented in a simpler way that still meets the product goal, prefer that approach.

## How to Propose New Features
New feature ideas should be framed through the product lens first.

Before proposing a feature, ask:
- What user problem does this solve?
- How does it improve evidence review, scoring, journaling, or decision quality?
- Does it fit the non-advisory and explainable product position?
- Does it add clarity or simply add surface area?
- Is the feature essential for the current product scope or a future extension?

If the answer is not clear, prefer to leave the idea as a future consideration rather than implementing it prematurely.

## How to Maintain Consistency
Consistency should be preserved across product, code, and documentation.

- keep naming, terminology, and UI language aligned
- follow existing patterns unless there is a strong reason to change them
- keep the product tone calm, professional, and analytical
- ensure changes do not introduce conflicting concepts or mixed messaging
- treat the documentation set as part of the implementation context, not as an afterthought

## Practical Default Expectations
When working on TradeEvidence, assume the following:
- the trader owns the final decision
- the product should remain explainable and transparent
- scoring and analysis should be understandable
- the experience should support disciplined thinking, not automated certainty
- decisions should be grounded in evidence and documented context

---

## TODO

### High
- What decision must be made first to unblock the next milestone?
- What user or product risk is most urgent to resolve?
- Which requirement is still ambiguous and needs stakeholder input?

### Medium
- What implementation choice should be clarified before development begins?
- What additional product or UX detail should be defined next?
- Which trade-off should be documented before the feature is prioritized?

### Low
- What future enhancement would benefit from early documentation?
- What minor detail should be captured as the product evolves?
- What open question is useful to keep visible for later refinement?

## Related Documents
- [00-PRD.md](00-PRD.md)
- [02-Principles.md](02-Principles.md)
- [03-Architecture.md](03-Architecture.md)
- [04-Design-System.md](04-Design-System.md)
- [12-Engineering-Standards.md](12-Engineering-Standards.md)
