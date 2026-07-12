# 07. Scoring Engine

## Purpose
The scoring engine is the analytical core of TradeEvidence. It helps users evaluate market opportunities using multiple evidence sources and explainable criteria.

## Scoring Philosophy
Scores should be generated from multiple independent evidence sources rather than a single opaque signal. Each score should be understandable, traceable, and useful for decision support.

## Design Principles
- explain every score
- show the evidence behind the score
- separate signal strength from confidence
- make assumptions visible
- avoid black-box scoring

## Example Score Categories

| Category | Purpose |
| --- | --- |
| Trend | Evaluate the direction and strength of price movement. |
| Momentum | Measure the pace of recent price movement. |
| Relative Strength | Compare an asset's strength against peers or benchmarks. |
| Volume | Assess participation and conviction. |
| Squeeze | Identify periods of compressed volatility that may precede expansion. |
| Volatility | Understand the risk and variability of the setup. |
| Price Structure | Review chart structure and notable levels. |
| Support/Resistance | Identify key levels that may shape behavior. |
| Market Breadth | Understand the broader market environment. |
| Sector Strength | Evaluate whether the sector is helping or hurting the opportunity. |

## Scoring Approach
A score should be treated as a structured summary of evidence, not a decision directive. It should support a trader's own analysis by clarifying:
- what evidence is present
- which factors are contributing positively or negatively
- where confidence is high or uncertain

## Evidence-to-Score Flow

```mermaid
flowchart TD
    A[Trend] --> S[Scoring Engine]
    B[Momentum] --> S
    C[Relative Strength] --> S
    D[Volume] --> S
    E[Squeeze] --> S
    F[Volatility] --> S
    G[Price Structure] --> S
    H[Support/Resistance] --> S
    I[Market Breadth] --> S
    J[Sector Strength] --> S
    S --> O[Overall Score]
    O --> X[Explainable Output]
    O --> Y[Confidence and Assumptions]
```

## Output Expectations
The scoring engine should provide:
- a clear score or rating
- supporting evidence
- visible assumptions
- contextual notes on uncertainty
- a narrative explanation when needed

## Historical Validation and Versioning
The scoring engine should not only generate a score for the present moment; it should also preserve the conditions under which that score was produced. Each score should be associated with an immutable Evidence Snapshot that records the model version, data version, supporting and contradicting evidence, and later outcome measurements.

This supports:
- historical validation of past scores and theses
- comparison across model iterations
- transparent confidence changes over time
- a Devil's Advocate view that preserves both bullish and bearish reasoning

The broader product architecture for this approach is described in [Evidence-History-and-Validation.md](Evidence-History-and-Validation.md), and the expected record shape is defined in [Evidence-Snapshot-Data-Contract.md](Evidence-Snapshot-Data-Contract.md).

---

## TODO

### High
- Define the initial scoring model and weighting approach for v0.4.
- Define how scores should be visualized and compared in primary product views.

### Medium
- Clarify how confidence and assumptions should appear beside each score.
- Document how evidence categories should be grouped or prioritized in the first release.

### Low
- Capture any score model updates that emerge from early testing or user feedback.

## Related Documents
- [03-Architecture.md](03-Architecture.md)
- [08-AI-Strategy.md](08-AI-Strategy.md)
- [09-Data-Model.md](09-Data-Model.md)
- [06-Roadmap.md](06-Roadmap.md)
