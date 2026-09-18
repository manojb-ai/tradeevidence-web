import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import type {
  CandidateClassification,
  CandidateEvidence,
  CandidatePublication,
  EvidenceFactor,
} from "@/src/domain/analytical-publication";
import {
  demoOpportunities,
  demoSnapshot,
} from "@/src/features/opportunities/demo-data";

const DEFAULT_ARTIFACT =
  "analytics-engine/output/2026-09-01-candidate-2/evidence_v2_20260902_024311Z.json";

type JsonRecord = Record<string, unknown>;

export function loadCandidatePublication(
  configuredPath = process.env.TRADEEVIDENCE_ANALYTICS_ARTIFACT,
): CandidatePublication {
  const artifactPath = resolve(
    /* turbopackIgnore: true */
    process.cwd(),
    configuredPath ?? DEFAULT_ARTIFACT,
  );

  if (!existsSync(artifactPath)) return illustrativeFallback();

  const parsed: unknown = JSON.parse(readFileSync(artifactPath, "utf8"));
  return parseArtifact(parsed, artifactPath);
}

export function parseArtifact(
  value: unknown,
  sourceLabel = "configured candidate artifact",
): CandidatePublication {
  const root = record(value, "artifact");
  const resultsValue = root.results;
  if (!Array.isArray(resultsValue) || resultsValue.length === 0) {
    throw new Error(
      "Candidate artifact must contain a non-empty results array.",
    );
  }

  const results = resultsValue.map(parseResult);
  const first = record(resultsValue[0], "results[0]");
  const summary = record(root.summary, "summary");
  const rowsEvaluated = integer(summary.rowsEvaluated, "summary.rowsEvaluated");

  if (rowsEvaluated !== results.length) {
    throw new Error(
      `Candidate artifact row count mismatch: summary=${rowsEvaluated}, results=${results.length}.`,
    );
  }

  const invariantFields = [
    "market_date",
    "engine_version",
    "ruleset_version",
    "source_checksum",
  ] as const;
  for (const [index, raw] of resultsValue.entries()) {
    const current = record(raw, `results[${index}]`);
    for (const field of invariantFields) {
      if (text(current[field], `results[${index}].${field}`) !== first[field]) {
        throw new Error(`Candidate artifact mixes ${field} values.`);
      }
    }
  }

  return {
    source: "candidate-artifact",
    sourceLabel,
    marketDate: text(first.market_date, "results[0].market_date"),
    generatedAt: text(root.generatedAt, "generatedAt"),
    engineVersion: text(first.engine_version, "results[0].engine_version"),
    rulesetVersion: text(first.ruleset_version, "results[0].ruleset_version"),
    sourceChecksum: text(first.source_checksum, "results[0].source_checksum"),
    rowsEvaluated,
    completeCount: results.filter((result) => result.status === "complete")
      .length,
    results,
  };
}

function parseResult(value: unknown, index: number): CandidateEvidence {
  const raw = record(value, `results[${index}]`);
  const factorsRaw = raw.factors;
  if (!Array.isArray(factorsRaw)) {
    throw new Error(`results[${index}].factors must be an array.`);
  }

  const status = text(raw.status, `results[${index}].status`);
  if (status !== "complete" && status !== "incomplete") {
    throw new Error(`Unsupported evidence status: ${status}.`);
  }

  const classification = text(
    raw.classification,
    `results[${index}].classification`,
  );
  if (!isClassification(classification)) {
    throw new Error(`Unsupported classification: ${classification}.`);
  }

  const direction = text(raw.direction, `results[${index}].direction`);
  if (
    direction !== "bullish" &&
    direction !== "bearish" &&
    direction !== "neutral" &&
    direction !== "incomplete"
  ) {
    throw new Error(`Unsupported direction: ${direction}.`);
  }

  const score = raw.alignment_score;
  if (
    score !== null &&
    (typeof score !== "number" || !Number.isFinite(score))
  ) {
    throw new Error(
      `results[${index}].alignment_score must be numeric or null.`,
    );
  }

  const factors = factorsRaw.map((factor, factorIndex) =>
    parseFactor(factor, index, factorIndex),
  );
  const bullish = number(raw.bullish_total, `results[${index}].bullish_total`);
  const bearish = number(raw.bearish_total, `results[${index}].bearish_total`);
  const neutral = number(raw.neutral_total, `results[${index}].neutral_total`);
  const unavailable = number(
    raw.unavailable_total,
    `results[${index}].unavailable_total`,
  );
  const eligible = number(
    raw.eligible_capacity,
    `results[${index}].eligible_capacity`,
  );
  if (bullish + bearish + neutral + unavailable !== eligible) {
    throw new Error(`results[${index}] factor ledger does not reconcile.`);
  }

  return {
    symbol: text(
      raw.symbol_at_observation,
      `results[${index}].symbol_at_observation`,
    ),
    status,
    classification,
    direction,
    alignmentScore: score,
    alignmentBand: nullableText(raw.alignment_band),
    coverage: number(raw.coverage, `results[${index}].coverage`),
    principalSupport: nullableText(raw.principal_support),
    principalContradiction: nullableText(raw.principal_contradiction),
    summary: text(raw.summary, `results[${index}].summary`),
    invalidationConditions: stringArray(
      raw.invalidation_conditions,
      `results[${index}].invalidation_conditions`,
    ),
    factors,
  };
}

function parseFactor(
  value: unknown,
  resultIndex: number,
  factorIndex: number,
): EvidenceFactor {
  const label = `results[${resultIndex}].factors[${factorIndex}]`;
  const raw = record(value, label);
  return {
    code: text(raw.factor_code, `${label}.factor_code`),
    group: text(raw.group, `${label}.group`),
    effect: text(raw.effect, `${label}.effect`),
    explanation: text(raw.explanation, `${label}.explanation`),
    unavailableReason: nullableText(raw.unavailable_reason),
  };
}

function illustrativeFallback(): CandidatePublication {
  return {
    source: "illustrative-fallback",
    sourceLabel: "built-in deterministic fixture",
    marketDate: demoSnapshot.marketDate,
    generatedAt: "",
    engineVersion: "illustrative",
    rulesetVersion: demoSnapshot.rulesetVersion,
    sourceChecksum: "illustrative",
    rowsEvaluated: demoOpportunities.length,
    completeCount: demoOpportunities.length,
    results: demoOpportunities.map((item) => ({
      symbol: item.symbol,
      status: "complete",
      classification:
        item.direction === "Bullish"
          ? "bullish"
          : item.direction === "Bearish"
            ? "bearish"
            : "bullish_watch",
      direction:
        item.direction === "Bullish"
          ? "bullish"
          : item.direction === "Bearish"
            ? "bearish"
            : "neutral",
      alignmentScore: item.evidenceScore,
      alignmentBand: "illustrative",
      coverage: 100,
      principalSupport: "trend_structure",
      principalContradiction: null,
      summary: item.principalSupport,
      invalidationConditions: [item.invalidation],
      factors: [
        {
          code: "trend_structure",
          group: "trend",
          effect: "supporting",
          explanation: item.trendEvidence,
          unavailableReason: null,
        },
        {
          code: "daily_momentum",
          group: "momentum",
          effect: "supporting",
          explanation: item.momentumEvidence,
          unavailableReason: null,
        },
        {
          code: "timeframe_tension",
          group: "higher_timeframe",
          effect: "contradicting",
          explanation: item.contradiction,
          unavailableReason: null,
        },
      ],
    })),
  };
}

function record(value: unknown, label: string): JsonRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  return value as JsonRecord;
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return value;
}

function nullableText(value: unknown): string | null {
  return value === null ? null : typeof value === "string" ? value : null;
}

function number(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} must be numeric.`);
  }
  return value;
}

function integer(value: unknown, label: string): number {
  const parsed = number(value, label);
  if (!Number.isInteger(parsed))
    throw new Error(`${label} must be an integer.`);
  return parsed;
}

function stringArray(value: unknown, label: string): string[] {
  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === "string")
  ) {
    throw new Error(`${label} must be a string array.`);
  }
  return value;
}

function isClassification(value: string): value is CandidateClassification {
  return [
    "bullish",
    "bearish",
    "bullish_watch",
    "bearish_watch",
    "neutral",
    "incomplete",
  ].includes(value);
}
