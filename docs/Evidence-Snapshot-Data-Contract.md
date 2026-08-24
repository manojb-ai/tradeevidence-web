# Evidence Snapshot Data Contract

- **Status:** Approved conceptual contract
- **Version:** 1.0
- **Last Updated:** 2026-08-23
- **Authority:** [Evidence Engine Specification](engineering/Evidence-Engine-Specification.md)

## Purpose

An Evidence Snapshot is an immutable record of deterministic evidence at one
observation. It does not contain Decision Confidence, the trader's decision,
personal suitability, entry instruction, or position-size guidance.

## Identity and Observation

- Snapshot ID
- Analysis run ID
- Stable instrument ID
- Symbol at observation
- Market date and as-of timestamp
- Observation kind
- Creation timestamp

## Lineage and Versions

- Source version and checksum
- Engine version
- Ruleset version
- Factor definition versions
- Input and output schema versions
- Explanation-template version

## Normalized Evidence Input

- Required normalized observations
- Supplemental normalized observations
- Unavailable reasons
- Provider-independent units and semantics

## Reconciled Technical Evidence

- Eligible and evaluated capacity
- Bullish total
- Bearish total
- Neutral total
- Unavailable total
- Coverage
- Direction
- Classification
- Alignment score, unrounded value, and band
- Complete or Incomplete status

Every factor and snapshot obeys:

```text
bullish + bearish + neutral + unavailable = eligible capacity
```

## Explanation

- Factor allocations and observed states
- Principal supporting evidence
- Other supporting evidence
- Principal contradicting evidence
- Other material contradictions and risks
- Neutral and unavailable evidence
- Deterministic thesis-invalidation conditions
- Explanation codes

Beginner and detailed views use progressive disclosure over this same canonical
content.

## Separate Linked Records

The following may reference a snapshot but are not fields inside Technical
Evidence:

- Market and sector context
- Decision Confidence
- Strategy Alignment
- Trader assumptions and decision
- Journal entries
- Alerts
- AI explanations
- Outcome measurements

## Outcome Measurements

Future outcome observations are versioned, append-only records linked to the
snapshot. Their horizon, anchor, benchmark, corporate-action treatment,
missing-data state, correction lineage, and methodology version remain
explicit. No outcome methodology or predictive claim is approved merely by
Workshop 6 completion.
