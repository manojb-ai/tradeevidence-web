import { describe, expect, it } from "vitest";
import { uuidv7 } from "uuidv7";

import {
  findAnalysisRunById,
  insertAnalysisRun,
  markAnalysisRunApproved,
  markAnalysisRunRejected,
  markAnalysisRunStaged,
  markAnalysisRunValidated,
  publishAnalysisRun,
} from "@/src/infrastructure/db/repositories/analysis-run-repository";
import { getCurrentPublicationPointer } from "@/src/infrastructure/db/repositories/publication-pointer-repository";
import { createTestDatabase } from "@/src/infrastructure/db/test-utils/create-test-database";
import { seedUniverseVersion } from "@/src/infrastructure/db/test-utils/seed-fixtures";

async function insertTestRun(
  db: Awaited<ReturnType<typeof createTestDatabase>>,
  universeVersionId: string,
) {
  return insertAnalysisRun(db, {
    universeVersionId,
    snapshotType: "eod",
    marketDataAsOf: "2026-09-20T21:00:00.000Z",
    generatedAt: "2026-09-20T21:05:00.000Z",
    engineVersion: "candidate.2",
    rulesetVersion: "ruleset.2",
    decisionConfidenceModelVersion: "n/a",
    selectionModelVersion: "n/a",
    strategyAlignmentVersion: "n/a",
    payloadSchemaVersion: "v1",
    bundleChecksum: "checksum-1",
    analyticalFingerprint: "fingerprint-1",
  });
}

// Postgres round-trips a timestamptz through its own text representation,
// which does not necessarily match the exact ISO-8601 string that was
// inserted (e.g. a space instead of "T"). Comparing via Date normalizes
// that away without asserting on a specific driver's formatting.
function isoOf(value: string | null): string | null {
  return value === null ? null : new Date(value).toISOString();
}

describe("analysis run repository (pglite)", () => {
  it("creates a run in the generated state and re-reads it", async () => {
    const db = await createTestDatabase();
    const universeVersionId = await seedUniverseVersion(db);

    const run = await insertTestRun(db, universeVersionId);

    expect(run.status).toBe("generated");
    expect(run.universeVersionId).toBe(universeVersionId);
    expect(run.bundleChecksum).toBe("checksum-1");

    const fetched = await findAnalysisRunById(db, run.id);
    expect(fetched?.id).toBe(run.id);
    expect(fetched?.status).toBe("generated");
    expect(isoOf(fetched?.generatedAt ?? null)).toBe(
      "2026-09-20T21:05:00.000Z",
    );
  });

  it("moves a run through staged -> validated -> approved -> published, and repoints the channel", async () => {
    const db = await createTestDatabase();
    const universeVersionId = await seedUniverseVersion(db);
    const run = await insertTestRun(db, universeVersionId);
    // approved_by / updated_by are real `uuid` columns (they reference a
    // future users.id per MVP-Data-Schema.md, even before that table
    // exists), not free text — a plain placeholder like "founder" fails
    // at the database level, correctly, so the test actor needs a real one.
    const founderId = uuidv7();

    await markAnalysisRunStaged(db, run.id, "2026-09-20T21:10:00.000Z");
    await markAnalysisRunValidated(db, run.id, "2026-09-20T21:15:00.000Z");
    await markAnalysisRunApproved(
      db,
      run.id,
      "2026-09-20T21:20:00.000Z",
      founderId,
    );
    await publishAnalysisRun(
      db,
      run.id,
      "2026-09-20T21:25:00.000Z",
      "homepage",
      founderId,
    );

    const published = await findAnalysisRunById(db, run.id);
    expect(published?.status).toBe("published");
    expect(isoOf(published?.publishedAt ?? null)).toBe(
      "2026-09-20T21:25:00.000Z",
    );

    const pointer = await getCurrentPublicationPointer(db, "homepage");
    expect(pointer?.currentAnalysisRunId).toBe(run.id);
    expect(pointer?.updatedBy).toBe(founderId);
  });

  it("refuses to publish a run that has not been approved", async () => {
    const db = await createTestDatabase();
    const universeVersionId = await seedUniverseVersion(db);
    const run = await insertTestRun(db, universeVersionId);

    await expect(
      publishAnalysisRun(
        db,
        run.id,
        "2026-09-20T21:25:00.000Z",
        "homepage",
        uuidv7(),
      ),
    ).rejects.toThrow(/must be "approved"/);
  });

  it("refuses to skip a pipeline stage", async () => {
    const db = await createTestDatabase();
    const universeVersionId = await seedUniverseVersion(db);
    const run = await insertTestRun(db, universeVersionId);

    await expect(
      markAnalysisRunValidated(db, run.id, "2026-09-20T21:15:00.000Z"),
    ).rejects.toThrow(/must be "staged"/);
  });

  it("records a rejection with its failure stage and category", async () => {
    const db = await createTestDatabase();
    const universeVersionId = await seedUniverseVersion(db);
    const run = await insertTestRun(db, universeVersionId);

    await markAnalysisRunRejected(db, run.id, "validation", "data_quality");

    const rejected = await findAnalysisRunById(db, run.id);
    expect(rejected?.status).toBe("rejected");
    expect(rejected?.failureStage).toBe("validation");
    expect(rejected?.failureCategory).toBe("data_quality");
  });
});
