import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { consumeLastCapturedError } from "@/lib/error-capture";

describe("consumeLastCapturedError", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns undefined when no error has been captured", () => {
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("captures and consumes an error dispatched via globalThis error event", () => {
    const testError = new Error("test error");
    globalThis.dispatchEvent(new ErrorEvent("error", { error: testError }));

    const result = consumeLastCapturedError();
    expect(result).toBe(testError);
  });

  it("returns undefined after consuming (single-use)", () => {
    globalThis.dispatchEvent(new ErrorEvent("error", { error: new Error("once") }));
    consumeLastCapturedError();
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("captures unhandledrejection events", () => {
    const reason = new Error("rejected");
    const event = Object.assign(new Event("unhandledrejection"), { reason });
    globalThis.dispatchEvent(event as unknown as Event);

    const result = consumeLastCapturedError();
    expect(result).toBe(reason);
  });

  it("expires after TTL (5 seconds)", () => {
    globalThis.dispatchEvent(new ErrorEvent("error", { error: new Error("old") }));
    vi.advanceTimersByTime(5001);
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("does not expire before TTL", () => {
    const err = new Error("fresh");
    globalThis.dispatchEvent(new ErrorEvent("error", { error: err }));
    vi.advanceTimersByTime(4999);
    expect(consumeLastCapturedError()).toBe(err);
  });
});
