/**
 * Analytical-Run domain types (mirrors `src/infrastructure/db/schema/analysis.ts`,
 * itself derived from `docs/engineering/MVP-Data-Schema.md`). These are the
 * shapes the repository layer returns; nothing outside `src/infrastructure/db`
 * imports them yet (Epic E4 wires a publication adapter on top of this later).
 */

export type AnalysisRunStatus =
  | "generated"
  | "staged"
  | "validated"
  | "approved"
  | "published"
  | "superseded"
  | "rejected"
  | "redundant";

export type AnalysisRun = {
  id: string;
  status: AnalysisRunStatus;
  universeVersionId: string;
  snapshotType: string;
  marketDataAsOf: string;
  generatedAt: string;
  stagedAt: string | null;
  validatedAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  publishedAt: string | null;
  supersededAt: string | null;
  supersededByRunId: string | null;
  engineVersion: string;
  rulesetVersion: string;
  decisionConfidenceModelVersion: string;
  selectionModelVersion: string;
  strategyAlignmentVersion: string;
  payloadSchemaVersion: string;
  bundleChecksum: string;
  analyticalFingerprint: string;
  equivalentRunId: string | null;
  failureStage: string | null;
  failureCategory: string | null;
};

export type NewAnalysisRunInput = {
  universeVersionId: string;
  snapshotType: string;
  marketDataAsOf: string;
  generatedAt: string;
  engineVersion: string;
  rulesetVersion: string;
  decisionConfidenceModelVersion: string;
  selectionModelVersion: string;
  strategyAlignmentVersion: string;
  payloadSchemaVersion: string;
  bundleChecksum: string;
  analyticalFingerprint: string;
};

export type PublicationPointer = {
  channel: string;
  currentAnalysisRunId: string;
  updatedAt: string;
  updatedBy: string;
};
