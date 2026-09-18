import { describe, expect, it } from "vitest";

import { buildFounderReview } from "@/src/application/get-founder-review";
import { parseArtifact } from "./file-candidate-publication";

function result(symbol: string, score: number) {
  return {
    symbol_at_observation: symbol,
    market_date: "2026-09-01",
    status: "complete",
    direction: "bullish",
    classification: "bullish",
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
        effect: "supporting",
        explanation: `${symbol} trend explanation`,
        unavailable_reason: null,
      },
    ],
    principal_support: "trend_structure",
    principal_contradiction: null,
    summary: `${symbol} summary`,
    invalidation_conditions: [`Reassess ${symbol}`],
    engine_version: "candidate.2",
    ruleset_version: "ruleset.2",
    source_checksum: "abc123",
  };
}

function artifact(results: ReturnType<typeof result>[]) {
  return {
    generatedAt: "2026-09-02T02:43:11Z",
    summary: { rowsEvaluated: results.length },
    results,
  };
}

describe("file-backed candidate publication", () => {
  it("validates the artifact and preserves the engine score", () => {
    const publication = parseArtifact(artifact([result("BBB", 84)]));

    expect(publication.marketDate).toBe("2026-09-01");
    expect(publication.results[0].alignmentScore).toBe(84);
    expect(publication.results[0].factors[0].explanation).toContain("BBB");
  });

  it("rejects a summary/result count mismatch", () => {
    const value = artifact([result("AAA", 80)]);
    value.summary.rowsEvaluated = 2;

    expect(() => parseArtifact(value)).toThrow(/row count mismatch/i);
  });

  it("orders founder review records deterministically without rescoring", () => {
    const publication = parseArtifact(
      artifact([result("ZZZ", 80), result("BBB", 90), result("AAA", 90)]),
    );
    const review = buildFounderReview(publication);

    expect(review.featured.map(({ symbol }) => symbol)).toEqual([
      "AAA",
      "BBB",
      "ZZZ",
    ]);
    expect(review.featured.map(({ alignmentScore }) => alignmentScore)).toEqual(
      [90, 90, 80],
    );
  });
});
