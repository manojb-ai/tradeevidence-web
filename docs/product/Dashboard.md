# Homepage

## Purpose
The authenticated homepage is the front door to TradeEvidence. It exists to orient the user, translate market data into useful context, and help the user decide what to do next without overwhelming them with a dense research terminal.

## Approved Prototype

The approved Homepage v1 baseline is the first authenticated homepage experience for the product. It is an orientation and navigation experience rather than the full research workspace. Its purpose is to help a user quickly understand today's market, identify a small number of relevant items, and choose a next action.

### Today's Briefing
Today's Briefing is the hero section of the homepage. It provides the user's first plain-English market orientation with the clearest available context on regime, risk, themes, and confidence.

### Homepage Philosophy
The homepage should summarize rather than reproduce the full product. It teaches, guides, and invites action while leaving deeper analysis and decision preparation to dedicated workspaces.

### User Intent Section
A prominent “What would you like to do today?” section allows users to choose the next step based on their immediate need. Typical intents include research, review, portfolio review, learning, journaling, or asking TradeEvidence for help.

### Direct Symbol Lookup
A prominent symbol lookup in the homepage header lets a user open the current published evidence for a symbol directly. This is a research entry point, not merely a filter for the opportunities shown on the homepage.

For MVP, lookup is limited to symbols included in the latest accepted analytical run. It normalizes a submitted symbol, resolves it against that run, and opens the symbol's Decision Workspace even when the symbol was not selected as an Evidence-Aligned Opportunity. It does not acquire market data, invoke the analytics engine, or generate a classification during the website request.

The experience must identify the symbol and show its available price and evidence freshness in the Decision Workspace. Invalid symbols, symbols absent from the published run, incomplete evidence, and an unavailable published run must produce explicit states rather than guessed, substituted, or fabricated information.

### AI Panel
The homepage includes one prominent AI experience, centered around Ask TradeEvidence. The AI experience is visible and useful at entry, but it remains supportive rather than prescriptive.

### Evidence-Aligned Opportunities
The homepage highlights a small number of Evidence-Aligned Opportunities with plain-English reasons and visible constraints. The goal is to support attention and focus rather than imply conviction or reproduce a full watchlist or security table.

### Supporting Intelligence
Supporting modules sit below the primary actions and include market statistics, recent alerts, interesting setups, sector heat, and compact breadth indicators. These modules add context without competing with the main briefing and intent sections.

### Future Enhancements
Future versions may add persona-based templates, more adaptive summaries, a personalized decision queue, and contextual AI suggestions. These enhancements should refine the experience without changing the core philosophy of orientation and action.

## Relationship to the Design System and Decision Workspace
The homepage should feel consistent with the broader design system and reinforce the product's visual language of clarity, calm, and focus. It should also lead naturally into the Decision Workspace, which is the place for deeper evidence review, counter-evidence, risk framing, and decision preparation.

## Related Documents
- [../03-Architecture.md](../03-Architecture.md)
- [../04-Design-System.md](../04-Design-System.md)
- [../06-Roadmap.md](../06-Roadmap.md)
- [../07-Decision-Workspace-Concept.md](../07-Decision-Workspace-Concept.md)
- [../prototypes/Dashboard-v1-Baseline.md](../prototypes/Dashboard-v1-Baseline.md)
