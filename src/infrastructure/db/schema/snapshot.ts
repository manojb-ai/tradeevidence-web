import {
  check,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { checkEnum, timestamptz } from "./columns";
import { analysisRuns } from "./analysis";
import { instruments, sectors } from "./reference";
import { marketObservations } from "./market-data";

/**
 * Analytical-Snapshot domain (`MVP-Data-Schema.md`, "Analytical-Snapshot
 * Domain"). Everything here belongs to exactly one `analysis_run_id`
 * (spec, "Identity Rules": "Every analytical child belongs to exactly
 * one analysis_run_id. Cross-run analytical relationships are
 * prohibited") — every table below carries that foreign key, and
 * `symbol_evidence_snapshots` additionally requires its market/sector
 * context snapshots to belong to the *same* run (enforced at the
 * repository layer: a single INSERT statement referencing rows already
 * scoped to the same `analysis_run_id` parameter makes a cross-run
 * mismatch structurally impossible from that call site, but a full
 * database-level guarantee would need a composite foreign key or
 * trigger — noted as a follow-up, not silently assumed solved).
 *
 * `decision_confidence_results`, `decision_confidence_reasons`,
 * `strategy_alignments`, `deterministic_explanations`, and
 * `homepage_selections` are part of this domain per the spec but have no
 * FK consumer in this slice and are deferred to a follow-up session.
 */

const FRESHNESS_STATUSES = ["current", "stale", "superseded"] as const;

export const marketContextSnapshots = pgTable("market_context_snapshots", {
  id: uuid("id").primaryKey(),
  analysisRunId: uuid("analysis_run_id")
    .notNull()
    .references(() => analysisRuns.id),
  regime: text("regime").notNull(),
  riskEnvironment: text("risk_environment").notNull(),
  freshnessStatus: text("freshness_status").notNull(),
  supportingSummary: text("supporting_summary").notNull(),
  contradictingSummary: text("contradicting_summary"),
  // Market-observation IDs backing this snapshot's summary, as a JSON
  // array of UUID strings — plural per the spec ("observation
  // references"), and not a fixed-arity set of columns.
  observationRefs: jsonb("observation_refs").notNull(),
  renderedExplanation: text("rendered_explanation").notNull(),
  createdAt: timestamptz("created_at").notNull(),
});

export const sectorContextSnapshots = pgTable(
  "sector_context_snapshots",
  {
    id: uuid("id").primaryKey(),
    analysisRunId: uuid("analysis_run_id")
      .notNull()
      .references(() => analysisRuns.id),
    sectorId: uuid("sector_id")
      .notNull()
      .references(() => sectors.id),
    representativeBenchmarkInstrumentId: uuid(
      "representative_benchmark_instrument_id",
    )
      .notNull()
      .references(() => instruments.id),
    trend: text("trend").notNull(),
    momentum: text("momentum").notNull(),
    relativeStrength: numeric("relative_strength"),
    evidenceState: text("evidence_state").notNull(),
    freshnessStatus: text("freshness_status").notNull(),
    observationRefs: jsonb("observation_refs").notNull(),
    factors: jsonb("factors").notNull(),
    renderedExplanation: text("rendered_explanation").notNull(),
    createdAt: timestamptz("created_at").notNull(),
  },
  (table) => [
    unique("sector_context_snapshots_run_sector").on(
      table.analysisRunId,
      table.sectorId,
    ),
  ],
);

const EVIDENCE_STATUSES = ["complete", "incomplete"] as const;

export const symbolEvidenceSnapshots = pgTable(
  "symbol_evidence_snapshots",
  {
    id: uuid("id").primaryKey(),
    analysisRunId: uuid("analysis_run_id")
      .notNull()
      .references(() => analysisRuns.id),
    instrumentId: uuid("instrument_id")
      .notNull()
      .references(() => instruments.id),
    // Historical display value at publication time — deliberately not a
    // foreign key to a current listing, since a symbol shown here must
    // never change after publication even if the instrument's ticker
    // changes later.
    symbolAtPublication: text("symbol_at_publication").notNull(),
    marketObservationId: uuid("market_observation_id")
      .notNull()
      .references(() => marketObservations.id),
    marketContextSnapshotId: uuid("market_context_snapshot_id")
      .notNull()
      .references(() => marketContextSnapshots.id),
    // Nullable: "Same run required when available" (spec) — not every
    // instrument has an applicable sector.
    sectorContextSnapshotId: uuid("sector_context_snapshot_id").references(
      () => sectorContextSnapshots.id,
    ),
    snapshotType: text("snapshot_type").notNull(),
    session: text("session").notNull(),
    barInterval: text("bar_interval").notNull(),
    marketDataAsOf: timestamptz("market_data_as_of").notNull(),
    canonicalPrice: numeric("canonical_price").notNull(),
    // Nullable: an incomplete snapshot has no score (spec: "0 through 100
    // when complete").
    technicalEvidenceScore: numeric("technical_evidence_score", {
      precision: 5,
      scale: 2,
    }),
    evidenceBand: text("evidence_band"),
    evidenceStatus: text("evidence_status").notNull(),
    coveragePercent: numeric("coverage_percent", {
      precision: 5,
      scale: 2,
    }).notNull(),
    freshnessStatus: text("freshness_status").notNull(),
  },
  (table) => [
    unique("symbol_evidence_snapshots_run_instrument_type").on(
      table.analysisRunId,
      table.instrumentId,
      table.snapshotType,
    ),
    checkEnum(
      "symbol_evidence_snapshots_status_check",
      table.evidenceStatus,
      EVIDENCE_STATUSES,
    ),
    checkEnum(
      "symbol_evidence_snapshots_freshness_check",
      table.freshnessStatus,
      FRESHNESS_STATUSES,
    ),
    check(
      "symbol_evidence_snapshots_score_range_check",
      sql`${table.technicalEvidenceScore} is null or (${table.technicalEvidenceScore} >= 0 and ${table.technicalEvidenceScore} <= 100)`,
    ),
    check(
      "symbol_evidence_snapshots_coverage_range_check",
      sql`${table.coveragePercent} >= 0 and ${table.coveragePercent} <= 100`,
    ),
    check(
      // Spec: "An incomplete snapshot cannot receive a Homepage
      // selection" is enforced where homepage_selections is built
      // (deferred); this narrower, always-true-today rule is enforced
      // here instead: an incomplete snapshot cannot carry a score.
      "symbol_evidence_snapshots_incomplete_has_no_score_check",
      sql`${table.evidenceStatus} <> 'incomplete' or ${table.technicalEvidenceScore} is null`,
    ),
  ],
);

const FACTOR_EFFECTS = [
  "supporting",
  "contradicting",
  "neutral",
  "unavailable",
  "not_evaluated",
] as const;

export const evidenceFactorResults = pgTable(
  "evidence_factor_results",
  {
    id: uuid("id").primaryKey(),
    symbolSnapshotId: uuid("symbol_snapshot_id")
      .notNull()
      .references(() => symbolEvidenceSnapshots.id),
    factorCode: text("factor_code").notNull(),
    factorDefinitionVersion: text("factor_definition_version").notNull(),
    observedState: text("observed_state").notNull(),
    effect: text("effect").notNull(),
    contribution: numeric("contribution"),
    explanationCode: text("explanation_code").notNull(),
    templateVersion: text("template_version").notNull(),
    parameters: jsonb("parameters").notNull(),
    renderedText: text("rendered_text").notNull(),
    displayOrder: integer("display_order").notNull(),
  },
  (table) => [
    // "Factor code is unique within a snapshot and ruleset" (spec) — the
    // ruleset is fixed per run (analysis_runs.ruleset_version), so
    // uniqueness within a snapshot already implies uniqueness within its
    // snapshot+ruleset.
    unique("evidence_factor_results_snapshot_factor_code").on(
      table.symbolSnapshotId,
      table.factorCode,
    ),
    checkEnum("evidence_factor_results_effect_check", table.effect, FACTOR_EFFECTS),
  ],
);
