import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "./page";

function writeContextFixture(): string {
  const dir = mkdtempSync(join(tmpdir(), "te-context-"));
  const path = join(dir, "context.json");
  const result = {
    symbol_at_observation: "SPY",
    market_date: "2026-09-20",
    status: "complete",
    direction: "bullish",
    classification: "bullish",
    alignment_score: 70,
    alignment_band: "strong_alignment",
    coverage: 100,
    eligible_capacity: 100,
    bullish_total: 70,
    bearish_total: 0,
    neutral_total: 30,
    unavailable_total: 0,
    factors: [
      {
        factor_code: "trend_structure",
        group: "trend",
        observed_state: "bull_aligned",
        effect: "supporting",
        explanation: "SPY supporting explanation",
        unavailable_reason: null,
      },
    ],
    principal_support: "trend_structure",
    principal_contradiction: null,
    summary: "SPY summary",
    invalidation_conditions: ["Reassess SPY"],
    engine_version: "candidate.2",
    ruleset_version: "ruleset.2",
    source_checksum: "context-fixture",
  };
  writeFileSync(
    path,
    JSON.stringify({
      generatedAt: "2026-09-20T21:50:13Z",
      summary: { rowsEvaluated: 1 },
      results: [result],
    }),
  );
  return path;
}

describe("TradeEvidence founder preview", () => {
  beforeEach(() => {
    vi.stubEnv(
      "TRADEEVIDENCE_ANALYTICS_ARTIFACT",
      "missing-test-artifact.json",
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders the briefing and preserves its educational boundary", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /start with the evidence/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not provide financial advice/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "YES" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "WATCH" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "NO" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /open decision workspace/i }),
    ).toHaveLength(3);
    expect(
      screen.getByText(/configured local artifact was not found/i),
    ).toBeInTheDocument();
  });

  it("does not render market/sector context when no context artifact is configured", () => {
    render(<Home />);

    expect(
      screen.queryByRole("heading", { name: /market & sector snapshot/i }),
    ).not.toBeInTheDocument();
  });

  it("keeps the experimental market/sector snapshot off by default even when a context artifact is configured (AC-09)", () => {
    vi.stubEnv("TRADEEVIDENCE_CONTEXT_ARTIFACT", writeContextFixture());

    render(<Home />);

    expect(
      screen.queryByRole("heading", { name: /market & sector snapshot/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the market/sector snapshot only once its server-owned flag is explicitly enabled", () => {
    vi.stubEnv("TRADEEVIDENCE_CONTEXT_ARTIFACT", writeContextFixture());
    vi.stubEnv("TRADEEVIDENCE_FLAG_MARKET_CONTEXT_ENABLED", "true");

    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /market & sector snapshot/i }),
    ).toBeInTheDocument();
  });
});
