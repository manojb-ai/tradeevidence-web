export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-16 text-white">
      <section className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-900/80 p-10 text-center shadow-2xl shadow-black/20 backdrop-blur">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
          Evidence-Based Trading Intelligence
        </p>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          TradeEvidence
        </h1>
        <p className="mt-6 text-xl text-zinc-300 sm:text-2xl">
          Trade with evidence, not emotion.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="#"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Get Started
          </a>
        </div>
        <p className="mt-8 text-sm text-zinc-500">
          TradeEvidence provides research and journaling tools. It does not provide financial advice.
        </p>
      </section>
    </main>
  );
}
