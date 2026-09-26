import { eq, inArray } from "drizzle-orm";
import type { PgQueryResultHKT } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

import type {
  Instrument,
  NewInstrumentInput,
  NewSectorInput,
  Sector,
} from "@/src/domain/reference";
import type { AppDatabase } from "@/src/infrastructure/db/repositories/types";
import { instruments, sectors } from "@/src/infrastructure/db/schema";

export async function insertInstrument<TQueryResult extends PgQueryResultHKT>(
  db: AppDatabase<TQueryResult>,
  input: NewInstrumentInput,
): Promise<Instrument> {
  const [row] = await db
    .insert(instruments)
    .values({
      id: uuidv7(),
      instrumentType: input.instrumentType,
      legalName: input.legalName,
      status: input.status,
      createdAt: new Date().toISOString(),
    })
    .returning();
  return toInstrument(row);
}

export async function findInstrumentById<TQueryResult extends PgQueryResultHKT>(
  db: AppDatabase<TQueryResult>,
  id: string,
): Promise<Instrument | null> {
  const [row] = await db
    .select()
    .from(instruments)
    .where(eq(instruments.id, id))
    .limit(1);
  return row ? toInstrument(row) : null;
}

export async function findInstrumentsByIds<
  TQueryResult extends PgQueryResultHKT,
>(db: AppDatabase<TQueryResult>, ids: string[]): Promise<Instrument[]> {
  if (ids.length === 0) return [];
  const rows = await db
    .select()
    .from(instruments)
    .where(inArray(instruments.id, ids));
  return rows.map(toInstrument);
}

export async function insertSector<TQueryResult extends PgQueryResultHKT>(
  db: AppDatabase<TQueryResult>,
  input: NewSectorInput,
): Promise<Sector> {
  const [row] = await db
    .insert(sectors)
    .values({ id: uuidv7(), code: input.code, name: input.name })
    .returning();
  return toSector(row);
}

export async function findSectorByCode<TQueryResult extends PgQueryResultHKT>(
  db: AppDatabase<TQueryResult>,
  code: string,
): Promise<Sector | null> {
  const [row] = await db
    .select()
    .from(sectors)
    .where(eq(sectors.code, code))
    .limit(1);
  return row ? toSector(row) : null;
}

function toInstrument(row: typeof instruments.$inferSelect): Instrument {
  return {
    id: row.id,
    instrumentType: row.instrumentType as Instrument["instrumentType"],
    legalName: row.legalName,
    status: row.status as Instrument["status"],
    createdAt: row.createdAt,
  };
}

function toSector(row: typeof sectors.$inferSelect): Sector {
  return { id: row.id, code: row.code, name: row.name };
}
