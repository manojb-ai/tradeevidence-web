# MVP Implementation Specification

**Status:** Approved
**Version:** 1.0
**Owner:** Founder and Chief Software Architect
**Approved:** 2026-07-19
**AI-DLC Level:** Level 3 — Controlled

## Purpose

This specification defines the first implementation-ready TradeEvidence vertical slice. It translates the approved product model and Workshop #2 decisions into a bounded delivery contract. It does not validate the current analytical weights or authorize predictive, advisory, or transactional behavior.

## Slice Outcome

An authenticated self-directed trader can move from universal market orientation to an evidence-based review of a new bullish U.S. stock opportunity:

```text
Homepage
→ Today's Briefing
→ Evidence-Aligned Opportunity
→ Decision Workspace
→ Market and Sector Context
→ Technical Evidence and Devil's Advocate
→ Decision Confidence
→ Educational Strategy Alignment
→ Ask TradeEvidence
→ Before You Decide
```

TradeEvidence supports understanding and preparation. The user owns the decision.

## Approved Workshop Decisions

### W2-01 — Existing Analytical Engine as the Phase 1 Producer

The imported deterministic engine under `analytics-engine/` is the Phase 1 Analytical Data Producer. Its current behavior is preserved as a characterization baseline. The website consumes structured, versioned output and never parses the generated HTML report. Engine calculations remain outside presentation components and request-time web execution.

The current weights are explicit, versioned, testable hypotheses. They are not predictive or historically validated and cannot be described that way before the Evidence Engine workshop, tests, documentation, a ruleset update, and human approval.

### W2-02 — Linked Analytical Outputs

Each analytical run produces separate market-context, sector-context, and symbol-evidence outputs linked by one run manifest and `analysis_run_id`. A homepage-opportunity selection and validation report are derived artifacts in the same bundle. Market and sector context inform Decision Confidence; they do not silently alter the symbol's Technical Evidence Score.

Phase 1 sector context uses the 11 Select Sector SPDR representatives (XLB, XLC, XLE, XLF, XLI, XLK, XLP, XLRE, XLU, XLV, and XLY). Each sector must expose trend, momentum, relative strength versus SPY, supporting and contradicting evidence, freshness, and unavailable factors. Constituent breadth is optional until a reliable source exists.

### W2-03 — Score Semantics

Phase 1 uses three distinct concepts:

- **Technical Evidence Score:** strength, completeness, and internal consistency of evaluated symbol-level technical evidence.
- **Decision Confidence:** categorical assessment of how supportive the current context is for further consideration now.
- **Educational Strategy Alignment:** comparison of stock or options structures worth learning about under the available evidence.

Technical Evidence Score excludes market and sector context, entry location, options implied volatility, portfolio exposure, personal risk tolerance, and any recommendation. Strategy Alignment changes neither Technical Evidence Score nor Decision Confidence and is not execution suitability.

### W2-04 — Score Presentation and Completeness

Every user-facing Technical Evidence Score includes its numerical value, evidence-alignment band, coverage, freshness, supporting and contradicting contributions, unavailable factors, and engine/ruleset version.

| Score | Band | Meaning |
|---:|---|---|
| 80–100 | Strong alignment | Most evaluated technical evidence is mutually supportive |
| 65–79 | Constructive alignment | Evidence is generally supportive with meaningful limitations |
| 50–64 | Mixed evidence | Supporting and contradicting evidence are both material |
| 35–49 | Weak alignment | Technical support is limited or deteriorating |
| 0–34 | Low alignment | Evaluated evidence does not form a coherent bullish case |

Factors are classified as supporting, contradicting, neutral, unavailable, or not evaluated. Missing evidence is never treated as bearish evidence. Missing required inputs make the result `incomplete`; an incomplete result receives no normal opportunity classification. Required Phase 1 inputs are daily setup, daily momentum, weekly trend, current price, 21 EMA, 50 SMA, 200 SMA, and ADX. Monthly context is initially supplemental.

### W2-05 — MVP Vertical-Slice Journey

The primary user is an authenticated self-directed trader evaluating a new bullish stock opportunity. Existing-position review is deferred because it requires thesis history, entry price, position size, portfolio exposure, and journal context.

The homepage shows the current analytical timestamp, Today's Briefing, and a small set of Evidence-Aligned Opportunities. `Review evidence` opens `/workspace/{symbol}`. The workspace exposes context, Technical Evidence Score, all material contradictions, Devil's Advocate analysis, thesis-invalidation conditions already present in the snapshot, Decision Confidence, educational strategy comparisons, Ask TradeEvidence, and a non-transactional Before You Decide checklist.

Phase 1 exit actions are add to research watchlist, export or print a Decision Summary, return home, or review another symbol. Execution, persisted Decision Snapshots, journal entries, portfolio-aware sizing, brokerage integration, and public sharing are deferred.

Required states include current, stale, incomplete, missing market context, missing sector context, symbol not found, rejected analytical run, unavailable AI, no qualifying opportunity, and unauthenticated user. Deterministic evidence remains usable when AI is unavailable.

### W2-06 — Versioned Universe Strategy

The first slice uses the existing curated 300–400-stock universe. Every run records a versioned universe manifest, requested/processed/rejected counts, eligibility rules, and exclusions.

After validation, discovery may expand to filtered common operating-company equities listed on Nasdaq, NYSE, and NYSE American. OTC securities are excluded. ETFs other than approved context instruments, preferred shares, warrants, rights, units, test issues, unsuitable shells, insufficient-history symbols, and securities failing approved price/liquidity rules are provisionally excluded. Exact liquidity thresholds require observed data and human approval.

SPY, QQQ, IWM, and other index membership is dated metadata and a filter—not the permanent universe definition. Phase 1 analysis remains an offline batch operation; it never runs during a website request.

### W2-07 — Homepage Opportunity Selection

The product term is **Evidence-Aligned Opportunities**, replacing “Highest Conviction Opportunities.” The homepage displays up to five deterministic selections, with no more than two per sector and no reduction in evidence standards to fill space.

Candidates must be eligible, complete, current, explainable, at least Constructive Alignment, and have Decision Confidence other than Incomplete. Ordering uses score band, score, Decision Confidence, market alignment, sector alignment, completeness, freshness, and a deterministic tie-breaker. Each card shows the principal support and principal constraint. If no symbol qualifies, the page states that no symbol meets the current evidence-display criteria without implying a market forecast.

### W2-08 — Decision Confidence v1

Decision Confidence is deterministic and categorical:

| State | Meaning |
|---|---|
| Strong | Evidence and context are substantially aligned with no identified material constraint |
| Moderate | The decision is sufficiently informed, but meaningful limitations remain |
| Constrained | Timing, context, risk, or contradictions materially limit current preparedness |
| Incomplete | Required context is missing, stale, inconsistent, or invalid |

Strong is intentionally difficult to obtain. Constructive Technical Evidence caps confidence at Moderate; Mixed or weaker evidence and very extended location cap it at Constrained; missing required data forces Incomplete; contradicting market and sector context together force Constrained. Every state exposes supporting, constraining, and unavailable factors plus its model version.

Decision Confidence is not probability of profit, prediction, recommendation, or personalized suitability. Phase 1 does not consider account size, holdings, concentration, tax circumstances, experience, personal risk tolerance, or intended holding period. AI cannot alter the deterministic state.

### W2-09 — Ask TradeEvidence v1

Ask TradeEvidence is a provider-independent, snapshot-grounded educational explanation layer. It may explain or compare recorded evidence, Decision Confidence, context, terminology, general strategy mechanics, Devil's Advocate analysis, and deterministic invalidation conditions.

It may not create evidence, modify scores, recommend buying/selling/holding/entering/exiting, select a personalized strategy, recommend position size, invent price targets/stops/entries, predict movement, estimate unsupported probability, claim predictive validity, invent missing data, or imply personalized suitability.

Answers identify evidence used, a material counterpoint, missing or unevaluated information, freshness when relevant, and traceable snapshot identifiers. Phase 1 uses bounded snapshot context and approved educational content, no live internet augmentation, session-only conversation, no portfolio or journal context, and safe degradation. Operational metadata records run/snapshot IDs, workflow and prompt versions, provider/model identifier, timestamp, intent category, guardrail result, latency, and failure status while avoiding unnecessary personal content.

### W2-10 — Immutable, Atomic Snapshot Publication and Retention

Each candidate run bundle contains:

```text
run-manifest.json
market-context.json
sector-context.json
symbol-evidence.json
homepage-opportunities.json
validation-report.json
report.html (optional application input)
```

Runs progress through Generated → Staged → Validated → Human Approved → Published → Superseded, or become Rejected. Automated gates cover file integrity, shared identity/timestamps/versions, universe reconciliation, analytical consistency, score/contribution agreement, confidence rules, opportunity qualification, and prohibited language. Phase 1 production publication requires founder approval.

Publication atomically changes a current-run pointer only after validation and approval. The application sees either the complete previous run or the complete new run, never a mixture. Published records are immutable; corrections require a new versioned run. Git stores code, schemas, sanitized fixtures, documentation, and tests—not recurring market-data exports.

The permanent analytical system of record uses immutable object storage for accepted source/run bundles. A query-optimized operational database stores indexed current and historical snapshots, contributions, selection results, and outcome measurements. Cache/CDN layers serve precomputed current views. User requests never scan the raw archive. Provider choices remain deferred behind `SnapshotStore` and Market Data Service abstractions.

The official regular-session close is the canonical Phase 1 observation. End-of-day, intraday, and real-time observations remain separate and are compared like-for-like. Published scores and enough market data to reproduce them are retained permanently. Tick or second-level data is retained only for an approved need and compatible license. [ADR-004](../governance/decisions/ADR-004-Canonical-Market-Observations-and-Retention.md) is authoritative for observation identity and retention.

## Performance and Reliability Targets

These are targets to validate, not guarantees:

- Homepage core content visible in approximately 1.5 seconds under normal broadband conditions.
- Homepage LCP below 2.5 seconds at the 75th percentile.
- Cached homepage-data response below 200 ms at the 95th percentile.
- Initial homepage-data payload approximately 200 KB or less.
- Uncached Decision Workspace response below 500 ms at the 95th percentile; frequently accessed symbols below 200 ms when cached.
- Historical chart series load on demand as compact data.
- Publication does not slow the active site, and failure preserves the previous published run.

These targets must be refined with representative environments and measured during Delivery Readiness.

## Deferred Decisions

- Physical database schema and indexes (Workshop #3)
- API payloads and error contract (Workshop #4)
- Concrete frontend/backend framework boundaries and caching implementation (Workshop #5)
- Validated score weights and full outcome methodology (Workshop #6)
- AI provider, prompt implementation, evaluations, cost, and latency budgets (Workshop #7)
- Authentication provider, production storage vendors, security controls, SLOs, and release approval (Workshop #8)

## Human Approval Boundaries

Human approval remains required for scoring semantics or weights, advisory-language boundaries, production snapshot publication during Phase 1, market-data licensing, material security risk, vendor commitments, and releases.
