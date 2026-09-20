import Link from "next/link";
import { notFound } from "next/navigation";
import { reviewIdentity } from "@/src/application/review-navigation";

import {
  FOUNDER_REVIEW_PRESENTATION_VERSION,
  getFounderReview,
} from "@/src/application/get-founder-review";

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams?: Promise<{ run?: string | string[] }>;
}) {
  const { symbol } = await params;
  const review = getFounderReview();
  const query = await searchParams;
  if (
    query?.run !== undefined &&
    query.run !== reviewIdentity(review.publication)
  ) {
    return (
      <main className="min-h-screen bg-[#07111f] p-8 text-slate-100">
        <h1 className="text-2xl">Analytical run unavailable</h1>
        <p className="my-6">
          The analytical run has changed. Return to the Homepage to review the
          current evidence.
        </p>
        <Link href="/" className="text-cyan-300">
          Return to Homepage
        </Link>
      </main>
    );
  }
  const opportunity = review.all.find(
    (record) => record.symbol.toLowerCase() === symbol.toLowerCase(),
  );

  if (!opportunity) notFound();

  return (
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Trade<span className="text-cyan-400">Evidence</span>
          </Link>
          <span className="text-sm text-slate-500">
            {review.isCandidate
              ? "Candidate 2 founder review"
              : "Illustrative fallback"}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        {opportunity.status === "incomplete" && (
          <p
            role="status"
            className="mb-6 rounded-xl border border-amber-300/30 p-4 text-amber-200"
          >
            Evidence for {opportunity.symbol} is incomplete. Review the
            available factors and missing inputs below; a complete directional
            assessment is unavailable.
          </p>
        )}
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
          ← Today&apos;s Briefing
        </Link>

        <section className="mt-7 rounded-3xl border border-white/10 bg-[#0b1728] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Market context
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Broad market", "SPY, QQQ, and IWM context unavailable"],
              ["Risk environment", "Not evaluated in this candidate run"],
              ["Sector context", "Sector mapping is not yet integrated"],
              ["Important events", "Not evaluated in this candidate run"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 p-4"
              >
                <p className="text-sm font-medium text-slate-200">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 grid gap-7 border-b border-white/10 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Security summary
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-5xl font-semibold tracking-[-0.04em]">
                {opportunity.symbol}
              </h1>
              <span className="rounded-full border border-white/15 px-3 py-1 text-sm text-slate-300">
                {opportunity.classificationLabel}
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-sm text-slate-400">
                Candidate evidence
              </span>
            </div>
            <p className="mt-3 text-slate-500">
              {opportunity.companyName ?? "Company unavailable"}
              {opportunity.exchange ? ` · ${opportunity.exchange}` : ""}
            </p>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
              {opportunity.principalSupportText}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-5 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Current price
              </p>
              <p className="mt-2 text-4xl font-semibold">
                {opportunity.canonicalPrice === null
                  ? "—"
                  : `$${opportunity.canonicalPrice.toFixed(2)}`}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {opportunity.currency ?? "Currency unavailable"} · close{" "}
                {review.publication.marketDate}
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] px-7 py-5 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                Evidence Score
              </p>
              <p className="mt-2 text-4xl font-semibold">
                {opportunity.alignmentScore ?? "—"}
                <span className="text-lg text-slate-500">/100</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Alignment, not probability
              </p>
            </div>
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
              <div className="mt-7 space-y-5">
                <EvidenceBlock
                  label="Trend Structure"
                  value={opportunity.trendEvidence}
                />
                <div className="rounded-2xl border border-white/10 p-5">
                  <h3 className="font-medium text-slate-100">Momentum</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <EvidenceDetail
                      label="Daily Momentum"
                      value={opportunity.dailyMomentumEvidence}
                    />
                    <EvidenceDetail
                      label="Weekly Momentum"
                      value={opportunity.weeklyMomentumEvidence}
                    />
                  </div>
                  <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-slate-400">
                    {opportunity.momentumRelationship}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.05] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                Devil&apos;s advocate
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                What could challenge this interpretation?
              </h2>
              <ExplanationSection
                takeaway={opportunity.devilsAdvocateTakeaway}
                whyItMatters={opportunity.devilsAdvocateWhyItMatters}
                technical={opportunity.contradictionTechnical}
              />
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-5">
                <h3 className="font-medium text-slate-200">
                  How daily and weekly momentum work together
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {opportunity.momentumRelationship}
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-rose-300/20 bg-rose-300/[0.04] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                Thesis invalidation
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                When should this evidence be reassessed?
              </h2>
              <ExplanationSection
                takeaway={opportunity.invalidationTakeaway}
                whyItMatters={opportunity.invalidationWhyItMatters}
                technical={opportunity.invalidation}
              />
            </article>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#0b1728] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Decision Confidence
              </p>
              <h2 className="mt-3 text-xl font-semibold">Unavailable</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                This candidate artifact does not contain market context, sector
                context, or the separate Decision Confidence calculation.
              </p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Before You Decide
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
                  <dt>Artifact</dt>
                  <dd className="font-mono text-xs">
                    {review.publication.sourceChecksum.slice(0, 10)}…
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Ruleset</dt>
                  <dd className="text-right text-xs">
                    {review.publication.rulesetVersion}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Coverage</dt>
                  <dd>{opportunity.coverage}%</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Explanation</dt>
                  <dd className="text-right text-xs">
                    {FOUNDER_REVIEW_PRESENTATION_VERSION}
                  </dd>
                </div>
              </dl>
            </section>
          </aside>
        </section>

        <section className="grid gap-6 border-t border-white/10 py-9 lg:grid-cols-3">
          <WorkspacePlaceholder
            eyebrow="Position sizing"
            title="Risk fit remains yours"
            value="Portfolio exposure, volatility-based sizing, and maximum acceptable loss are not available in this candidate run. No position size is suggested."
          />
          <WorkspacePlaceholder
            eyebrow="Education"
            title="Understand before acting"
            value="Strategy comparisons and concept explanations will appear here once their approved deterministic inputs are available."
          />
          <WorkspacePlaceholder
            eyebrow="Ask TradeEvidence"
            title="Grounded explanations coming later"
            value="The AI assistant is not connected in this slice. Technical evidence remains available without it."
          />
        </section>

        <footer className="border-t border-white/10 py-7 text-sm leading-6 text-slate-500">
          Educational research only—not financial advice.{" "}
          {review.isCandidate
            ? "This is experimental Candidate 2 technical evidence, not an approved publication."
            : "This page uses fictional illustrative data."}
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

function EvidenceDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{value}</p>
    </div>
  );
}

function ExplanationSection({
  takeaway,
  whyItMatters,
  technical,
}: {
  takeaway: string;
  whyItMatters: string;
  technical: string;
}) {
  return (
    <div className="mt-5 space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Plain-English takeaway
        </p>
        <p className="mt-2 max-w-3xl leading-7 text-slate-200">{takeaway}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Why this matters
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          {whyItMatters}
        </p>
      </div>
      <details className="rounded-xl border border-white/10 px-4 py-3 text-sm">
        <summary className="cursor-pointer font-medium text-slate-300">
          Show technical rule
        </summary>
        <p className="mt-3 leading-6 text-slate-500">{technical}</p>
      </details>
    </div>
  );
}

function WorkspacePlaceholder({
  eyebrow,
  title,
  value,
}: {
  eyebrow: string;
  title: string;
  value: string;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#0b1728] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">{value}</p>
    </article>
  );
}
