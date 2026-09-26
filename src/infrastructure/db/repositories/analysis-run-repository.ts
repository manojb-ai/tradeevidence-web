import { eq } from "drizzle-orm";
import type { PgQueryResultHKT } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

import type {
  AnalysisRun,
  NewAnalysisRunInput,
} from "@/src/domain/analysis-run";
import type { AppDatabase } from "@/src/infrastructure/db/repositories/types";
import {
  analysisRuns,
  publicationPointers,
} from "@/src/infrastructure/db/schema";

/**
 * Analysis-run repository (Analytical-Run domain,
 * `docs/engineering/MVP-Data-Schema.md`). Enforces the run's status
 * pipeline in application code, not just via the database's `CHECK`
 * constraint: `CHECK` only rejects an unknown status value, it can't
 * express "may only move forward one stage at a time" — that ordering
 * lives here. Not called from any application code yet (Epic E4).
 */

export async function insertAnalysisRun<TQueryResult extends PgQueryResultHKT>(
  db: AppDatabase<TQueryResult>,
  input: NewAnalysisRunInput,
): Promise<AnalysisRun> {
  const [row] = await db
    .insert(analysisRuns)
    .values({
      id: uuidv7(),
      status: "generated",
      universeVersionId: input.universeVersionId,
      snapshotType: input.snapshotType,
      marketDataAsOf: input.marketDataAsOf,
      generatedAt: input.generatedAt,
      engineVersion: input.engineVersion,
      rulesetVersion: input.rulesetVersion,
      decisionConfidenceModelVersion: input.decisionConfidenceModelVersion,
      selectionModelVersion: input.selectionModelVersion,
      strategyAlignmentVersion: input.strategyAlignmentVersion,
      payloadSchemaVersion: input.payloadSchemaVersion,
      bundleChecksum: input.bundleChecksum,
      analyticalFingerprint: input.analyticalFingerprint,
    })
    .returning();
  return toAnalysisRun(row);
}

export async function findAnalysisRunById<
  TQueryResult extends PgQueryResultHKT,
>(db: AppDatabase<TQueryResult>, id: string): Promise<AnalysisRun | null> {
  const [row] = await db
    .select()
    .from(analysisRuns)
    .where(eq(analysisRuns.id, id))
    .limit(1);
  return row ? toAnalysisRun(row) : null;
}

export async function markAnalysisRunStaged<
  TQueryResult extends PgQueryResultHKT,
>(db: AppDatabase<TQueryResult>, id: string, stagedAt: string): Promise<void> {
  await requireStatus(db, id, "generated", "staged");
  await db
    .update(analysisRuns)
    .set({ status: "staged", stagedAt })
    .where(eq(analysisRuns.id, id));
}

export async function markAnalysisRunValidated<
  TQueryResult extends PgQueryResultHKT,
>(
  db: AppDatabase<TQueryResult>,
  id: string,
  validatedAt: string,
): Promise<void> {
  await requireStatus(db, id, "staged", "validated");
  await db
    .update(analysisRuns)
    .set({ status: "validated", validatedAt })
    .where(eq(analysisRuns.id, id));
}

export async function markAnalysisRunApproved<
  TQueryResult extends PgQueryResultHKT,
>(
  db: AppDatabase<TQueryResult>,
  id: string,
  approvedAt: string,
  approvedBy: string,
): Promise<void> {
  await requireStatus(db, id, "validated", "approved");
  await db
    .update(analysisRuns)
    .set({ status: "approved", approvedAt, approvedBy })
    .where(eq(analysisRuns.id, id));
}

/**
 * Publishes an approved run and repoints the given channel's publication
 * pointer at it in the same database transaction, so a reader can never
 * observe a run marked "published" without the pointer already reflecting
 * it, or the reverse.
 */
export async function publishAnalysisRun<TQueryResult extends PgQueryResultHKT>(
  db: AppDatabase<TQueryResult>,
  id: string,
  publishedAt: string,
  channel: string,
  updatedBy: string,
): Promise<void> {
  await db.transaction(async (tx) => {
    const [run] = await tx
      .select()
      .from(analysisRuns)
      .where(eq(analysisRuns.id, id))
      .limit(1);
    if (!run) throw new Error(`Analysis run ${id} does not exist.`);
    if (run.status !== "approved") {
      throw new Error(
        `Analysis run ${id} must be "approved" to publish; was "${run.status}".`,
      );
    }

    await tx
      .update(analysisRuns)
      .set({ status: "published", publishedAt })
      .where(eq(analysisRuns.id, id));

    await tx
      .insert(publicationPointers)
      .values({
        channel,
        currentAnalysisRunId: id,
        updatedAt: publishedAt,
        updatedBy,
      })
      .onConflictDoUpdate({
        target: publicationPointers.channel,
        set: {
          currentAnalysisRunId: id,
          updatedAt: publishedAt,
          updatedBy,
        },
      });
  });
}

export async function markAnalysisRunRejected<
  TQueryResult extends PgQueryResultHKT,
>(
  db: AppDatabase<TQueryResult>,
  id: string,
  failureStage: string,
  failureCategory: string,
): Promise<void> {
  await db
    .update(analysisRuns)
    .set({ status: "rejected", failureStage, failureCategory })
    .where(eq(analysisRuns.id, id));
}

async function requireStatus<TQueryResult extends PgQueryResultHKT>(
  db: AppDatabase<TQueryResult>,
  id: string,
  expectedStatus: AnalysisRun["status"],
  nextStatus: AnalysisRun["status"],
): Promise<void> {
  const run = await findAnalysisRunById(db, id);
  if (!run) throw new Error(`Analysis run ${id} does not exist.`);
  if (run.status !== expectedStatus) {
    throw new Error(
      `Analysis run ${id} must be "${expectedStatus}" to move to "${nextStatus}"; was "${run.status}".`,
    );
  }
}

function toAnalysisRun(row: typeof analysisRuns.$inferSelect): AnalysisRun {
  return {
    id: row.id,
    status: row.status as AnalysisRun["status"],
    universeVersionId: row.universeVersionId,
    snapshotType: row.snapshotType,
    marketDataAsOf: row.marketDataAsOf,
    generatedAt: row.generatedAt,
    stagedAt: row.stagedAt,
    validatedAt: row.validatedAt,
    approvedAt: row.approvedAt,
    approvedBy: row.approvedBy,
    publishedAt: row.publishedAt,
    supersededAt: row.supersededAt,
    supersededByRunId: row.supersededByRunId,
    engineVersion: row.engineVersion,
    rulesetVersion: row.rulesetVersion,
    decisionConfidenceModelVersion: row.decisionConfidenceModelVersion,
    selectionModelVersion: row.selectionModelVersion,
    strategyAlignmentVersion: row.strategyAlignmentVersion,
    payloadSchemaVersion: row.payloadSchemaVersion,
    bundleChecksum: row.bundleChecksum,
    analyticalFingerprint: row.analyticalFingerprint,
    equivalentRunId: row.equivalentRunId,
    failureStage: row.failureStage,
    failureCategory: row.failureCategory,
  };
}
