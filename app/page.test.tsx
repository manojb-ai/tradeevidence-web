import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "./page";

describe("TradeEvidence founder preview", () => {
  beforeEach(() => {
    vi.stubEnv(
      "TRADEEVIDENCE_ANALYTICS_ARTIFACT",
      "missing-test-artifact.json",
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders the briefing and preserves its educational boundary", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /start with the evidence/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not provide financial advice/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "YES" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "WATCH" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "NO" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /open decision workspace/i }),
    ).toHaveLength(3);
    expect(
      screen.getByText(/configured local artifact was not found/i),
    ).toBeInTheDocument();
  });

  it("does not render market/sector context when no context artifact is configured", () => {
    render(<Home />);

    expect(
      screen.queryByRole("heading", { name: /market & sector snapshot/i }),
    ).not.toBeInTheDocument();
  });
});
