import type { CandidatePublication } from "@/src/domain/analytical-publication";

export function reviewIdentity(publication: CandidatePublication): string {
  return JSON.stringify([
    publication.source,
    publication.sourceChecksum,
    publication.generatedAt,
    publication.marketDate,
    publication.engineVersion,
    publication.rulesetVersion,
  ]);
}

export function workspaceHref(symbol: string, run: string): string {
  return `/workspace/${encodeURIComponent(symbol.toLowerCase())}?${new URLSearchParams({ run })}`;
}

export function normalizeLookupSymbol(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const symbol = value.trim().toUpperCase();
  return /^[A-Z][A-Z0-9]*(?:[./-][A-Z0-9]+)?$/.test(symbol) &&
    symbol.length <= 20
    ? symbol
    : null;
}
