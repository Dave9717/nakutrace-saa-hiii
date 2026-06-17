import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { reportLovableError } from "@/lib/lovable-error-reporting";

describe("reportLovableError", () => {
  let captureExceptionMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    captureExceptionMock = vi.fn();
    (window as unknown as Record<string, unknown>).__lovableEvents = {
      captureException: captureExceptionMock,
    };
  });

  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).__lovableEvents;
  });

  it("calls captureException with the error and context", () => {
    const err = new Error("test");
    reportLovableError(err, { extra: "data" });

    expect(captureExceptionMock).toHaveBeenCalledOnce();
    expect(captureExceptionMock).toHaveBeenCalledWith(
      err,
      expect.objectContaining({
        source: "react_error_boundary",
        route: expect.any(String),
        extra: "data",
      }),
      expect.objectContaining({
        mechanism: "react_error_boundary",
        handled: false,
        severity: "error",
      }),
    );
  });

  it("includes the current pathname in context", () => {
    reportLovableError(new Error("test"));

    const contextArg = captureExceptionMock.mock.calls[0][1];
    expect(contextArg.route).toBe(window.location.pathname);
  });

  it("does nothing when __lovableEvents is not defined", () => {
    delete (window as unknown as Record<string, unknown>).__lovableEvents;
    expect(() => reportLovableError(new Error("safe"))).not.toThrow();
  });

  it("does nothing when captureException is not defined", () => {
    (window as unknown as Record<string, unknown>).__lovableEvents = {};
    expect(() => reportLovableError(new Error("safe"))).not.toThrow();
  });

  it("uses empty context by default", () => {
    reportLovableError(new Error("minimal"));

    const contextArg = captureExceptionMock.mock.calls[0][1];
    expect(contextArg.source).toBe("react_error_boundary");
    expect(contextArg.route).toBeDefined();
  });
});
