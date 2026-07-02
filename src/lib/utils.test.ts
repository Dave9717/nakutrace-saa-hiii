import { describe, expect, it } from "vitest";
import { getDistanceKm, getPasswordStrength, getAssistantFallbackReply } from "./utils";

describe("getPasswordStrength", () => {
  it("recognizes strong passwords", () => {
    const result = getPasswordStrength("Nakutrace2026!");
    expect(result.score).toBeGreaterThanOrEqual(3);
    expect(result.label).toBe("Strong");
  });

  it("flags weak passwords", () => {
    const result = getPasswordStrength("12345");
    expect(result.score).toBeLessThan(2);
    expect(result.label).toBe("Weak");
  });
});

describe("getDistanceKm", () => {
  it("calculates a simple distance between coordinates", () => {
    const distance = getDistanceKm({ lat: 0, lng: 0 }, { lat: 0, lng: 1 });
    expect(distance).toBeCloseTo(111.19, 0);
  });
});

describe("getAssistantFallbackReply", () => {
  it("returns a helpful fallback for emergency questions", () => {
    const reply = getAssistantFallbackReply("snakebite");
    expect(reply).toContain("snakebite");
  });
});
