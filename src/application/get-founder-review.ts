import type {
  CandidateEvidence,
  CandidatePublication,
  EvidenceFactor,
} from "@/src/domain/analytical-publication";
import { loadCandidatePublication } from "@/src/infrastructure/analytics/file-candidate-publication";

export type FounderReviewRecord = CandidateEvidence & {
  classificationLabel: ClassificationLabel;
  principalSupportText: string;
  keyConstraintText: string;
  devilsAdvocateTakeaway: string;
  devilsAdvocateWhyItMatters: string;
  contradictionTechnical: string;
  trendEvidence: string;
  dailyMomentumEvidence: string;
  weeklyMomentumEvidence: string;
  momentumRelationship: string;
  invalidation: string;
  invalidationTakeaway: string;
  invalidationWhyItMatters: string;
};

export const FOUNDER_REVIEW_PRESENTATION_VERSION = "founder-review-guided-v2";

export type ClassificationLabel =
  | "Bullish"
  | "Bearish"
  | "Bullish watch"
  | "Bearish watch"
  | "Neutral"
  | "Incomplete";

export type FounderReview = {
  publication: CandidatePublication;
  featured: FounderReviewRecord[];
  all: FounderReviewRecord[];
  isCandidate: boolean;
};

export function getFounderReview(): FounderReview {
  return buildFounderReview(loadCandidatePublication());
}

export function buildFounderReview(
  publication: CandidatePublication,
): FounderReview {
  const all = publication.results.map(toReviewRecord);
  const featured = all
    .filter(
      (record) =>
        record.status === "complete" &&
        (record.classification === "bullish" ||
          record.classification === "bearish") &&
        record.alignmentScore !== null,
    )
    .sort(
      (left, right) =>
        (right.alignmentScore ?? -1) - (left.alignmentScore ?? -1) ||
        left.symbol.localeCompare(right.symbol),
    )
    .slice(0, 5);

  return {
    publication,
    featured,
    all,
    isCandidate: publication.source === "candidate-artifact",
  };
}

export function findFounderReviewRecord(
  symbol: string,
): FounderReviewRecord | undefined {
  return getFounderReview().all.find(
    (record) => record.symbol.toLowerCase() === symbol.toLowerCase(),
  );
}

function toReviewRecord(record: CandidateEvidence): FounderReviewRecord {
  const support =
    factor(record, record.principalSupport) ?? strongest(record, "supporting");
  const contradiction =
    factor(record, record.principalContradiction) ??
    strongest(record, "contradicting");
  return {
    ...record,
    classificationLabel: classificationLabel(record.classification),
    principalSupportText:
      support?.explanation ?? "No principal supporting factor was recorded.",
    keyConstraintText:
      contradiction?.explanation ??
      "No material contradictory technical factor was recorded in this candidate snapshot. Market context, sector context, and Decision Confidence remain unavailable.",
    devilsAdvocateTakeaway: devilTakeaway(record, contradiction),
    devilsAdvocateWhyItMatters: devilWhyItMatters(record, contradiction),
    contradictionTechnical:
      contradiction?.explanation ??
      "No material contradictory technical factor was recorded by Candidate 2.",
    trendEvidence:
      record.factors.find((item) => item.group === "trend")?.explanation ??
      "Trend evidence is unavailable.",
    dailyMomentumEvidence: momentumSentence(
      "Daily momentum",
      record.factors.find((item) => item.group === "momentum"),
    ),
    weeklyMomentumEvidence: momentumSentence(
      "Weekly momentum",
      record.factors.find((item) => item.group === "higher_timeframe"),
    ),
    momentumRelationship: momentumRelationship(record),
    invalidation:
      record.invalidationConditions[0] ??
      "No deterministic reassessment condition was recorded.",
    invalidationTakeaway: invalidationTakeaway(record),
    invalidationWhyItMatters: invalidationWhyItMatters(record),
  };
}

function devilTakeaway(
  record: CandidateEvidence,
  contradiction: EvidenceFactor | undefined,
): string {
  if (!contradiction) {
    return "The evaluated technical factors do not show a material opposing signal. That does not mean the setup is risk-free; market, sector, and event context have not yet been evaluated.";
  }
  if (
    contradiction.code === "daily_momentum" &&
    contradiction.observedState.endsWith("_weakening")
  ) {
    return `The ${record.direction} trend is still supported, but the strength of the recent daily move is weakening.`;
  }
  if (contradiction.code === "weekly_trend") {
    return `The daily evidence leans ${record.direction}, but the broader weekly trend does not fully confirm it.`;
  }
  return `The main technical limitation comes from ${factorLabel(contradiction.code)}.`;
}

function devilWhyItMatters(
  record: CandidateEvidence,
  contradiction: EvidenceFactor | undefined,
): string {
  if (!contradiction) {
    return "A high alignment score summarizes only the factors this run evaluated. Information that is missing or outside the engine can still change how a trader interprets the setup.";
  }
  if (
    contradiction.code === "daily_momentum" &&
    contradiction.observedState.endsWith("_weakening")
  ) {
    return "Momentum describes the force behind recent price movement. Weakening momentum reduces near-term confirmation, but it is not by itself proof that the trend has reversed.";
  }
  return `This factor keeps the evidence from being uniformly ${record.direction}. It should be reviewed alongside the supporting factors rather than treated as a prediction.`;
}

function invalidationTakeaway(record: CandidateEvidence): string {
  if (record.direction === "bullish" || record.direction === "bearish") {
    const relation = record.direction === "bullish" ? "below" : "above";
    if (record.ema21 !== null && record.sma50 !== null) {
      return `Treat a regular-session close ${relation} the 21-day EMA (${money(record.ema21)}) as an early warning. Reassess more seriously after two consecutive regular-session closes ${relation} the 50-day SMA (${money(record.sma50)}).`;
    }
    return `Reassess this ${record.direction} interpretation if a later, comparable end-of-day analysis no longer qualifies as ${record.direction} under the same ruleset.`;
  }
  return "This snapshot did not establish a directional thesis, so there is no bullish or bearish thesis to invalidate.";
}

function invalidationWhyItMatters(record: CandidateEvidence): string {
  if (record.direction === "bullish" || record.direction === "bearish") {
    return "For this founder version, “remains” means two consecutive regular-session daily closes. These are educational reassessment references—not a stop-loss instruction—and this snapshot has not evaluated whether the future persistence condition occurred.";
  }
  return "Review later comparable snapshots to see whether a complete directional evidence pattern develops.";
}

function momentumRelationship(record: CandidateEvidence): string {
  const daily = record.factors.find((item) => item.group === "momentum");
  const weekly = record.factors.find(
    (item) => item.group === "higher_timeframe",
  );
  if (!daily || !weekly) {
    return "Daily momentum is the faster view; weekly momentum is the slower, broader view. One or both are unavailable in this snapshot.";
  }
  return `Daily momentum is ${statePhrase(daily.observedState)}; weekly momentum is ${statePhrase(weekly.observedState)}. Daily momentum reacts faster to recent price changes, while weekly momentum changes more slowly and supplies broader context. Weekly momentum does not mechanically drive daily momentum, but agreement across both timeframes strengthens confirmation and disagreement deserves additional scrutiny.`;
}

function momentumSentence(
  label: "Daily momentum" | "Weekly momentum",
  factor: EvidenceFactor | undefined,
): string {
  return factor
    ? `${label} is ${statePhrase(factor.observedState)}.`
    : `${label} is unavailable.`;
}

function statePhrase(state: string): string {
  if (state === "bullish_weakening") return "bullish but weakening";
  if (state === "bearish_weakening") return "bearish but weakening";
  return state.replaceAll("_", " ");
}

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

function factorLabel(code: string): string {
  return code.replaceAll("_", " ");
}

function factor(
  record: CandidateEvidence,
  code: string | null,
): EvidenceFactor | undefined {
  return code ? record.factors.find((item) => item.code === code) : undefined;
}

function strongest(
  record: CandidateEvidence,
  effect: "supporting" | "contradicting",
): EvidenceFactor | undefined {
  return record.factors.find((item) => item.effect === effect);
}

export function classificationLabel(
  classification: CandidateEvidence["classification"],
): ClassificationLabel {
  switch (classification) {
    case "bullish":
      return "Bullish";
    case "bearish":
      return "Bearish";
    case "bullish_watch":
      return "Bullish watch";
    case "bearish_watch":
      return "Bearish watch";
    case "neutral":
      return "Neutral";
    case "incomplete":
      return "Incomplete";
  }
}

export type BreadthSummary = {
  bullish: number;
  bullishWatch: number;
  neutral: number;
  bearishWatch: number;
  bearish: number;
  incomplete: number;
  total: number;
};

export function getBreadth(all: FounderReviewRecord[]): BreadthSummary {
  const summary: BreadthSummary = {
    bullish: 0,
    bullishWatch: 0,
    neutral: 0,
    bearishWatch: 0,
    bearish: 0,
    incomplete: 0,
    total: all.length,
  };
  for (const record of all) {
    switch (record.classification) {
      case "bullish":
        summary.bullish += 1;
        break;
      case "bullish_watch":
        summary.bullishWatch += 1;
        break;
      case "neutral":
        summary.neutral += 1;
        break;
      case "bearish_watch":
        summary.bearishWatch += 1;
        break;
      case "bearish":
        summary.bearish += 1;
        break;
      case "incomplete":
        summary.incomplete += 1;
        break;
    }
  }
  return summary;
}

export type OpportunityColumns = {
  yes: FounderReviewRecord[];
  watch: FounderReviewRecord[];
  no: FounderReviewRecord[];
};

/**
 * Groups complete, scored records into the approved YES / WATCH / NO
 * Highest Conviction Opportunities columns (Dashboard v1 Baseline), each
 * ordered by score and capped to a small homepage-appropriate count.
 */
export function getOpportunityColumns(
  all: FounderReviewRecord[],
  limit = 3,
): OpportunityColumns {
  const complete = all.filter(
    (record) => record.status === "complete" && record.alignmentScore !== null,
  );

  return {
    yes: complete
      .filter((record) => record.classification === "bullish")
      .sort(byScoreDesc)
      .slice(0, limit),
    watch: complete
      .filter(
        (record) =>
          record.classification === "bullish_watch" ||
          record.classification === "bearish_watch",
      )
      .sort(byScoreDesc)
      .slice(0, limit),
    no: complete
      .filter((record) => record.classification === "bearish")
      .sort(byScoreDesc)
      .slice(0, limit),
  };
}

function byScoreDesc(
  left: FounderReviewRecord,
  right: FounderReviewRecord,
): number {
  return (
    (right.alignmentScore ?? -1) - (left.alignmentScore ?? -1) ||
    left.symbol.localeCompare(right.symbol)
  );
}
