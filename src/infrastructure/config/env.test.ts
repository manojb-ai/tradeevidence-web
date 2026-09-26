import { afterEach, describe, expect, it, vi } from "vitest";

import { getServerEnv } from "./env";

describe("getServerEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns undefined fields when nothing is configured", () => {
    vi.stubEnv("TRADEEVIDENCE_ANALYTICS_ARTIFACT", undefined);
    vi.stubEnv("TRADEEVIDENCE_SYMBOL_EVIDENCE_FILE", undefined);
    vi.stubEnv("TRADEEVIDENCE_INSTRUMENT_REFERENCE_FILE", undefined);
    vi.stubEnv("TRADEEVIDENCE_CONTEXT_ARTIFACT", undefined);
    vi.stubEnv("DATABASE_URL", undefined);

    expect(getServerEnv()).toEqual({
      TRADEEVIDENCE_ANALYTICS_ARTIFACT: undefined,
      TRADEEVIDENCE_SYMBOL_EVIDENCE_FILE: undefined,
      TRADEEVIDENCE_INSTRUMENT_REFERENCE_FILE: undefined,
      TRADEEVIDENCE_CONTEXT_ARTIFACT: undefined,
      DATABASE_URL: undefined,
    });
  });

  it("passes through a configured value", () => {
    vi.stubEnv("TRADEEVIDENCE_ANALYTICS_ARTIFACT", "path/to/artifact.json");

    expect(getServerEnv().TRADEEVIDENCE_ANALYTICS_ARTIFACT).toBe(
      "path/to/artifact.json",
    );
  });

  it("fails fast with a clear message when a variable is set but empty", () => {
    vi.stubEnv("TRADEEVIDENCE_ANALYTICS_ARTIFACT", "");

    expect(() => getServerEnv()).toThrowError(
      /TRADEEVIDENCE_ANALYTICS_ARTIFACT/,
    );
  });

  it("re-reads process.env on every call rather than caching a stale parse", () => {
    vi.stubEnv("TRADEEVIDENCE_ANALYTICS_ARTIFACT", "first.json");
    expect(getServerEnv().TRADEEVIDENCE_ANALYTICS_ARTIFACT).toBe("first.json");

    vi.stubEnv("TRADEEVIDENCE_ANALYTICS_ARTIFACT", "second.json");
    expect(getServerEnv().TRADEEVIDENCE_ANALYTICS_ARTIFACT).toBe("second.json");
  });
});
