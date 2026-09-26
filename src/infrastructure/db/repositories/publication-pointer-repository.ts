import { eq } from "drizzle-orm";
import type { PgQueryResultHKT } from "drizzle-orm/pg-core";

import type { PublicationPointer } from "@/src/domain/analysis-run";
import type { AppDatabase } from "@/src/infrastructure/db/repositories/types";
import { publicationPointers } from "@/src/infrastructure/db/schema";

/**
 * Read-only lookup of "what's currently published on this channel".
 * Writes to this table only ever happen transactionally alongside an
 * analysis run's own status change — see `publishAnalysisRun` in
 * `analysis-run-repository.ts` — so there is no standalone write here.
 */
export async function getCurrentPublicationPointer<
  TQueryResult extends PgQueryResultHKT,
>(
  db: AppDatabase<TQueryResult>,
  channel: string,
): Promise<PublicationPointer | null> {
  const [row] = await db
    .select()
    .from(publicationPointers)
    .where(eq(publicationPointers.channel, channel))
    .limit(1);
  return row
    ? {
        channel: row.channel,
        currentAnalysisRunId: row.currentAnalysisRunId,
        updatedAt: row.updatedAt,
        updatedBy: row.updatedBy,
      }
    : null;
}
