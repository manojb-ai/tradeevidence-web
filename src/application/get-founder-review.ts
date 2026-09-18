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
  momentumEvidence: string;
  timeframeEvidence: string;
  invalidation: string;
  invalidationTakeaway: string;
  invalidationWhyItMatters: string;
};

export const FOUNDER_REVIEW_PRESENTATION_VERSION = "founder-review-guided-v1";

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
    momentumEvidence:
      record.factors.find((item) => item.group === "momentum")?.explanation ??
      "Momentum evidence is unavailable.",
    timeframeEvidence:
      record.factors.find((item) => item.group === "higher_timeframe")
        ?.explanation ?? "Higher-timeframe evidence is unavailable.",
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
    return `Reassess this ${record.direction} interpretation if a later, comparable end-of-day analysis no longer qualifies as ${record.direction} under the same ruleset.`;
  }
  return "This snapshot did not establish a directional thesis, so there is no bullish or bearish thesis to invalidate.";
}

function invalidationWhyItMatters(record: CandidateEvidence): string {
  if (record.direction === "bullish" || record.direction === "bearish") {
    return "This snapshot does not calculate a stop price or an intraday trigger. Reassessment means comparing a later closing-price snapshot using the same rules—not reacting to every price fluctuation.";
  }
  return "Review later comparable snapshots to see whether a complete directional evidence pattern develops.";
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

function classificationLabel(
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
