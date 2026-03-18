import { describe, it, expect } from "vitest";
import calculateAccuracy from "../compare";

describe("calculateAccuracy", () => {
  it("returns 100% for identical strings", () => {
    expect(calculateAccuracy("hello", "hello")).toBe("100.00");
  });

  it("returns 0% for completely different strings", () => {
    expect(calculateAccuracy("abc", "def")).toBe("0.00");
  });

  it("returns correct percentage for partial matches", () => {
    expect(calculateAccuracy("hello", "hella")).toBe("80.00");
    expect(calculateAccuracy("typing", "taping")).toBe("83.33");
  });

  it("handles strings of different lengths (based on first string)", () => {
    // Current implementation uses text1.length
    expect(calculateAccuracy("hello", "he")).toBe("40.00");
  });
});
