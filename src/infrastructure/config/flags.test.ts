import { afterEach, describe, expect, it, vi } from "vitest";

import { getFeatureFlags } from "./flags";

describe("getFeatureFlags", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults every flag off (AC-09: experimental features disabled by default)", () => {
    vi.stubEnv("TRADEEVIDENCE_FLAG_MARKET_CONTEXT_ENABLED", undefined);
    vi.stubEnv("TRADEEVIDENCE_FLAG_AI_ENABLED", undefined);
    vi.stubEnv("TRADEEVIDENCE_FLAG_EXPORTS_ENABLED", undefined);

    expect(getFeatureFlags()).toEqual({
      marketContextEnabled: false,
      aiEnabled: false,
      exportsEnabled: false,
    });
  });

  it('enables a flag only on an explicit "true"', () => {
    vi.stubEnv("TRADEEVIDENCE_FLAG_MARKET_CONTEXT_ENABLED", "true");

    expect(getFeatureFlags().marketContextEnabled).toBe(true);
  });

  it('treats any value other than "true"/"false" as invalid configuration', () => {
    vi.stubEnv("TRADEEVIDENCE_FLAG_AI_ENABLED", "yes");

    expect(() => getFeatureFlags()).toThrowError(
      /TRADEEVIDENCE_FLAG_AI_ENABLED/,
    );
  });
});
