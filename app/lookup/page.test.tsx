import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LookupPage from "./page";
import { getFounderReview } from "@/src/application/get-founder-review";
import { reviewIdentity } from "@/src/application/review-navigation";

vi.mock("@/src/application/get-founder-review", () => ({
  getFounderReview: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: (href: string) => {
    throw new Error(`redirect:${href}`);
  },
}));

const review = {
  isCandidate: true,
  publication: {
    source: "candidate-artifact",
    sourceChecksum: "abc",
    generatedAt: "2026-09-02",
    marketDate: "2026-09-01",
    engineVersion: "candidate-2",
    rulesetVersion: "v2",
  },
  all: [{ symbol: "BRK.B", status: "incomplete" }],
  featured: [],
} as unknown as ReturnType<typeof getFounderReview>;

describe("symbol lookup", () => {
  afterEach(cleanup);
  it("resolves normalized symbols outside featured records, including incomplete evidence", async () => {
    vi.mocked(getFounderReview).mockReturnValue(review);
    await expect(
      LookupPage({
        searchParams: Promise.resolve({
          symbol: " brk.b ",
          run: reviewIdentity(review.publication),
        }),
      }),
    ).rejects.toThrow("redirect:/workspace/brk.b?run=");
  });
  it.each(["", "../AAPL", "javascript:alert(1)"])(
    "rejects invalid input %s",
    async (symbol) => {
      render(await LookupPage({ searchParams: Promise.resolve({ symbol }) }));
      expect(screen.getByRole("status")).toHaveTextContent(
        "Enter a valid stock symbol",
      );
    },
  );
  it("distinguishes absent symbols", async () => {
    vi.mocked(getFounderReview).mockReturnValue(review);
    render(
      await LookupPage({
        searchParams: Promise.resolve({
          symbol: "ZZZZ",
          run: reviewIdentity(review.publication),
        }),
      }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("ZZZZ is not present");
  });
  it("rejects a changed run", async () => {
    vi.mocked(getFounderReview).mockReturnValue(review);
    render(
      await LookupPage({
        searchParams: Promise.resolve({ symbol: "BRK.B", run: "old" }),
      }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("run has changed");
  });
  it("does not substitute fictional records for unavailable evidence", async () => {
    vi.mocked(getFounderReview).mockReturnValue({
      ...review,
      isCandidate: false,
    });
    render(
      await LookupPage({ searchParams: Promise.resolve({ symbol: "BRK.B" }) }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Candidate evidence is unavailable",
    );
  });
  it("handles rejected artifacts without exposing internal errors", async () => {
    vi.mocked(getFounderReview).mockImplementation(() => {
      throw new Error("private path");
    });
    render(
      await LookupPage({ searchParams: Promise.resolve({ symbol: "BRK.B" }) }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Candidate evidence is unavailable",
    );
    expect(screen.queryByText(/private path/)).not.toBeInTheDocument();
  });
});
