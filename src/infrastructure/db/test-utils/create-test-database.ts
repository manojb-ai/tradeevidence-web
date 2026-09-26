import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import * as schema from "@/src/infrastructure/db/schema";

/**
 * Spins up a fresh, isolated in-memory Postgres (via pglite) and applies
 * every generated migration to it, so repository tests exercise real SQL
 * — constraints, FKs, CHECKs — without needing Docker or a real database.
 * Each call returns a brand-new, empty database; tests don't need to
 * reset state between each other as long as each test calls this itself.
 */
export async function createTestDatabase() {
  const client = new PGlite();
  const db = drizzle(client, { schema });
  await migrate(db, {
    migrationsFolder: "./src/infrastructure/db/migrations",
  });
  return db;
}
