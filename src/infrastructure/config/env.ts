import { z } from "zod";

/**
 * Validated environment configuration (Epic E1 — delivery foundation).
 *
 * Server-only variables live in `serverEnv`. Nothing here is prefixed
 * `NEXT_PUBLIC_`, so nothing in this module is safe to import from a
 * client component — if a future variable genuinely needs to reach the
 * browser, add it to `publicEnvSchema` below with the `NEXT_PUBLIC_`
 * prefix Next.js requires, never by relaxing this file's server-only
 * contract.
 *
 * All current variables are optional: each has a documented fallback
 * (a bundled September 2026 sample artifact, an illustrative demo
 * fixture, or `null`/"context omitted"). That is a deliberate MVP
 * property, not an oversight — see
 * `src/infrastructure/analytics/file-candidate-publication.ts` and
 * `file-context-publication.ts`. This module's job is to fail fast with
 * a clear message if a variable is *set but malformed*, and to give the
 * rest of the app one typed, validated source of truth instead of
 * scattered `process.env.X` reads. As E2+ introduce vendor credentials
 * (Supabase, Sentry, OpenAI, Resend), add them here as required in
 * staging/production — see the per-environment note at the bottom of
 * this file.
 */
const serverEnvSchema = z.object({
  TRADEEVIDENCE_ANALYTICS_ARTIFACT: z
    .string()
    .min(1, "TRADEEVIDENCE_ANALYTICS_ARTIFACT must not be empty if set")
    .optional(),
  TRADEEVIDENCE_SYMBOL_EVIDENCE_FILE: z
    .string()
    .min(1, "TRADEEVIDENCE_SYMBOL_EVIDENCE_FILE must not be empty if set")
    .optional(),
  TRADEEVIDENCE_INSTRUMENT_REFERENCE_FILE: z
    .string()
    .min(1, "TRADEEVIDENCE_INSTRUMENT_REFERENCE_FILE must not be empty if set")
    .optional(),
  TRADEEVIDENCE_CONTEXT_ARTIFACT: z
    .string()
    .min(1, "TRADEEVIDENCE_CONTEXT_ARTIFACT must not be empty if set")
    .optional(),
  // Postgres connection string (Epic E2). Optional for now: no code path
  // depends on it yet outside src/infrastructure/db, which is not wired
  // into the app until Epic E4. Points at the Supabase project's pooled
  // connection string once one exists; unset in local/CI test runs, which
  // use an in-memory Postgres (pglite) instead.
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL must not be empty if set")
    .optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function parseServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse({
    TRADEEVIDENCE_ANALYTICS_ARTIFACT:
      process.env.TRADEEVIDENCE_ANALYTICS_ARTIFACT,
    TRADEEVIDENCE_SYMBOL_EVIDENCE_FILE:
      process.env.TRADEEVIDENCE_SYMBOL_EVIDENCE_FILE,
    TRADEEVIDENCE_INSTRUMENT_REFERENCE_FILE:
      process.env.TRADEEVIDENCE_INSTRUMENT_REFERENCE_FILE,
    TRADEEVIDENCE_CONTEXT_ARTIFACT: process.env.TRADEEVIDENCE_CONTEXT_ARTIFACT,
    DATABASE_URL: process.env.DATABASE_URL,
  });

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment configuration. Fix the following and restart:\n${issues}`,
    );
  }

  return result.data;
}

/**
 * Validated, typed server environment. Parses `process.env` fresh on
 * every call rather than caching — deliberately, matching this
 * codebase's existing pattern (see `loadCandidatePublication`'s
 * `configuredPath` default parameter) of reading environment variables
 * at call time so tests can use `vi.stubEnv`/`vi.unstubAllEnvs` without
 * a stale module-level cache leaking between them. The parse itself is
 * a handful of string checks — cheap enough to redo per call. A
 * malformed value throws immediately (fail fast) rather than surfacing
 * as a confusing downstream file-system or parsing error.
 */
export function getServerEnv(): ServerEnv {
  return parseServerEnv();
}
