import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("TradeEvidence founder preview", () => {
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
    expect(screen.getAllByText("Evidence Score")).toHaveLength(3);
    expect(
      screen.getAllByRole("link", { name: /open decision workspace/i }),
    ).toHaveLength(3);
    expect(screen.getAllByText(/fictional/i).length).toBeGreaterThan(0);
  });
});
