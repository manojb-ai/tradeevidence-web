import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { getServerEnv } from "@/src/infrastructure/config/env";

import * as schema from "./schema";

export type Database = ReturnType<typeof createDatabase>;

/**
 * Creates a Drizzle client over a real Postgres connection (Supabase in
 * staging/production). Not called from anywhere in the running app yet
 * — Epic E4 wires a repository built on this into the publication path.
 *
 * `prepare: false` is required against Supabase's pooled connection
 * string: its connection pooler runs in transaction mode, which does not
 * support prepared statements — a well-known postgres.js/Supabase
 * interoperability requirement, not an arbitrary choice.
 */
export function createDatabase() {
  const { DATABASE_URL } = getServerEnv();
  if (!DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Set it in .env.local (see " +
        ".env.example) to a Supabase project's pooled connection string.",
    );
  }
  const client = postgres(DATABASE_URL, { prepare: false });
  return drizzle(client, { schema });
}
