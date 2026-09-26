import { uuidv7 } from "uuidv7";

import { universes, universeVersions } from "@/src/infrastructure/db/schema";
import type { createTestDatabase } from "@/src/infrastructure/db/test-utils/create-test-database";

/**
 * Minimal universe + universe-version row, used only to satisfy
 * `analysis_runs.universe_version_id`'s required foreign key in tests.
 * The universe domain's own repository layer is out of scope for this
 * slice (analytical-run + reference domain) — this is a raw insert
 * against the schema directly, not a repository function. Typed against
 * the concrete pglite test database (not the generic `AppDatabase`),
 * since this helper is test-only by design.
 */
export async function seedUniverseVersion(
  db: Awaited<ReturnType<typeof createTestDatabase>>,
): Promise<string> {
  const universeId = uuidv7();
  await db.insert(universes).values({
    id: universeId,
    code: `test-universe-${universeId}`,
    description: null,
  });

  const universeVersionId = uuidv7();
  await db.insert(universeVersions).values({
    id: universeVersionId,
    universeId,
    version: "v1",
    asOf: "2026-09-01",
    selectionMethod: "test-fixture",
    eligibilityRules: {},
    exclusionRules: {},
    requestedCount: 1,
    contentFingerprint: `fixture-${universeVersionId}`,
    createdAt: new Date().toISOString(),
  });

  return universeVersionId;
}
