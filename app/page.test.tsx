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
    expect(screen.getAllByText("Evidence Score")).toHaveLength(2);
    expect(
      screen.getAllByRole("link", { name: /open decision workspace/i }),
    ).toHaveLength(2);
    expect(
      screen.getByText(/configured local artifact was not found/i),
    ).toBeInTheDocument();
  });
});
