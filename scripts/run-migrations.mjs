// Applies the SQL migrations under src/infrastructure/db/migrations/ to
// a real Postgres database (Epic E2). Deliberately self-contained
// (plain .mjs, no import from src/), matching this repo's other
// operational scripts (check-tracked-secrets.mjs,
// check-markdown-links.mjs) — this runs outside the Next.js/Vitest
// module resolution, so it reads DATABASE_URL directly rather than
// going through the shared, zod-validated env module.
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import process from "node:process";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    "DATABASE_URL is not set. Put your Supabase project's pooled " +
      "connection string in .env.local (see .env.example), or export it " +
      "for this one command.",
  );
  process.exit(1);
}

const client = postgres(databaseUrl, { max: 1, prepare: false });
const db = drizzle(client);

try {
  await migrate(db, {
    migrationsFolder: "./src/infrastructure/db/migrations",
  });
  console.log("Migrations applied.");
} finally {
  await client.end();
}
