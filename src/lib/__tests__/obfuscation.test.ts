import { describe, it, expect } from "vitest";
import { deobfuscateText, obfuscateTextForTesting } from "../obfuscation";

describe("obfuscation and deobfuscateText", () => {
  it("should deobfuscate simple ASCII text", () => {
    const original = "Hello World";
    const obfuscated = obfuscateTextForTesting(original);
    expect(deobfuscateText(obfuscated)).toBe(original);
  });

  it("should handle French accents (UTF-8)", () => {
    const original = "L'entraînement est génial !";
    const obfuscated = obfuscateTextForTesting(original);
    expect(deobfuscateText(obfuscated)).toBe(original);
  });

  it("should handle emojis", () => {
    const original = "🚀 Typing App ⌨️";
    const obfuscated = obfuscateTextForTesting(original);
    expect(deobfuscateText(obfuscated)).toBe(original);
  });

  it("should return error message for invalid Base64", () => {
    const invalid = "not-base64-!!!";
    expect(deobfuscateText(invalid)).toContain("Error");
  });
});
