# M0 Data Acquisition Requirements

- **Status:** Approved for Founder Data Collection
- **Version:** 1.0
- **Owner:** Founder and Chief Software Architect
- **Last Updated:** 2026-09-01
- **AI-DLC Level:** Level 3 - Controlled
- **Target Market Date:** 2026-08-21
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
analytics-engine/input/2026-08-21/
```

Place these files in it:

```text
2026-08-21-symbol-evidence.csv
2026-08-21-context-snapshots.csv
2026-08-21-context-daily-history.csv
2026-08-21-instrument-reference.csv
2026-08-21-sector-membership.csv
2026-08-21-run-metadata.csv
```

The existing `2026-08-23-watchlist.csv` already satisfies the first file's
purpose. Copying or renaming it locally to
`2026-08-21-symbol-evidence.csv` makes the market date explicit; do not modify
its values.

## File 1 — Symbol Technical Evidence

**File:** `2026-08-21-symbol-evidence.csv`

**Symbols:** the exact 633 unique symbols already present in
`2026-08-23-watchlist.csv`.

Required existing headers:

```csv
Symbol,Last,Net Chng,%Change,StellarEvDaily,StellerEvWeekly,StellarEvMonthly,StellarOrDaily,StellerOrWeekly,ADX,Impl Vol,SMA200,SMA50,EMA21
```

The historical `Steller` spelling in two exported headers is accepted by the
current adapter. Do not manually “fix” the export unless the adapter and tests
change together.

## File 2 — Current Context Snapshots

**File:** `2026-08-21-context-snapshots.csv`

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

**File:** `2026-08-21-context-daily-history.csv`

**Symbols:** the same 14 context symbols listed above.

**Range:** at least two completed years through 2026-08-21. A recommended
capture range is 2024-08-01 through 2026-08-21 so later horizon definitions have
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
- newest date must be 2026-08-21, not the weekend export date; and
- missing values remain blank and are never replaced with zero.

This history supports versioned trend, momentum, and each sector ETF's relative
strength versus SPY. It does not change the symbol Technical Evidence Score.

## File 4 — Instrument Reference

**File:** `2026-08-21-instrument-reference.csv`

**Symbols:** all 633 symbol-evidence symbols plus the 14 context symbols. A
symbol appearing in both groups is included once.

Required headers:

```csv
Symbol,CompanyName,Exchange,Currency,SecurityType,IsActive
```

Allowed requirements:

- `Symbol`: uppercase provider symbol used in the source files;
- `CompanyName`: display/legal issuer or fund name from the source;
- `Exchange`: canonical listing exchange such as `NYSE`, `NASDAQ`, or `NYSEARCA`;
- `Currency`: ISO 4217 code, expected `USD` for this universe;
- `SecurityType`: `COMMON_STOCK` or `ETF` for the current scope; and
- `IsActive`: `true` or `false`.

Do not guess a company name, exchange, currency, or security type. Leave an
unknown field blank and retain its missing status for validation.

## File 5 — Sector Membership

**File:** `2026-08-21-sector-membership.csv`

**Symbols:** every common-stock symbol in the 633-symbol evidence file. Context
ETFs do not require issuer-sector membership in this file.

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

**File:** `2026-08-21-run-metadata.csv`

Exactly one data row is required.

Required headers:

```csv
MarketDate,AsOf,ExchangeTimezone,ObservationType,TradingSession,BarInterval,ObservationPoint,AdjustmentBasis,SourceName,SourceVersion,ExportedAt
```

Required/expected values for this acquisition:

| Field | Value or rule |
|---|---|
| MarketDate | `2026-08-21` |
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
- The 633-symbol evidence count and classification reconciliation remain
  unchanged.
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
- [ ] Context history covers at least two years through 2026-08-21.
- [ ] Instrument reference covers all unique symbol and context instruments.
- [ ] Sector membership covers every common stock or explicitly records the
      unavailable gap.
- [ ] Run metadata contains one row and declares adjustment/source identity.
- [ ] Files open successfully as UTF-8 CSV.
- [ ] No file has been committed to Git.
