import Link from "next/link";
import { redirect } from "next/navigation";

import { getFounderReview } from "@/src/application/get-founder-review";
import {
  normalizeLookupSymbol,
  reviewIdentity,
  workspaceHref,
} from "@/src/application/review-navigation";

export default async function LookupPage({
  searchParams,
}: {
  searchParams: Promise<{
    symbol?: string | string[];
    run?: string | string[];
  }>;
}) {
  const query = await searchParams;
  const symbol = normalizeLookupSymbol(query.symbol);
  let message = "Enter a valid stock symbol, such as AAPL or BRK.B.";
  if (symbol) {
    let review;
    try {
      review = getFounderReview();
    } catch {
      // Do not expose local file paths or validation internals to the browser.
    }
    if (!review || !review.isCandidate) {
      message =
        "Candidate evidence is unavailable. Illustrative records cannot resolve a market-symbol lookup.";
    } else if (query.run !== reviewIdentity(review.publication)) {
      message =
        "The analytical run has changed. Return to the Homepage and search again using the current run.";
    } else {
      const record = review.all.find(
        (item) => item.symbol.toUpperCase() === symbol,
      );
      if (record) redirect(workspaceHref(record.symbol, query.run));
      message = `${symbol} is not present in this analytical run. No new market data was requested.`;
    }
  }
  return (
    <main className="min-h-screen bg-[#07111f] p-8 text-slate-100">
      <h1 className="text-2xl font-semibold">Symbol lookup</h1>
      <p role="status" className="my-6">
        {message}
      </p>
      <Link href="/" className="text-cyan-300">
        Return to Homepage
      </Link>
    </main>
  );
}
