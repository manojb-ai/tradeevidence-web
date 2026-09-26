import {
  pgTable,
  text,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

import { checkEnum, timestamptz } from "./columns";
import { universeVersions } from "./universe";

/**
 * Analytical-Run domain (`MVP-Data-Schema.md`, "Analytical-Run Domain").
 * `analysis_run_artifacts` and `analysis_run_validations` (object-storage
 * lineage and validation-history tables) are part of the approved spec
 * but aren't needed to prove out the run/publication/snapshot round trip
 * this slice targets — deferred to when the real ingestion pipeline
 * (Epic E4) needs to write them.
 *
 * `approved_by` and `publication_pointers.updated_by` are plain `uuid`
 * columns without a database foreign key to `users.id` here: the user
 * domain (Epic E2's user/watchlist session) hasn't been built yet. The
 * spec's own column list allows this — the FK gets added once that
 * table exists, without changing this column.
 */

const RUN_STATUSES = [
  "generated",
  "staged",
  "validated",
  "approved",
  "published",
  "superseded",
  "rejected",
  "redundant",
] as const;

export const analysisRuns = pgTable(
  "analysis_runs",
  {
    id: uuid("id").primaryKey(),
    status: text("status").notNull(),
    universeVersionId: uuid("universe_version_id")
      .notNull()
      .references(() => universeVersions.id),
    snapshotType: text("snapshot_type").notNull(),
    marketDataAsOf: timestamptz("market_data_as_of").notNull(),
    generatedAt: timestamptz("generated_at").notNull(),
    stagedAt: timestamptz("staged_at"),
    validatedAt: timestamptz("validated_at"),
    approvedAt: timestamptz("approved_at"),
    approvedBy: uuid("approved_by"),
    publishedAt: timestamptz("published_at"),
    supersededAt: timestamptz("superseded_at"),
    supersededByRunId: uuid("superseded_by_run_id").references(
      (): AnyPgColumn => analysisRuns.id,
    ),
    engineVersion: text("engine_version").notNull(),
    rulesetVersion: text("ruleset_version").notNull(),
    decisionConfidenceModelVersion: text(
      "decision_confidence_model_version",
    ).notNull(),
    selectionModelVersion: text("selection_model_version").notNull(),
    strategyAlignmentVersion: text("strategy_alignment_version").notNull(),
    payloadSchemaVersion: text("payload_schema_version").notNull(),
    bundleChecksum: text("bundle_checksum").notNull(),
    analyticalFingerprint: text("analytical_fingerprint").notNull(),
    equivalentRunId: uuid("equivalent_run_id").references(
      (): AnyPgColumn => analysisRuns.id,
    ),
    failureStage: text("failure_stage"),
    failureCategory: text("failure_category"),
  },
  (table) => [checkEnum("analysis_runs_status_check", table.status, RUN_STATUSES)],
);

export const publicationPointers = pgTable("publication_pointers", {
  channel: text("channel").primaryKey(),
  currentAnalysisRunId: uuid("current_analysis_run_id")
    .notNull()
    .references(() => analysisRuns.id),
  updatedAt: timestamptz("updated_at").notNull(),
  updatedBy: uuid("updated_by").notNull(),
});
