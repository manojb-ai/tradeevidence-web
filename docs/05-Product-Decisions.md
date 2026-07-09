# 05. Product Decisions

This document records important product and architecture decisions for TradeEvidence.

## Decision Log

| Decision | Reason | Alternatives considered | Status |
| --- | --- | --- | --- |
| Support Light, Dark, and System themes | Traders use the product in different environments and contexts. Dark mode suits active dashboards, while light mode supports reports and marketing surfaces. | Single-theme interface; dark-only; light-only | Proposed |
| Use Next.js | Next.js supports a modern React-based product experience and aligns with the current web stack. | Plain React; other frameworks | Accepted |
| Deploy with Vercel | Vercel provides a straightforward deployment path for a Next.js product. | Self-hosted; other cloud platforms | Accepted |
| Use GitHub for source control | GitHub supports collaboration, versioning, and project management. | GitLab; Bitbucket | Accepted |
| Deliver a desktop-first experience | Trading workflows benefit from dense information layout and multi-panel analysis. | Mobile-first; equal-first | Accepted |
| Make scoring explainable | Traders need to understand why a score exists and what evidence supports it. | Black-box scoring; opaque AI-only scoring | Accepted |
| Emphasize evidence instead of recommendations | TradeEvidence should remain non-advisory and support user judgment. | Recommendation-driven UX; automated alerts as decisions | Accepted |
| Separate public website from authenticated application | Marketing, onboarding, and the trading workspace have different goals and responsibilities. | Single unified experience | Accepted |

## Guidance for Future Decisions
Each future decision should state:
- the decision itself
- the reason for choosing it
- alternatives considered
- the current status
- any follow-up work required

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
- [03-Architecture.md](03-Architecture.md)
- [06-Roadmap.md](06-Roadmap.md)
- [00-PRD.md](00-PRD.md)
