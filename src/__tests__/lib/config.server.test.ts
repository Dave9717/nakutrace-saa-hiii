import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("getServerConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns nodeEnv from process.env.NODE_ENV", async () => {
    process.env.NODE_ENV = "production";
    const { getServerConfig } = await import("@/lib/config.server");
    const config = getServerConfig();
    expect(config.nodeEnv).toBe("production");
  });

  it("returns undefined nodeEnv when NODE_ENV is not set", async () => {
    delete process.env.NODE_ENV;
    const { getServerConfig } = await import("@/lib/config.server");
    const config = getServerConfig();
    expect(config.nodeEnv).toBeUndefined();
  });

  it("reads env per-call (not cached at module level)", async () => {
    process.env.NODE_ENV = "development";
    const { getServerConfig } = await import("@/lib/config.server");
    expect(getServerConfig().nodeEnv).toBe("development");

    process.env.NODE_ENV = "test";
    expect(getServerConfig().nodeEnv).toBe("test");
  });
});
