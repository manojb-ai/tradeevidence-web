import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { buildFounderReview } from "@/src/application/get-founder-review";
import {
  enrichPublicationFromFiles,
  parseArtifact,
} from "./file-candidate-publication";

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
        observed_state: "bull_aligned",
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

function artifact(results: unknown[]) {
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

  it("translates ABBV-like momentum and supplied averages into guided language", () => {
    const abbv = {
      ...result("ABBV", 71),
      principal_contradiction: "daily_momentum",
      factors: [
        {
          factor_code: "daily_momentum",
          group: "momentum",
          observed_state: "bullish_weakening",
          effect: "supporting",
          explanation: "Daily Momentum evaluated as bullish weakening.",
          unavailable_reason: null,
        },
        {
          factor_code: "weekly_trend",
          group: "higher_timeframe",
          observed_state: "bullish",
          effect: "supporting",
          explanation: "Weekly Trend evaluated as bullish.",
          unavailable_reason: null,
        },
      ],
    };
    const publication = parseArtifact(artifact([abbv]));
    publication.results[0].ema21 = 256.85;
    publication.results[0].sma50 = 253.17;
    const record = buildFounderReview(publication).all[0];

    expect(record.devilsAdvocateTakeaway).toMatch(
      /still supported.*weakening/i,
    );
    expect(record.devilsAdvocateWhyItMatters).toMatch(/not.*proof.*reversed/i);
    expect(record.momentumRelationship).toMatch(
      /daily momentum is bullish but weakening; weekly momentum is bullish/i,
    );
    expect(record.invalidationTakeaway).toMatch(/\$256\.85.*\$253\.17/i);
    expect(record.invalidationWhyItMatters).toMatch(/two consecutive/i);
  });

  it("joins canonical price and instrument identity by symbol", () => {
    const directory = mkdtempSync(join(tmpdir(), "tradeevidence-publication-"));
    const prices = join(directory, "prices.csv");
    const references = join(directory, "references.csv");
    writeFileSync(
      prices,
      "Symbol,Last,EMA21,SMA50\nAAA,131.71,129.46,126.44\n",
      "utf8",
    );
    writeFileSync(
      references,
      'Symbol,CompanyName,Exchange,Currency\nAAA,"ALPHA, INC",NASDAQ,USD\n',
      "utf8",
    );

    const publication = enrichPublicationFromFiles(
      parseArtifact(artifact([result("AAA", 90)])),
      prices,
      references,
    );

    expect(publication.results[0]).toMatchObject({
      canonicalPrice: 131.71,
      ema21: 129.46,
      sma50: 126.44,
      companyName: "ALPHA, INC",
      exchange: "NASDAQ",
      currency: "USD",
    });

    writeFileSync(
      prices,
      "Symbol,Last,EMA21,SMA50\nAAA,131.71,129.46,NaN\n",
      "utf8",
    );
    expect(
      enrichPublicationFromFiles(
        parseArtifact(artifact([result("AAA", 90)])),
        prices,
        references,
      ).results[0].sma50,
    ).toBeNull();

    writeFileSync(
      references,
      "Symbol,CompanyName,Exchange,Currency\nBBB,BETA INC,NYSE,USD\n",
      "utf8",
    );
    expect(() =>
      enrichPublicationFromFiles(
        parseArtifact(artifact([result("AAA", 90)])),
        prices,
        references,
      ),
    ).toThrow(/no instrument reference row/i);
  });
});
