import { describe, expect, it } from "vitest";

import { parseArtifact } from "@/src/infrastructure/analytics/file-candidate-publication";

import { buildMarketContext } from "./get-market-context";

function result(symbol: string, classification: string, score: number) {
  return {
    symbol_at_observation: symbol,
    market_date: "2026-09-20",
    status: "complete",
    direction: classification.startsWith("bull")
      ? "bullish"
      : classification.startsWith("bear")
        ? "bearish"
        : "neutral",
    classification,
    alignment_score: score,
    alignment_band: "strong_alignment",
    coverage: 100,
    eligible_capacity: 100,
    bullish_total: score,
    bearish_total: 0,
    neutral_total: 100 - score,
    unavailable_total: 0,
    factors: [
      {
        factor_code: "trend_structure",
        group: "trend",
        observed_state: "bull_aligned",
        effect: "supporting",
        explanation: `${symbol} supporting explanation`,
        unavailable_reason: null,
      },
    ],
    principal_support: "trend_structure",
    principal_contradiction: null,
    summary: `${symbol} summary`,
    invalidation_conditions: [`Reassess ${symbol}`],
    engine_version: "candidate.2",
    ruleset_version: "ruleset.2",
    source_checksum: "context-abc",
  };
}

function artifact(results: unknown[]) {
  return {
    generatedAt: "2026-09-20T21:50:13Z",
    summary: { rowsEvaluated: results.length },
    results,
  };
}

describe("buildMarketContext", () => {
  it("separates broad-market symbols from sector ETFs and labels them", () => {
    const publication = parseArtifact(
      artifact([
        result("SPY", "bullish_watch", 55),
        result("XLK", "bullish", 70),
        result("XLU", "bearish", 30),
      ]),
    );

    const context = buildMarketContext(publication);

    expect(context.broadMarket).toHaveLength(1);
    expect(context.broadMarket[0]).toMatchObject({
      symbol: "SPY",
      label: "S&P 500 (SPY)",
      classificationLabel: "Bullish watch",
      alignmentScore: 55,
      summaryText: "SPY supporting explanation",
    });

    expect(context.sectors.map((sector) => sector.symbol)).toEqual([
      "XLK",
      "XLU",
    ]);
  });

  it("orders sectors by alignment score, strongest first", () => {
    const publication = parseArtifact(
      artifact([
        result("XLU", "bearish", 20),
        result("XLK", "bullish", 90),
        result("XLF", "neutral", 50),
      ]),
    );

    const context = buildMarketContext(publication);

    expect(context.sectors.map((sector) => sector.symbol)).toEqual([
      "XLK",
      "XLF",
      "XLU",
    ]);
  });

  it("omits labeled symbols that are absent from the run", () => {
    const publication = parseArtifact(artifact([result("XLK", "bullish", 70)]));

    const context = buildMarketContext(publication);

    expect(context.broadMarket).toHaveLength(0);
    expect(context.sectors).toHaveLength(1);
  });
});
