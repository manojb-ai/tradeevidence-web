import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { logError, logInfo, logWarn } from "./logger";

describe("logger", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-26T12:00:00.000Z"));
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("writes info entries to console.log as one JSON object", () => {
    logInfo("health.check", { correlationId: "abc-123", ready: true });

    expect(console.log).toHaveBeenCalledTimes(1);
    const [line] = vi.mocked(console.log).mock.calls[0] as [string];
    expect(JSON.parse(line)).toEqual({
      timestamp: "2026-09-26T12:00:00.000Z",
      level: "info",
      message: "health.check",
      correlationId: "abc-123",
      ready: true,
    });
  });

  it("writes warn entries to console.warn", () => {
    logWarn("health.degraded", { correlationId: "abc-123" });

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.log).not.toHaveBeenCalled();
    const [line] = vi.mocked(console.warn).mock.calls[0] as [string];
    expect(JSON.parse(line)).toMatchObject({
      level: "warn",
      message: "health.degraded",
    });
  });

  it("writes error entries to console.error", () => {
    logError("health.check.failed", {
      correlationId: "abc-123",
      reason: "invalid environment",
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    const [line] = vi.mocked(console.error).mock.calls[0] as [string];
    expect(JSON.parse(line)).toMatchObject({
      level: "error",
      message: "health.check.failed",
      reason: "invalid environment",
    });
  });

  it("defaults to no extra fields", () => {
    logInfo("noop");

    const [line] = vi.mocked(console.log).mock.calls[0] as [string];
    expect(JSON.parse(line)).toEqual({
      timestamp: "2026-09-26T12:00:00.000Z",
      level: "info",
      message: "noop",
    });
  });
});
