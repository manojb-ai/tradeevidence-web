import { z } from "zod";

/**
 * Server-controlled feature flags and kill switches (Epic E1,
 * `docs/engineering/Vertical-Slice-01-Delivery-Foundation.md` AC-09).
 *
 * Environment-variable-driven for now: there is no database yet (E2)
 * and no admin surface to flip these at runtime. That is a deliberate,
 * temporary shape — changing a flag today means changing an env var
 * and redeploying, an acceptable kill switch for the friends-and-family
 * beta. It should move to a database-backed, no-redeploy toggle once E2
 * lands and there's an operator to use it.
 *
 * Registry (owner, purpose, default, review/removal condition —
 * `docs/engineering/Deployment-Architecture.md`'s "Flags have owners,
 * defaults, purpose, review date, and removal conditions"):
 *
 * | Flag | Owner | Purpose | Default | Review/removal condition |
 * |---|---|---|---|---|
 * | marketContextEnabled | Founder/Architect | Gates the homepage's Market & Sector Snapshot (CHANGELOG: "Local-only and experimental; not part of the published analytics contract") | **off** | Remove the flag (make it always-on) once the section is approved as part of the published analytics contract, per AC-09 |
 * | aiEnabled | Founder/Architect | Gates "Ask TradeEvidence" (Epic E9) | **off** | Remove/flip once E9 ships and is approved for the active rollout stage |
 * | exportsEnabled | Founder/Architect | Gates any user-facing data export (Epic E7+) | **off** | Remove/flip once an export feature ships and is approved |
 *
 * `marketContextEnabled` and `aiEnabled` default off per AC-09
 * ("Experimental analytics publication and Ask TradeEvidence are
 * disabled by default through server-owned configuration. Ordinary
 * browser input cannot enable them.") — there is no query-string or
 * client-side override for any flag here; only an environment variable
 * on the server can change one.
 */
const flagsEnvSchema = z.object({
  TRADEEVIDENCE_FLAG_MARKET_CONTEXT_ENABLED: z
    .enum(["true", "false"])
    .optional(),
  TRADEEVIDENCE_FLAG_AI_ENABLED: z.enum(["true", "false"]).optional(),
  TRADEEVIDENCE_FLAG_EXPORTS_ENABLED: z.enum(["true", "false"]).optional(),
});

export type FeatureFlags = {
  /** Homepage Market & Sector Snapshot — experimental, off by default (AC-09). */
  marketContextEnabled: boolean;
  /** "Ask TradeEvidence" (E9) — not built yet, off by default (AC-09). */
  aiEnabled: boolean;
  /** Any user-facing data export (E7+) — not built yet, off by default. */
  exportsEnabled: boolean;
};

/**
 * Parses `process.env` fresh on every call — see the matching note on
 * `getServerEnv` in `./env.ts` for why this module deliberately does
 * not cache.
 */
export function getFeatureFlags(): FeatureFlags {
  const result = flagsEnvSchema.safeParse({
    TRADEEVIDENCE_FLAG_MARKET_CONTEXT_ENABLED:
      process.env.TRADEEVIDENCE_FLAG_MARKET_CONTEXT_ENABLED,
    TRADEEVIDENCE_FLAG_AI_ENABLED: process.env.TRADEEVIDENCE_FLAG_AI_ENABLED,
    TRADEEVIDENCE_FLAG_EXPORTS_ENABLED:
      process.env.TRADEEVIDENCE_FLAG_EXPORTS_ENABLED,
  });

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid feature-flag configuration (expected "true" or "false"). Fix the following and restart:\n${issues}`,
    );
  }

  const env = result.data;
  return {
    marketContextEnabled:
      env.TRADEEVIDENCE_FLAG_MARKET_CONTEXT_ENABLED === "true",
    aiEnabled: env.TRADEEVIDENCE_FLAG_AI_ENABLED === "true",
    exportsEnabled: env.TRADEEVIDENCE_FLAG_EXPORTS_ENABLED === "true",
  };
}
