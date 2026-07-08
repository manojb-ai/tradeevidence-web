export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%),linear-gradient(135deg,_#030712_0%,_#0f172a_100%)] px-6 py-16 text-white">
      <section className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 text-center shadow-[0_0_80px_rgba(59,130,246,0.18)] backdrop-blur-xl sm:p-14">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-blue-400">
          Evidence-Based Trading Intelligence
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-slate-100 sm:text-7xl">
          TradeEvidence
        </h1>
        <p className="mt-6 text-xl leading-8 text-slate-300 sm:text-2xl">
          Trade with Trend and Momentum evidence, not emotion.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="#"
            className="rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Get Started
          </a>
        </div>
        <p className="mt-8 text-sm leading-6 text-slate-500">
          TradeEvidence provides educational research and journaling tools. It does not provide financial advice.
        </p>
      </section>
    </main>
  );
}
