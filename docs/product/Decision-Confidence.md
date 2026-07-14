# Decision Confidence

## Purpose

Decision Confidence is a first-class product concept that captures how supportive the current environment is for acting on a decision now. It exists to help the user distinguish between strong evidence and a favorable time to act.

It is deliberately separate from Evidence Score.

## Evidence Score vs. Decision Confidence

| Concept | Question Answered |
|---|---|
| Evidence Score | How strong and internally consistent is the available evidence? |
| Decision Confidence | How supportive is the full context for acting at this moment? |

A security can have a high Evidence Score but only moderate Decision Confidence if the market environment is crowded, the setup is extended, or important timing risk is approaching.

## Inputs

Decision Confidence should be based on a combination of objective context and the current decision environment. Potential inputs include:

- Market regime
- Sector alignment
- Security trend and momentum
- Proximity to support or entry zone
- Extension
- Earnings or event timing
- Volatility
- Evidence agreement or conflict
- Thesis invalidation distance
- Data freshness
- Model confidence

## Examples

- High Evidence Score, High Decision Confidence: The evidence is strong, the market context is supportive, the setup is not overheated, and timing is favorable.
- High Evidence Score, Moderate Decision Confidence: The evidence is compelling, but earnings are approaching, the price is extended, or the broader market is weak.
- Moderate Evidence Score, Low Decision Confidence: The setup is still interesting, but the environment is mixed, the thesis is fragile, or there are multiple unresolved risks.

## Presentation

A simple presentation format should make the distinction explicit:

```text
Evidence Score: 92
Decision Confidence: Moderate
```

Decision Confidence should also expose the reasons behind the label. A helpful explanation might say:

- Market context remains supportive.
- Sector leadership is strong.
- Earnings are approaching.
- Price is moderately extended.

## Guardrails

- Decision Confidence is not a probability of profit.
- It is not a recommendation.
- It must expose its reasons.
- It must preserve uncertainty.
- The user always owns the decision.

## Future Validation

Decision Confidence should be validated over time by comparing the label to later outcome data, user behavior, and the quality of the decision process. The product should learn whether the concept is useful, whether the explanations are trustworthy, and whether the scale is understandable.

## Related Documents

- [../07-Decision-Workspace-Concept.md](../07-Decision-Workspace-Concept.md)
- [../product/Decision-Journal.md](Decision-Journal.md)
- [../Product-Decision-Log.md](../Product-Decision-Log.md)
