import Link from "next/link";
import { notFound } from "next/navigation";

import {
  demoOpportunities,
  demoSnapshot,
  findDemoOpportunity,
} from "@/src/features/opportunities/demo-data";

export function generateStaticParams() {
  return demoOpportunities.map(({ symbol }) => ({
    symbol: symbol.toLowerCase(),
  }));
}

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const opportunity = findDemoOpportunity(symbol);

  if (!opportunity) notFound();

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Trade<span className="text-cyan-400">Evidence</span>
          </Link>
          <span className="text-sm text-slate-500">
            Illustrative founder preview
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
          ← Today&apos;s Briefing
        </Link>

        <section className="mt-7 grid gap-7 border-b border-white/10 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-5xl font-semibold tracking-[-0.04em]">
                {opportunity.symbol}
              </h1>
              <span className="rounded-full border border-white/15 px-3 py-1 text-sm text-slate-300">
                {opportunity.direction}
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-sm text-slate-400">
                {opportunity.timeframe}
              </span>
            </div>
            <p className="mt-3 text-slate-500">{opportunity.name}</p>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
              {opportunity.principalSupport}
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] px-7 py-5 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
              Evidence Score
            </p>
            <p className="mt-2 text-5xl font-semibold">
              {opportunity.evidenceScore}
              <span className="text-xl text-slate-500">/100</span>
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Alignment, not probability
            </p>
          </div>
        </section>

        <section className="grid gap-6 py-9 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <article className="rounded-3xl border border-white/10 bg-[#0b1728] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Technical evidence
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Why this setup surfaced
              </h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <EvidenceBlock
                  label="Trend"
                  value={opportunity.trendEvidence}
                />
                <EvidenceBlock
                  label="Momentum"
                  value={opportunity.momentumEvidence}
                />
                <EvidenceBlock
                  label="Timeframe tension"
                  value={opportunity.contradiction}
                />
                <EvidenceBlock
                  label="Reassessment condition"
                  value={opportunity.invalidation}
                />
              </div>
            </article>

            <article className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.05] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                Devil&apos;s advocate
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                What could challenge this interpretation?
              </h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                {opportunity.keyConstraint} {opportunity.contradiction}
              </p>
            </article>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#0b1728] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Decision Confidence
              </p>
              <h2 className="mt-3 text-xl font-semibold">Not assessed</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                This belongs to you. Evidence strength cannot determine whether
                a setup fits your plan, timing, or risk limits.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-300">
                <li className="rounded-xl border border-white/10 p-3">
                  □ Fits my strategy
                </li>
                <li className="rounded-xl border border-white/10 p-3">
                  □ Risk is defined
                </li>
                <li className="rounded-xl border border-white/10 p-3">
                  □ Contradictions reviewed
                </li>
              </ul>
            </section>

            <section className="rounded-3xl border border-white/10 p-6 text-sm leading-6 text-slate-400">
              <p className="font-medium text-slate-200">Snapshot integrity</p>
              <dl className="mt-4 space-y-2">
                <div className="flex justify-between gap-4">
                  <dt>Run</dt>
                  <dd>{demoSnapshot.analysisRunId}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Ruleset</dt>
                  <dd>{demoSnapshot.rulesetVersion}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Coverage</dt>
                  <dd>{demoSnapshot.coverage}%</dd>
                </div>
              </dl>
            </section>
          </aside>
        </section>

        <footer className="border-t border-white/10 py-7 text-sm leading-6 text-slate-500">
          Educational research only—not financial advice. This page uses
          fictional illustrative data.
        </footer>
      </div>
    </main>
  );
}

function EvidenceBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-5">
      <h3 className="font-medium text-slate-100">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{value}</p>
    </div>
  );
}
