# M0 Real-Data Contract Assessment

- **Status:** Active
- **Version:** 1.0
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-09-01
- **AI-DLC Level:** Level 3 - Controlled
- **Related Documents:** [MVP-Delivery-Program-Plan.md](MVP-Delivery-Program-Plan.md), [M0-Data-Acquisition-Requirements.md](M0-Data-Acquisition-Requirements.md), [MVP-Implementation-Spec.md](MVP-Implementation-Spec.md), [Evidence-Engine-Specification.md](Evidence-Engine-Specification.md)

## Assessed Run

- Local artifact: `analytics-engine/output/2026-08-23-watchlist-v2/evidence_v2_20260823_175131Z.json`
- Source file: `2026-08-23-watchlist.csv`
- Generated: `2026-08-23T12:51:31.277203-05:00`
- Market date: `2026-08-21`
- Rows evaluated: 633
- Source checksum: `b8336dc7034caba0fdc368aa1129919fedf97ea420677686b3c8105772c23d15`
- Engine: `TradeEvidence Evidence Engine v2.0.0-candidate.2`
- Ruleset: `direction-aware-technical-evidence-v0.2.0`
- Output schema: `technical-evidence-snapshot-v2`

The local artifact remains ignored and is not committed. Generated reports and
local market-data exports remain outside source control.

## Classification Reconciliation

| Classification | Count |
|---|---:|
| Bullish | 187 |
| Bullish watch | 148 |
| Bearish | 49 |
| Bearish watch | 149 |
| Neutral | 91 |
| Incomplete | 9 |
| **Total** | **633** |

## Available Contract Elements

- source, generated, market, and as-of identity;
- instrument and observation symbol;
- complete/incomplete status;
- bullish, bearish, watch, and neutral classification;
- alignment score, band, coverage, and directional/neutral ledgers;
- versioned factor records with observed state, contribution, effect,
  explanation code, rendered explanation, and unavailable reason;
- principal support and contradiction;
- deterministic summary and invalidation conditions; and
- engine, ruleset, input/output schema, language-template, source version, and
  source checksum lineage.

## Missing MVP Contract Elements

- a first-class analysis-run identifier and run manifest;
- requested, processed, rejected, eligibility, exclusion, and universe-manifest
  reconciliation;
- stable canonical instrument records beyond the transitional
  `legacy-symbol:{symbol}` identity;
- company name, exchange, currency, and canonical publication-time price;
- market context and sector context;
- sector identity needed to enforce the Homepage maximum of two selections per
  sector;
- Decision Confidence and its support, constraints, unavailable reasons, and
  model version;
- strategy-alignment records;
- persisted Homepage qualification, rank, why-selected explanation, and
  validation report;
- artifact manifest and per-artifact checksums; and
- formal staged/validated/approved/published lifecycle records.

## Governing Consequence

The approved Homepage contract requires complete, current, explainable evidence
at least at Constructive Alignment, Decision Confidence other than Incomplete,
and the sector-diversity rule. Because Decision Confidence and sector context
are absent, no record from this bundle can yet be represented as an approved
Evidence-Aligned Opportunity.

The current engine and ruleset also identify themselves as Candidate 2. The
Definition of Done retains Candidate 2 as experimental until outcome
methodology, regression evidence, descriptions, versions, and production
ruleset receive explicit human approval.

## Approved-Boundary M0 Approach

M0 may load this bundle locally for founder review if every relevant screen:

- identifies it as candidate technical evidence rather than a production
  publication;
- shows the actual market date, source, versions, coverage, and completeness;
- labels market context, sector context, and Decision Confidence unavailable;
- does not call technically strong records approved Homepage opportunities;
- does not invent company, price, sector, confidence, strategy, or context;
- does not recalculate the authoritative alignment score; and
- remains unavailable to external users until the required publication and
  approval gates pass.

## Implementation Sequence

1. Implement a server-only, file-backed repository configured with a local
   artifact path and a deterministic fixture fallback for CI.
2. Validate bundle shape, counts, same-run fields, versions, factor-ledger
   reconciliation, and source checksum consistency.
3. Expose a founder-review list of candidate technical evidence with filters for
   classification, completeness, and symbol.
4. Map each symbol to a candidate Decision Workspace that shows only available
   evidence and explicit unavailable states.
5. Add positive and negative adapter, route, disclosure, and run-integrity tests.
6. Extend the engine bundle with the missing approved contract elements in
   separately reviewed vertical slices.
7. Obtain founder approval of the production ruleset and first formal
   publication before changing the candidate-review surface into the approved
   Homepage opportunity experience.

## Implementation Update — 2026-09-17

The file-backed adapter and founder-review surface now load the ignored
September 1 Candidate 2 artifact. The adapter validates root shape, row-count
reconciliation, same-run market/version/checksum fields, and each result's
directional ledger before creating application view models. The Homepage shows
at most five complete directional records in stable score-then-symbol review
order without recalculating an Evidence Score. This ordering is only a founder
review aid; it is not the approved Homepage qualification model.

The Decision Workspace resolves every artifact symbol and displays the
engine-provided factor explanations and reassessment condition. Both screens
label Candidate 2 experimental, distinguish it from a published run, and show
market context, sector context, and Decision Confidence as unavailable. A
fictional fallback keeps clean-checkout validation operable when ignored local
data is absent.

Sequence items 1 and 4 are complete. Items 2, 3, and 5 have their first tested
slice but still require the formal manifest/checksums, review filters, and full
negative route/disclosure coverage. Items 6 and 7 remain release gates. The
next delivery slice is sector normalization and the provider-independent
context adapter; neither may silently rewrite Candidate 2 classifications or
scores.

The founder review now joins the September 1 symbol-evidence and instrument
reference inputs by exact symbol. This supplies the publication-time price,
company name, exchange, and currency without altering the Candidate 2 score or
factor record. Missing or duplicate join records fail explicitly rather than
being guessed.

Beginner-facing evidence, Devil's Advocate, and invalidation copy is versioned
separately as `founder-review-guided-v2`. It deterministically translates the recorded
factor code/state and engine invalidation condition while retaining the exact
Candidate 2 text for technical inspection. This presentation layer does not
change the ruleset, score, classification, or authoritative engine template.
The founder version reads the actual 21-day EMA and 50-day SMA from the same
symbol input row. Its two-close persistence convention is an explicit testing
hypothesis and is not represented as an already-observed condition.
