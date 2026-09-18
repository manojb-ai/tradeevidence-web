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
  trendEvidence: string;
  momentumEvidence: string;
  timeframeEvidence: string;
  invalidation: string;
};

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
  };
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
