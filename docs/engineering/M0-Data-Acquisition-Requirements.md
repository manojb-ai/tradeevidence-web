# M0 Data Acquisition Requirements

- **Status:** Approved for Founder Data Collection
- **Version:** 1.1
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-09-01
- **AI-DLC Level:** Level 3 - Controlled
- **Target Market Date:** 2026-09-01
- **Related Documents:** [M0-Real-Data-Contract-Assessment.md](M0-Real-Data-Contract-Assessment.md), [MVP-Implementation-Spec.md](MVP-Implementation-Spec.md), [MVP-Data-Schema.md](MVP-Data-Schema.md)

## Purpose

Define the exact founder-supplied files needed to turn the latest technical
evidence run into a richer local founder-review dataset without inventing
market context, sector context, instrument identity, or prices.

These acquisition files are local market-data exports. They must be placed
under an ignored local input directory and must not be committed. Empty
templates and sanitized fixtures may be committed separately.

## Delivery Folder and File Names

Create this local folder:

```text
analytics-engine/input/2026-09-01/
```

Place these files in it:

```text
2026-09-01-symbol-evidence.csv
2026-09-01-context-snapshots.csv
2026-09-01-context-daily-history.csv
2026-09-01-instrument-reference.csv
2026-09-01-sector-membership.csv
2026-09-01-run-metadata.csv
```

Each acquisition uses the founder's current Thinkorswim universe export. The
universe size is discovered from that file and is not fixed: one run may
contain 500 symbols, another 633, and another 1,000. Downstream validation must
reconcile to the exact unique symbols in the current source file rather than a
historical expected count.

## File 1 — Symbol Technical Evidence

**File:** `2026-09-01-symbol-evidence.csv`

**Symbols:** every unique symbol in the founder's current Thinkorswim export.
There is no fixed required symbol count.

Required existing headers:

```csv
Symbol,Last,Net Chng,%Change,StellarEvDaily,StellerEvWeekly,StellarEvMonthly,StellarOrDaily,StellerOrWeekly,ADX,Impl Vol,SMA200,SMA50,EMA21
```

The historical `Steller` spelling in two exported headers is accepted by the
current adapter. Do not manually “fix” the export unless the adapter and tests
change together.

## File 2 — Current Context Snapshots

**File:** `2026-09-01-context-snapshots.csv`

Export the same columns and indicator configuration used by the symbol file.

Required symbols, exactly 14:

```text
SPY
QQQ
IWM
XLB
XLC
XLE
XLF
XLI
XLK
XLP
XLRE
XLU
XLV
XLY
```

Required headers:

```csv
Symbol,Last,Net Chng,%Change,StellarEvDaily,StellerEvWeekly,StellarEvMonthly,StellarOrDaily,StellerOrWeekly,ADX,Impl Vol,SMA200,SMA50,EMA21
```

Roles:

| Symbol | Role |
|---|---|
| SPY | Broad U.S. market and relative-strength benchmark |
| QQQ | Nasdaq/growth context benchmark |
| IWM | U.S. small-cap context benchmark |
| XLB | Materials sector representative |
| XLC | Communication Services sector representative |
| XLE | Energy sector representative |
| XLF | Financials sector representative |
| XLI | Industrials sector representative |
| XLK | Information Technology sector representative |
| XLP | Consumer Staples sector representative |
| XLRE | Real Estate sector representative |
| XLU | Utilities sector representative |
| XLV | Health Care sector representative |
| XLY | Consumer Discretionary sector representative |

## File 3 — Context Daily History

**File:** `2026-09-01-context-daily-history.csv`

**Symbols:** the same 14 context symbols listed above.

**Range:** at least two completed years through 2026-09-01. A recommended
capture range begins before 2024-09-01 so later horizon definitions have
adequate warmup history.

Required headers:

```csv
Symbol,Date,Open,High,Low,Close,AdjustedClose,Volume
```

Requirements:

- one row per symbol per completed regular trading session;
- ISO date format `YYYY-MM-DD`;
- prices as plain decimal numbers without currency symbols or commas;
- volume as a nonnegative whole number;
- `AdjustedClose` must reflect the provider's consistent split/distribution
  adjustment policy;
- unadjusted `Close` and `AdjustedClose` must remain separate;
- newest date must be 2026-09-01, the completed regular-session market date; and
- missing values remain blank and are never replaced with zero.

This history supports versioned trend, momentum, and each sector ETF's relative
strength versus SPY. It does not change the symbol Technical Evidence Score.

### Approved founder acquisition helper

The read-only `analytics-engine/fetch_ibkr_history.py` adapter may obtain this
file from a founder-operated, local Interactive Brokers TWS session. This does
not change the Phase 1 authority of the resulting CSV and does not permit the
Evidence Engine or website to depend directly on IBKR. The helper is restricted
to loopback connections, the 14 approved context symbols, completed
regular-session daily bars, and historical market-data requests. Account,
portfolio, position, execution, and order data are outside its scope.
The adapter records U.S. ETF volume in shares by converting IBKR's negotiated
100-share lot values and documents that IBKR historical volume is filtered.

## File 4 — Instrument Reference

**File:** `2026-09-01-instrument-reference.csv`

**Symbols:** all unique symbols discovered in the current symbol-evidence file
plus the 14 context symbols. A symbol appearing in both groups is included once.

Required headers:

```csv
Symbol,CompanyName,Exchange,Currency,SecurityType,IsActive
```

Allowed requirements:

- `Symbol`: uppercase provider symbol used in the source files;
- `CompanyName`: display/legal issuer or fund name from the source;
- `Exchange`: canonical listing exchange such as `NYSE`, `NASDAQ`, or `NYSEARCA`;
- `Currency`: ISO 4217 code, expected `USD` for this universe;
- `SecurityType`: one of `COMMON_STOCK`, `DEPOSITARY_RECEIPT`, `REIT`, `ETF`,
  `MLP`, `REGISTERED_SHARE`, `CLOSED_END_FUND`, or `TRACKING_STOCK`; and
- `IsActive`: `true` or `false`.

Do not guess a company name, exchange, currency, or security type. Leave an
unknown field blank and retain its missing status for validation.

Currency remains required even when the current universe is expected to be
USD. It is part of contract identity and guards against accidentally resolving
a same-symbol foreign listing, ADR mismatch, or otherwise incomparable price
series. A non-USD result is a validation exception and is never silently
converted.

### Approved founder reference-discovery helper

The read-only `analytics-engine/fetch_ibkr_reference.py` adapter may derive the
variable symbol universe from the current symbol-evidence CSV and request local
IBKR contract details. It checkpoints the instrument-reference contract and a
separate raw discovery file containing IBKR security type, stock type,
category, subcategory, industry, conId, resolution status, and diagnostic
message. Provider classifications are preserved as IBKR taxonomy and must not
be represented as GICS. Thinkorswim share-class notation is translated only at
the provider boundary; canonical source symbols remain unchanged.

## File 5 — Sector Membership

**File:** `2026-09-01-sector-membership.csv`

**Symbols:** every common-stock symbol in the current symbol-evidence file,
regardless of that file's total count. Context ETFs do not require issuer-sector
membership in this file.

Required headers:

```csv
Symbol,SectorCode,SectorName,ClassificationSystem,ValidFrom,ValidTo
```

Canonical sector codes and names:

| SectorCode | SectorName | Representative |
|---|---|---|
| MATERIALS | Materials | XLB |
| COMMUNICATION_SERVICES | Communication Services | XLC |
| ENERGY | Energy | XLE |
| FINANCIALS | Financials | XLF |
| INDUSTRIALS | Industrials | XLI |
| INFORMATION_TECHNOLOGY | Information Technology | XLK |
| CONSUMER_STAPLES | Consumer Staples | XLP |
| REAL_ESTATE | Real Estate | XLRE |
| UTILITIES | Utilities | XLU |
| HEALTH_CARE | Health Care | XLV |
| CONSUMER_DISCRETIONARY | Consumer Discretionary | XLY |

Requirements:

- `ClassificationSystem`: use the actual source classification, such as
  `GICS`, rather than assuming one;
- `ValidFrom`: ISO date on which the classification became effective when
  known;
- `ValidTo`: blank for a currently active classification;
- one active sector per common stock for this MVP input; and
- unknown membership remains blank/unavailable rather than guessed.

Sector membership is required both to attach the correct sector context and to
enforce no more than two Homepage selections per sector.

## File 6 — Run Metadata

**File:** `2026-09-01-run-metadata.csv`

Exactly one data row is required.

Required headers:

```csv
MarketDate,AsOf,ExchangeTimezone,ObservationType,TradingSession,BarInterval,ObservationPoint,AdjustmentBasis,SourceName,SourceVersion,ExportedAt
```

Required/expected values for this acquisition:

| Field | Value or rule |
|---|---|
| MarketDate | `2026-09-01` |
| AsOf | official-close timestamp with timezone/offset, preferably ISO 8601 |
| ExchangeTimezone | `America/New_York` |
| ObservationType | `eod` |
| TradingSession | `regular` |
| BarInterval | `1d` |
| ObservationPoint | `official_close` |
| AdjustmentBasis | provider's exact adjustment policy; do not guess |
| SourceName | actual export/data source, for example `thinkorswim` |
| SourceVersion | source/export configuration version when available |
| ExportedAt | actual ISO 8601 export timestamp |

## Cross-File Validation Rules

- All current snapshots represent the same market date and regular-session
  close.
- Symbols are uppercase, trimmed, and unique within each current snapshot file.
- The imported unique-symbol count becomes the run's expected count; all
  classifications and downstream reference coverage reconcile to that count.
- All symbol-evidence records resolve to instrument reference rows.
- All common stocks resolve to one active sector or an explicit unavailable
  state.
- Every sector membership resolves to one of the 11 approved sector
  representatives.
- All 14 context symbols have a current snapshot and sufficient daily history.
- SPY is the only MVP sector relative-strength denominator.
- Current prices agree with the same-date history close subject to the declared
  adjustment basis.
- Files contain no duplicate header rows, report preambles after the header, or
  spreadsheet formulas.
- Missing data is blank, never `0`, `N/A`, `-`, or an invented value.

## Not Required for This Acquisition

- VIX, Treasury yields, commodities, currencies, or international indexes;
- options chains, Greeks, or additional implied-volatility history;
- intraday, tick, premarket, or after-hours data;
- fundamentals, earnings, analyst estimates, news, sentiment, or SEC filings;
- portfolio holdings, account values, transactions, or brokerage data;
- index-membership files for S&P 500, Nasdaq, or Russell 2000;
- corporate-action files when `AdjustedClose` is consistently provider-adjusted
  and the adjustment basis is declared; or
- AI training or conversation data.

Additional sources require a separately approved need, license, contract, and
validation rule.

## Delivery Checklist

- [ ] Six files use the exact filenames and header order.
- [ ] Context snapshot contains exactly the 14 approved symbols.
- [x] Context history covers at least two years through 2026-09-01.
- [ ] Instrument reference covers all unique symbol and context instruments.
- [ ] Sector membership covers every common stock or explicitly records the
      unavailable gap.
- [ ] Run metadata contains one row and declares adjustment/source identity.
- [ ] Files open successfully as UTF-8 CSV.
- [ ] No file has been committed to Git.

## Acquisition Progress

On 2026-09-01, the approved IBKR helper produced the ignored local
`2026-08-21-context-daily-history.csv` file from founder-operated TWS. The
result contains all 14 approved symbols, 744 completed daily sessions per
symbol (10,416 rows total), dates from 2023-09-05 through the canonical
2026-08-21 close, no duplicate symbol/date keys, and no invalid OHLC ranges.
This records validation evidence only; the local market-data file remains
uncommitted and the other acquisition files remain open.

Also on 2026-09-01, after the regular session completed, the helper produced
the ignored local `2026-09-01-context-daily-history.csv`. It contains all 14
approved symbols, 751 completed daily sessions per symbol (10,514 rows total),
dates from 2023-09-05 through the canonical 2026-09-01 close, no duplicate
symbol/date keys, and no invalid OHLC ranges. This is the current target-date
history for the founder export still to be supplied.

The founder then supplied `2026-09-01-symbol-evidence.csv` with 650 rows and
650 unique symbols. Candidate 2 consumed all 650 rows successfully; the run
produced 645 classified snapshots and five explicit `incomplete` snapshots.
The supplied context snapshot contains every approved context symbol and no
duplicates, plus DIA as a reported extra. DIA is retained in the local source
export but is outside the approved 14-symbol MVP context calculation unless a
future decision expands that contract.

The reference-discovery helper subsequently resolved 649 of the 650 current
symbols through read-only IBKR contract details. Every resolved contract is
USD and includes company name, primary exchange, and IBKR stock type. ERIXF is
the single explicit unresolved symbol because IBKR returned no security
definition. The raw universe includes 543 common stocks, 53 ADRs, 29 REITs, 11
ETFs, four MLPs, three New York registered shares, one closed-end fund, and one
tracking stock. The founder approved preserving these eight canonical types on
2026-09-01. The provider mapping is explicit and tested; an unknown future
provider type remains blank and requires review rather than being guessed.

After applying the approved mapping and provider-boundary share-class aliases,
the current instrument-reference output contains 546 `COMMON_STOCK`, 54
`DEPOSITARY_RECEIPT`, 29 `REIT`, 11 `ETF`, four `MLP`, three
`REGISTERED_SHARE`, one `CLOSED_END_FUND`, one `TRACKING_STOCK`, and the one
explicit unresolved ERIXF row.

## Next Actions After 2026-09-01 Session Close

1. Define and founder-review the versioned mapping from raw IBKR category,
   subcategory, and industry into the 11 canonical TradeEvidence sectors.
2. Generate and reconcile `2026-09-01-sector-membership.csv`, preserving
   unavailable states and raw provider lineage.
3. Replace the single-source run-metadata assumption with per-input source
   lineage for the Thinkorswim snapshots and IBKR history/reference files.
4. Implement the provider-independent context adapter and tests; context must
   remain inspectable alongside Candidate 2 and must not silently rewrite its
   classifications or Evidence Score.
5. Integrate the validated local publication bundle into the M0 Homepage and
   Decision Workspace adapter.
