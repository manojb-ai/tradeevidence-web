# Changelog

## [Unreleased]

### Added
- Founder guided-language v2 with standardized Trend Structure, Daily Momentum,
  Weekly Momentum, multi-timeframe education, and symbol-specific 21 EMA/50
  SMA reassessment references; founder verification accepted this version as
  the continuing MVP presentation baseline.
- Server-only, file-backed Candidate 2 publication adapter with contract and
  run-integrity validation, deterministic CI fallback, and focused tests.
- Real-data founder-review Homepage and symbol Workspace for the September 1
  Candidate 2 run, with explicit unavailable context and publication warnings.
- Read-only, checkpointed IBKR contract-reference discovery for variable
  Thinkorswim universes, with provider-boundary share-class translation, raw
  classification lineage, ambiguity protection, and instrument-reference
  output.
- Read-only, loopback-only IBKR historical-data acquisition adapter for the 14
  approved market and sector context ETFs, including deterministic CSV output,
  adjusted-close handling, validation tests, and founder operating guidance.
- Word operating guide covering IBKR setup and acquisition, CSV validation,
  Candidate 2's current consumption boundary, and the planned context adapter.
- Compact founder practice runbook for repeating the Thinkorswim, IBKR, and
  Candidate 2 local data workflow with validation and troubleshooting steps.
- Founder MVP preview with an illustrative Today's Briefing, deterministic
  opportunity cards, and symbol-specific Decision Workspaces.
- Approved founder-MVP delivery plan that advances product slices and assurance
  controls in parallel while preserving Level 3 boundaries.
- Approved Vertical Slice 01 Delivery Foundation construction contract.
- Local formatting, type, web-test, analytics-test, documentation-link, and
  aggregate validation commands.
- Initial Vitest and React Testing Library product-boundary test.
- Read-only GitHub quality workflow, risk-aware pull-request template, baseline
  tracked-secret check, and repository-protection guidance.

### Changed
- Reworked Devil's Advocate and Thesis Invalidation into beginner-first guided
  explanations with plain-language takeaways, why-it-matters context, and
  expandable exact engine wording.
- Added publication-time price, company, exchange, and currency to the
  candidate Decision Workspace and reorganized it around the approved
  context-first Decision Workspace section hierarchy.
- Expanded the approved canonical instrument types to preserve the security
  forms observed in the founder's real IBKR discovery instead of mislabeling
  them as common stock or ETF.
- Made the founder symbol universe explicitly variable per Thinkorswim export
  and advanced the current M0 acquisition target to the completed 2026-09-01
  session; the validated IBKR context history now contains 10,514 rows.
- Refreshed the locked browser-compatibility toolchain to resolve newly
  published high-severity `browserslist` advisories detected by the protected
  pull-request dependency audit.
- Activated the GitHub `main` protection ruleset after the first remote quality
  workflow passed, requiring pull requests, validation, current branches,
  resolved conversations, and linear history while blocking deletion and force
  pushes and retaining an administrator emergency bypass.
- Updated Next.js and its ESLint configuration to the security-fixed 16.3.3
  release.
- Removed build-time Google Font downloads so production builds do not require
  an unapproved external request.

## [v0.1] - 2026-07-08

### Added
- Next.js app created
- Landing page created
- GitHub/Vercel deployment established
- Product documentation established
