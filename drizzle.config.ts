import { defineConfig } from "drizzle-kit";

/**
 * Epic E2 (PostgreSQL data platform). `npm run db:generate` reads the
 * schema modules under `src/infrastructure/db/schema/` — the single
 * source of truth for table shape — and writes an ordered SQL migration
 * into `src/infrastructure/db/migrations/`. It does not need a live
 * database connection; only actually applying a migration
 * (`npm run db:migrate`) does, via `DATABASE_URL`.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/db/schema/index.ts",
  out: "./src/infrastructure/db/migrations",
  strict: true,
  verbose: true,
});
