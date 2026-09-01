import Link from "next/link";

import {
  demoOpportunities,
  demoSnapshot,
} from "@/src/features/opportunities/demo-data";

const directionStyles = {
  Bullish: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Bearish: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  Watch: "border-amber-400/30 bg-amber-400/10 text-amber-200",
} as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <header className="border-b border-white/10 bg-[#07111f]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Trade<span className="text-cyan-400">Evidence</span>
          </Link>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="hidden sm:inline">Founder preview</span>
            <span
              className="h-2 w-2 rounded-full bg-amber-300"
              aria-hidden="true"
            />
            Illustrative data
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1.5fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
              Today&apos;s briefing · {demoSnapshot.marketDate}
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
                Complete fixture
              </span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Ruleset</dt>
                <dd className="mt-1 font-medium">
                  {demoSnapshot.rulesetVersion}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Coverage</dt>
                <dd className="mt-1 font-medium">{demoSnapshot.coverage}%</dd>
              </div>
              <div>
                <dt className="text-slate-500">Universe</dt>
                <dd className="mt-1 font-medium">Demo watchlist</dd>
              </div>
              <div>
                <dt className="text-slate-500">Freshness</dt>
                <dd className="mt-1 font-medium">Illustrative</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="py-10" aria-labelledby="opportunities-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Evidence-aligned opportunities
              </p>
              <h2
                id="opportunities-heading"
                className="mt-1 text-2xl font-semibold"
              >
                Three setups worth a closer look
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-500">
              Ranked deterministically from one analysis run. A high score is
              stronger evidence alignment—not a prediction or recommendation.
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {demoOpportunities.map((opportunity) => (
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
                      {opportunity.name}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${directionStyles[opportunity.direction]}`}
                  >
                    {opportunity.direction}
                  </span>
                </div>

                <div className="mt-7 flex items-end justify-between border-b border-white/10 pb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Evidence Score
                    </p>
                    <p className="mt-2 text-4xl font-semibold">
                      {opportunity.evidenceScore}
                      <span className="text-lg text-slate-600">/100</span>
                    </p>
                  </div>
                  <p className="text-right text-sm leading-6 text-slate-400">
                    {opportunity.timeframe}
                    <br />
                    timeframe
                  </p>
                </div>

                <dl className="mt-5 space-y-4 text-sm leading-6">
                  <div>
                    <dt className="font-medium text-slate-200">
                      Principal support
                    </dt>
                    <dd className="mt-1 text-slate-400">
                      {opportunity.principalSupport}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-200">
                      Key constraint
                    </dt>
                    <dd className="mt-1 text-slate-400">
                      {opportunity.keyConstraint}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/workspace/${opportunity.symbol.toLowerCase()}`}
                  className="mt-7 inline-flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition group-hover:bg-cyan-300"
                >
                  Open Decision Workspace <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-7 text-sm leading-6 text-slate-500">
          This founder preview uses fictional, illustrative records.
          TradeEvidence provides educational research tools and does not provide
          financial advice.
        </footer>
      </div>
    </main>
  );
}
