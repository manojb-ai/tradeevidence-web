import type {
  CandidateEvidence,
  CandidatePublication,
} from "@/src/domain/analytical-publication";
import { loadContextPublication } from "@/src/infrastructure/analytics/file-context-publication";

import {
  classificationLabel,
  type ClassificationLabel,
} from "./get-founder-review";

const BROAD_MARKET_LABELS: Record<string, string> = {
  SPY: "S&P 500 (SPY)",
  QQQ: "Nasdaq 100 (QQQ)",
  IWM: "Small caps (IWM)",
};

const SECTOR_LABELS: Record<string, string> = {
  XLK: "Information Technology",
  XLF: "Financials",
  XLV: "Health Care",
  XLY: "Consumer Discretionary",
  XLC: "Communication Services",
  XLI: "Industrials",
  XLP: "Consumer Staples",
  XLE: "Energy",
  XLU: "Utilities",
  XLRE: "Real Estate",
  XLB: "Materials",
};

export type MarketContextRecord = {
  symbol: string;
  label: string;
  classificationLabel: ClassificationLabel;
  alignmentScore: number | null;
  summaryText: string;
};

export type MarketContext = {
  publication: CandidatePublication;
  broadMarket: MarketContextRecord[];
  sectors: MarketContextRecord[];
};

/**
 * Reads the optional context artifact and shapes it into broad-market and
 * sector groups. Returns null when no context artifact is configured or
 * found — market/sector context is supplementary, not part of the core
 * publication boundary, so its absence must not affect the rest of the page.
 */
export function getMarketContext(): MarketContext | null {
  const publication = loadContextPublication();
  return publication ? buildMarketContext(publication) : null;
}

export function buildMarketContext(
  publication: CandidatePublication,
): MarketContext {
  const bySymbol = new Map(
    publication.results.map((result) => [result.symbol.toUpperCase(), result]),
  );

  const broadMarket = orderedRecords(bySymbol, BROAD_MARKET_LABELS);
  const sectors = orderedRecords(bySymbol, SECTOR_LABELS).sort(
    (left, right) => (right.alignmentScore ?? -1) - (left.alignmentScore ?? -1),
  );

  return { publication, broadMarket, sectors };
}

function orderedRecords(
  bySymbol: Map<string, CandidateEvidence>,
  labels: Record<string, string>,
): MarketContextRecord[] {
  const records: MarketContextRecord[] = [];
  for (const [symbol, label] of Object.entries(labels)) {
    const result = bySymbol.get(symbol);
    if (!result) continue;
    records.push({
      symbol,
      label,
      classificationLabel: classificationLabel(result.classification),
      alignmentScore: result.alignmentScore,
      summaryText: strongestExplanation(result),
    });
  }
  return records;
}

function strongestExplanation(result: CandidateEvidence): string {
  const supporting = result.factors.find(
    (factor) => factor.effect === "supporting",
  );
  return (
    supporting?.explanation ??
    result.factors[0]?.explanation ??
    "No principal factor was recorded for this snapshot."
  );
}
