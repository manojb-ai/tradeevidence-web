# ThinkScript Bidirectional Analysis

- **Status:** Candidate for founder review and Thinkorswim validation
- **Date:** 2026-08-23
- **Production eligibility:** Not eligible

## Source reviewed

The analysis used the founder-provided original `Stellar`, `Stellar-Watch`,
`StellarEv-Column`, `StellarOrbit`, and `StellarOrbit-Column` scripts. The
original files remain outside the repository and were not modified.

Source SHA-256 fingerprints:

| File | SHA-256 |
|---|---|
| `Stellar.txt` | `F3B969D8D8855886F3A7F0EBD959F00497E7DC4D0B663478E31F0BF64755AFC6` |
| `StellarEv-Column.txt` | `2EA6C6094D57D1C0797CABE70D2B64BAA60FB1F99212164333A131C1D4C2E02E` |
| `StellarOrbit.txt` | `A54CA11C66132D79EC6B04F2AC1FD6FECFA0DB49465D6326B09608FF8458D269` |
| `StellarOrbit-Column.txt` | `2BA518B561052A5EBC463C2FF5DFAE17560F41CE271031A31E0D8AB2C249AD4A` |
| `Stellar-Watch.txt` | `B37D492C88208FB79C1918F25F719D03E5306B398608AD5B6DA2A41A1592B770` |

## Confirmed StellarEvidence behavior

StellarEvidence detects Bollinger-Band compression inside Keltner Channels,
then requires an 8 EMA above 21 EMA, close above the 50 and 200 SMAs, the 50
SMA above the 200 SMA, and price between 1% below and 2% above the 21 EMA for
the strict Buy state.

The Watch state uses the same bullish compression and trend alignment but
requires price outside that band. `No | CD` means compression without the
approved bullish state; it does not mean bearish. `No | BO` means no
compression and does not independently identify direction.

## Confirmed StellarOrbit behavior

The watchlist column is already direction-aware: above-zero/rising is Buy,
above-zero/falling is Buy Watch, below-zero/falling is Short, and
below-zero/rising is Short Watch.

Two inconsistencies were found:

1. The scan calculates from `high`, while the column calculates from `close`.
2. An unchanged line falls through to `SHORT-WATCH` even though neither Short
   nor Short-Watch is true.

The candidates use a shared configurable `price` input defaulting to `close`
and add an explicit Neutral state.

## Candidate bearish mirror

The candidate preserves the bullish rules and defines bearish alignment as an
8 EMA below 21 EMA, close below 50 SMA, 50 SMA below 200 SMA, and price between
2% below and 1% above the 21 EMA for strict bearish setup.

The bearish location band mirrors the signed distance of the original bullish
band. This is a hypothesis requiring chart review; symmetry does not prove
equivalent market behavior.

## Candidate export states

StellarEvidence emits `BULL-CD`, `BULL-WATCH-CD`, `BEAR-CD`,
`BEAR-WATCH-CD`, `NEUTRAL-CD`, `BULL-BO`, `BEAR-BO`, or `NEUTRAL-BO`.
StellarOrbit emits `BULL`, `BULL-WATCH`, `BEAR`, `BEAR-WATCH`, or `NEUTRAL`.

These describe evidence states. They are not actions, forecasts, or
recommendations.

## Required Thinkorswim validation

1. Load the candidate Evidence column at Daily and Weekly aggregation beside
   the original column.
2. Confirm original bullish Buy and Watch cases remain equivalent.
3. Inspect at least 20 `BEAR-CD` and 20 `BEAR-WATCH-CD` charts across sectors
   and volatility conditions.
4. Decide whether the mirrored bearish near-EMA band is visually appropriate.
5. Compare candidate Orbit to the original, especially flat-line and zero-line
   boundary cases.
6. Confirm that `price = close` is intended for both Orbit scan and column.
7. Export candidate Daily and Weekly columns only after chart review.

The Python v2 adapter must not treat these labels as authoritative until this
review and mapping receive human approval.
