import Link from "next/link";

import {
  getBreadth,
  getFounderReview,
  getOpportunityColumns,
  type FounderReviewRecord,
} from "@/src/application/get-founder-review";
import { getMarketContext } from "@/src/application/get-market-context";
import {
  reviewIdentity,
  workspaceHref,
} from "@/src/application/review-navigation";

const directionStyles = {
  Bullish: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Bearish: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  "Bullish watch": "border-amber-400/30 bg-amber-400/10 text-amber-200",
  "Bearish watch": "border-amber-400/30 bg-amber-400/10 text-amber-200",
  Neutral: "border-slate-400/30 bg-slate-400/10 text-slate-300",
  Incomplete: "border-slate-400/30 bg-slate-400/10 text-slate-300",
} satisfies Record<string, string>;

const columnTone = {
  YES: "border-emerald-400/30 bg-emerald-400/5",
  WATCH: "border-amber-400/30 bg-amber-400/5",
  NO: "border-rose-400/30 bg-rose-400/5",
} satisfies Record<string, string>;

export default function Home() {
  const review = getFounderReview();
  const { publication } = review;
  const run = reviewIdentity(publication);
  const coverage = Math.round(
    (publication.completeCount / publication.rowsEvaluated) * 100,
  );
  const breadth = getBreadth(review.all);
  const columns = getOpportunityColumns(review.all);
  const marketContext = getMarketContext();

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <header className="border-b border-white/10 bg-[#07111f]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Trade<span className="text-cyan-400">Evidence</span>
          </Link>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="hidden sm:inline">Founder review</span>
            <span
              className="h-2 w-2 rounded-full bg-amber-300"
              aria-hidden="true"
            />
            {review.isCandidate ? "Candidate 2 data" : "Illustrative fallback"}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <form
          action="/lookup"
          method="get"
          className="mb-8 rounded-2xl border border-white/10 p-5"
        >
          <label htmlFor="symbol" className="block font-semibold">
            Research a symbol
          </label>
          <p id="symbol-help" className="my-2 text-sm text-slate-400">
            Search all symbols in this candidate run. Evidence is experimental
            and not published.
          </p>
          <input type="hidden" name="run" value={run} />
          <div className="flex flex-wrap gap-3">
            <input
              id="symbol"
              name="symbol"
              aria-describedby="symbol-help"
              placeholder="e.g. AAPL"
              className="min-w-0 rounded-lg border border-white/20 bg-slate-900 px-4 py-3"
            />
            <button
              type="submit"
              className="rounded-lg bg-cyan-300 px-4 py-3 font-semibold text-slate-950"
            >
              Review symbol
            </button>
          </div>
        </form>
        <section className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1.5fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
              Technical evidence review · {publication.marketDate}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Start with the evidence. Make the decision yours.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Review a small set of evidence-aligned opportunities, understand
              what supports or challenges each setup, and decide what deserves
              your attention.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Analysis snapshot</span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                {review.isCandidate
                  ? "Candidate—not published"
                  : "Fallback fixture"}
              </span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Ruleset</dt>
                <dd className="mt-1 font-medium">
                  {publication.rulesetVersion}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Coverage</dt>
                <dd className="mt-1 font-medium">{coverage}% complete</dd>
              </div>
              <div>
                <dt className="text-slate-500">Universe</dt>
                <dd className="mt-1 font-medium">
                  {publication.rowsEvaluated} symbols
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Freshness</dt>
                <dd className="mt-1 font-medium">
                  As of {publication.marketDate}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {marketContext && (
          <section
            className="border-b border-white/10 py-10"
            aria-labelledby="market-context-heading"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Same evidence methodology, broader universe
                </p>
                <h2
                  id="market-context-heading"
                  className="mt-1 text-2xl font-semibold"
                >
                  Market &amp; sector snapshot
                </h2>
              </div>
              <p className="max-w-lg text-sm leading-6 text-slate-500">
                The engine evaluated the same technical factors against the
                broad market and the sector ETFs from today&apos;s context
                export. Experimental and not published.
              </p>
            </div>

            {marketContext.broadMarket.length > 0 && (
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {marketContext.broadMarket.map((item) => (
                  <div
                    key={item.symbol}
                    className="rounded-2xl border border-white/10 bg-[#0b1728] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{item.label}</p>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${directionStyles[item.classificationLabel]}`}
                      >
                        {item.classificationLabel}
                      </span>
                    </div>
                    {item.alignmentScore !== null && (
                      <p className="mt-3 text-3xl font-semibold">
                        {item.alignmentScore}
                        <span className="text-base text-slate-600">/100</span>
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {item.summaryText}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {marketContext.sectors.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-slate-300">
                  Sector heat map
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {marketContext.sectors.map((sector) => (
                    <div
                      key={sector.symbol}
                      className={`rounded-xl border px-4 py-3 ${directionStyles[sector.classificationLabel]}`}
                    >
                      <p className="text-sm font-semibold text-slate-100">
                        {sector.label}
                      </p>
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="text-xs">
                          {sector.classificationLabel}
                        </span>
                        {sector.alignmentScore !== null && (
                          <span className="text-sm font-semibold">
                            {sector.alignmentScore}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="py-10" aria-labelledby="opportunities-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Candidate technical evidence · {breadth.total} symbols evaluated
              </p>
              <h2
                id="opportunities-heading"
                className="mt-1 text-2xl font-semibold"
              >
                Highest conviction opportunities
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-500">
              Grouped by the engine&apos;s existing classification. These are
              review records—not approved opportunities, predictions, or
              recommendations.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
            <span>{breadth.bullish} bullish</span>
            <span>{breadth.bullishWatch} bullish watch</span>
            <span>{breadth.neutral} neutral</span>
            <span>{breadth.bearishWatch} bearish watch</span>
            <span>{breadth.bearish} bearish</span>
            <span>{breadth.incomplete} incomplete</span>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            <OpportunityColumn
              title="YES"
              tone={columnTone.YES}
              count={breadth.bullish}
              records={columns.yes}
              run={run}
            />
            <OpportunityColumn
              title="WATCH"
              tone={columnTone.WATCH}
              count={breadth.bullishWatch + breadth.bearishWatch}
              records={columns.watch}
              run={run}
            />
            <OpportunityColumn
              title="NO"
              tone={columnTone.NO}
              count={breadth.bearish}
              records={columns.no}
              run={run}
            />
          </div>
        </section>

        <footer className="border-t border-white/10 py-7 text-sm leading-6 text-slate-500">
          {review.isCandidate
            ? marketContext
              ? "Founder-only review of experimental Candidate 2 technical evidence. The market and sector snapshot uses the same experimental methodology. Decision Confidence remains unavailable."
              : "Founder-only review of experimental Candidate 2 technical evidence. Market context, sector context, and Decision Confidence are unavailable."
            : "The configured local artifact was not found, so this page uses fictional illustrative records."}{" "}
          TradeEvidence provides educational research tools and does not provide
          financial advice.
        </footer>
      </div>
    </main>
  );
}

function OpportunityColumn({
  title,
  tone,
  count,
  records,
  run,
}: {
  title: string;
  tone: string;
  count: number;
  records: FounderReviewRecord[];
  run: string;
}) {
  return (
    <div className={`rounded-3xl border p-5 ${tone}`}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-slate-400">{count}</span>
      </div>
      {records.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No symbols currently fall in this group.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {records.map((record) => (
            <li key={record.symbol}>
              <Link
                href={workspaceHref(record.symbol, run)}
                aria-label={`Open Decision Workspace for ${record.symbol}`}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-[#0b1728] p-4 transition hover:border-cyan-400/30"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{record.symbol}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                    {record.principalSupportText}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-slate-200">
                  {record.alignmentScore}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
