/**
 * Single source of truth for the database schema (Epic E2). Every table
 * module re-exports here so `drizzle-kit generate` (see
 * `drizzle.config.ts`) sees the whole schema from one entry point, and
 * so application code imports tables from `@/src/infrastructure/db/schema`
 * rather than reaching into individual domain files.
 *
 * Covers the "analytical-run + reference domain" slice only — see each
 * file's own doc comment for what's deferred and why. Not wired into the
 * running app yet: nothing outside `src/infrastructure/db` imports from
 * here until Epic E4 (analytics ingestion) builds a database-backed
 * publication adapter.
 */
export * from "./reference";
export * from "./universe";
export * from "./market-data";
export * from "./analysis";
export * from "./snapshot";
