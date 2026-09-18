# Dashboard v1 Baseline

**Status:** Approved Baseline  
**Approved:** 2026-07-14  
**Requirement Amendment:** 2026-09-17
**Image:** [Dashboard-v1-Baseline.png](Dashboard-v1-Baseline.png)

## Purpose

This prototype is the first approved authenticated homepage for TradeEvidence.

It is an orientation and navigation experience, not the full research product. Its purpose is to help a user quickly understand today's market, identify a small number of relevant items, and choose what they want to accomplish next.

## Approved Layout

### Direct Symbol Lookup

The prominent search control in the page header is an approved MVP research entry point. A user can enter a symbol and open its Decision Workspace when that symbol exists in the latest accepted analytical run. The control is not limited to filtering the opportunity cards shown on the page.

MVP lookup uses existing published evidence only. It does not run the analytics engine or fetch new market data during the request. The interface must clearly distinguish a resolved symbol from an invalid symbol, a symbol not present in the current run, incomplete evidence, or an unavailable run.

### Today's Briefing

A prominent hero section containing:

- Market environment
- Plain-English market interpretation
- Confidence
- Risk
- Market regime
- Theme of the day

### What Would You Like to Do Today?

A clear set of intent-driven actions, such as:

- Research opportunities
- Review positions
- Review portfolio
- Learn today's market
- Journal and reflect
- Ask TradeEvidence

### Evidence-Aligned Opportunities

A wide, compact section containing a small number of opportunities and why each deserves review.

Full lists and dense security tables are intentionally excluded.

### Supporting Intelligence

Compact modules:

- Market statistics
- Interesting setups
- Sector heat map
- Recent alerts

These occupy the middle and lower portions of the page without dominating the experience.

### Ask TradeEvidence

A large, prominent AI panel replaces the philosophy quote area.

The AI experience is not duplicated elsewhere on the homepage.

## Decisions Embodied in the Prototype

- Market context is universal.
- The homepage translates data into understanding.
- User intent is a first-class navigation mechanism.
- Direct symbol research is available from the homepage header.
- AI assistance is prominent.
- Homepage content is summarized.
- Dedicated workspaces contain detail.
- Large stock tables were removed.
- Sector heat map remains compact.
- Market statistics and alerts remain useful supporting information.

## Known Limitations

- Uses illustrative rather than real data.
- No final mobile layout.
- No personalized decision queue.
- No user-profile adaptation.
- Opportunity cards require further content design.
- Direct lookup covers the latest published analytical universe, not the full market or on-demand analysis.

## Future Evolution

### Phase 2

- Persona-based templates
- Contextual AI suggestions
- Personal decision queue
- Watchlist and portfolio intelligence

### Phase 3

- User-customizable widgets
- Adaptive summaries
- Milestone and Decision Journal reminders

## Relationship to the Decision Workspace

The homepage is the front door.

The Decision Workspace is where the user evaluates an opportunity or position in depth.
