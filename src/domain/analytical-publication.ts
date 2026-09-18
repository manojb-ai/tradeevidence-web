export type CandidateClassification =
  | "bullish"
  | "bearish"
  | "bullish_watch"
  | "bearish_watch"
  | "neutral"
  | "incomplete";

export type EvidenceFactor = {
  code: string;
  group: string;
  observedState: string;
  effect: string;
  explanation: string;
  unavailableReason: string | null;
};

export type CandidateEvidence = {
  symbol: string;
  companyName: string | null;
  exchange: string | null;
  currency: string | null;
  canonicalPrice: number | null;
  status: "complete" | "incomplete";
  classification: CandidateClassification;
  direction: "bullish" | "bearish" | "neutral" | "incomplete";
  alignmentScore: number | null;
  alignmentBand: string | null;
  coverage: number;
  principalSupport: string | null;
  principalContradiction: string | null;
  summary: string;
  invalidationConditions: string[];
  factors: EvidenceFactor[];
};

export type CandidatePublication = {
  source: "candidate-artifact" | "illustrative-fallback";
  sourceLabel: string;
  marketDate: string;
  generatedAt: string;
  engineVersion: string;
  rulesetVersion: string;
  sourceChecksum: string;
  rowsEvaluated: number;
  completeCount: number;
  results: CandidateEvidence[];
};
