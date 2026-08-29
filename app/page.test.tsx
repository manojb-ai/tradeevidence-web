import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("TradeEvidence landing page", () => {
  it("identifies the product and preserves its educational boundary", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "TradeEvidence" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not provide financial advice/i),
    ).toBeInTheDocument();
  });
});
