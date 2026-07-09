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
| Emphasize evidence instead of decision directives | TradeEvidence should remain non-advisory and support user judgment. | Decision-directive UX; automated alerts as decisions | Accepted |
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
- Record decisions around backend architecture and authentication provider selection.
- Record decisions around data sources and the initial scoring model approach.

### Medium
- Document the decision criteria for future AI-assisted features.
- Capture any trade-offs between breadth of features and clarity of the user experience.

### Low
- Add follow-up notes whenever a decision is revisited or superseded.

## Related Documents
- [03-Architecture.md](03-Architecture.md)
- [06-Roadmap.md](06-Roadmap.md)
- [00-PRD.md](00-PRD.md)
