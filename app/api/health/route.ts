import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { NextResponse } from "next/server";

import { getServerEnv } from "@/src/infrastructure/config/env";
import { logInfo, logWarn } from "@/src/infrastructure/observability/logger";

// Health checks must always run live: never cache, never prerender.
export const dynamic = "force-dynamic";

/**
 * Release identity (Epic E1). Vercel injects `VERCEL_GIT_COMMIT_SHA` and
 * `VERCEL_ENV` automatically at build and runtime on every deployment —
 * nothing to configure. Locally (no Vercel), both fall back to values
 * that make it obvious this isn't a deployed release.
 */
function releaseIdentity() {
  return {
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    environment: process.env.VERCEL_ENV ?? "development",
    // Approximates "when this instance started serving", not literal
    // build time — Vercel doesn't expose a build timestamp env var.
    // Good enough as a correlation aid: it changes on every new
    // deployment (each gets a fresh serverless instance).
    processStartedAt: PROCESS_STARTED_AT,
  };
}

const PROCESS_STARTED_AT = new Date().toISOString();

type ReadinessCheck = {
  ok: boolean;
  detail: string;
};

/**
 * Readiness: confirms configuration is valid and, if an analytics
 * artifact path is explicitly configured, that it actually resolves.
 * An *unconfigured* artifact is not a failure — the app deliberately
 * falls back to an illustrative fixture in that case (see
 * `file-candidate-publication.ts`). A *configured but unreadable* path
 * is a real misconfiguration worth surfacing.
 */
function checkAnalyticsArtifactConfig(): ReadinessCheck {
  try {
    const env = getServerEnv();
    if (!env.TRADEEVIDENCE_ANALYTICS_ARTIFACT) {
      return {
        ok: true,
        detail: "unconfigured (illustrative fallback active)",
      };
    }
    const artifactPath = resolve(
      /* turbopackIgnore: true */
      process.cwd(),
      env.TRADEEVIDENCE_ANALYTICS_ARTIFACT,
    );
    if (!existsSync(artifactPath)) {
      return {
        ok: false,
        detail: `configured artifact not found: ${env.TRADEEVIDENCE_ANALYTICS_ARTIFACT}`,
      };
    }
    return { ok: true, detail: "configured artifact resolves" };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "invalid environment",
    };
  }
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("check");
  // Set by proxy.ts on every request, including this one — reusing it
  // here (rather than minting a second ID) is what lets a support report
  // (which cites the response header) be matched to the log line below
  // for the same request (Epic E1, AC-08: "logs and responses can be
  // correlated safely").
  const correlationId = request.headers.get("x-correlation-id") ?? null;

  // Liveness: the process can respond at all. Never inspects
  // configuration or the file system, so it can't false-negative on a
  // dependency problem — that's what readiness is for. Deliberately not
  // logged: liveness is meant to be pinged frequently by uptime
  // monitors, and logging every ping would be noise, not signal.
  if (mode === "live") {
    return NextResponse.json({ status: "ok", release: releaseIdentity() });
  }

  const analyticsArtifact = checkAnalyticsArtifactConfig();
  const ready = analyticsArtifact.ok;

  if (ready) {
    logInfo("health.readiness", { correlationId, status: "ok" });
  } else {
    logWarn("health.readiness", {
      correlationId,
      status: "degraded",
      reason: analyticsArtifact.detail,
    });
  }

  return NextResponse.json(
    {
      status: ready ? "ok" : "degraded",
      release: releaseIdentity(),
      checks: { analyticsArtifact },
    },
    { status: ready ? 200 : 503 },
  );
}
