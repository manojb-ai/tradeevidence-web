import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { CandidatePublication } from "@/src/domain/analytical-publication";

import { parseArtifact } from "./file-candidate-publication";
import { getServerEnv } from "@/src/infrastructure/config/env";

/**
 * Loads the market/sector context publication: the same Evidence Engine v2
 * contract used for the stock universe, run instead against the 14 approved
 * broad-market and sector ETFs. This is optional supplementary context, not
 * the core product boundary, so an unconfigured or missing artifact returns
 * null rather than falling back to an illustrative fixture.
 */
export function loadContextPublication(
  configuredPath = getServerEnv().TRADEEVIDENCE_CONTEXT_ARTIFACT,
): CandidatePublication | null {
  if (!configuredPath) return null;

  const artifactPath = resolve(
    /* turbopackIgnore: true */
    process.cwd(),
    configuredPath,
  );

  if (!existsSync(artifactPath)) return null;

  const parsed: unknown = JSON.parse(readFileSync(artifactPath, "utf8"));
  return parseArtifact(parsed, artifactPath);
}
