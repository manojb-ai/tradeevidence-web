import Link from "next/link";

import { getFounderReview } from "@/src/application/get-founder-review";
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

export default function Home() {
  const review = getFounderReview();
  const { publication } = review;
  const run = reviewIdentity(publication);
  const coverage = Math.round(
    (publication.completeCount / publication.rowsEvaluated) * 100,
  );

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

        <section className="py-10" aria-labelledby="opportunities-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Candidate technical evidence
              </p>
              <h2
                id="opportunities-heading"
                className="mt-1 text-2xl font-semibold"
              >
                Strongest directional records to review
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-500">
              Ordered deterministically by the engine&apos;s existing score.
              These are review records—not approved opportunities, predictions,
              or recommendations.
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {review.featured.map((opportunity) => (
              <article
                key={opportunity.symbol}
                className="group flex flex-col rounded-3xl border border-white/10 bg-[#0b1728] p-6 transition hover:-translate-y-0.5 hover:border-cyan-400/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-2xl font-semibold tracking-tight">
                      {opportunity.symbol}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {opportunity.companyName ?? "Company unavailable"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${directionStyles[opportunity.classificationLabel]}`}
                  >
                    {opportunity.classificationLabel}
                  </span>
                </div>

                <div className="mt-7 flex items-end justify-between border-b border-white/10 pb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Evidence Score
                    </p>
                    <p className="mt-2 text-4xl font-semibold">
                      {opportunity.alignmentScore}
                      <span className="text-lg text-slate-600">/100</span>
                    </p>
                  </div>
                  <p className="text-right text-sm leading-6 text-slate-400">
                    {opportunity.coverage}%<br />
                    coverage
                  </p>
                </div>

                <dl className="mt-5 space-y-4 text-sm leading-6">
                  <div>
                    <dt className="font-medium text-slate-200">
                      Principal support
                    </dt>
                    <dd className="mt-1 text-slate-400">
                      {opportunity.principalSupportText}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-200">
                      Key constraint
                    </dt>
                    <dd className="mt-1 text-slate-400">
                      {opportunity.keyConstraintText}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={workspaceHref(opportunity.symbol, run)}
                  className="mt-7 inline-flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition group-hover:bg-cyan-300"
                >
                  Open Decision Workspace <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-7 text-sm leading-6 text-slate-500">
          {review.isCandidate
            ? "Founder-only review of experimental Candidate 2 technical evidence. Market context, sector context, and Decision Confidence are unavailable."
            : "The configured local artifact was not found, so this page uses fictional illustrative records."}{" "}
          TradeEvidence provides educational research tools and does not provide
          financial advice.
        </footer>
      </div>
    </main>
  );
}
