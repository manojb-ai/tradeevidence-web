# TradeEvidence Rules

## Engine Version
TradeEvidence Decision Engine v1.1  
Ruleset: Opportunity-First + Location Rules v1.2

## Purpose
TradeEvidence is an educational market-analysis and strategy-research engine. It is not financial advice.

## Inputs
The fast engine reads structured Thinkorswim CSV columns:

- Symbol
- Last
- StellarEvDaily
- StellerEvWeekly
- StellarEvMonthly
- StellarOrDaily
- StellerOrWeekly
- ADX
- Impl Vol
- sma200
- sma50
- ema21

`Last` is treated as the current price.

## Derived Entry Zone

The engine calculates:

```text
% from 21 EMA  = (Last - ema21) / ema21 * 100
% from 50 SMA  = (Last - sma50) / sma50 * 100
% from 200 SMA = (Last - sma200) / sma200 * 100
```

Entry Zone:

| % from 21 EMA | Label |
|---:|---|
| below -5% | Below 21 EMA |
| -5% to -2% | Pullback below 21 EMA |
| -2% to +2% | Near 21 EMA |
| +2% to +5% | Healthy extension |
| +5% to +10% | Extended |
| > +10% | Very Extended |

## Trend Structure

Bull-aligned trend is defined as:

```text
Last > ema21 > sma50 > sma200
```

This is displayed as:

```text
Bull trend: Price > 21 EMA > 50 SMA > 200 SMA
```

## Decision Philosophy

Daily setup and daily momentum lead the decision. Weekly and monthly conditions are used as support or vetoes. Directional Strength and Entry Zone determine whether a setup is high quality, speculative, or better treated as WATCH.

## ADX / Directional Strength

| ADX | Label |
|---:|---|
| < 15 | Weak |
| 15–20 | Emerging |
| 20–30 | Healthy |
| 30–40 | Strong |
| > 40 | Very Strong |

Weak ADX reduces confidence. It does not always veto a signal, but weak ADX generally means price may remain range-bound or take longer to move.

## Option Premium

| IV | Label |
|---:|---|
| <20 | Very Low |
| 20–30 | Low |
| 30–40 | Medium |
| 40–60 | High |
| >60 | Very High |

## Location-Based Strategy Adjustments

When price is near the 21 EMA, directional strategies such as Bull Call Debit Spread and Long Call receive more favorable scores.

When price is Extended or Very Extended, the engine reduces chasing-style strategies and favors defined-risk or premium-sensitive strategies such as Put Credit Spreads and Covered Calls.

## Iron Condor Logic

Iron Condors should not be recommended merely because ADX is low. The engine favors Iron Condors only when:

- Directional Strength is weak,
- Option Premium is elevated,
- and the market is not clearly trending or extended.

## Educational Notice

TradeEvidence outputs are for education and research only. They are not financial, investment, legal, tax, or trading advice.
