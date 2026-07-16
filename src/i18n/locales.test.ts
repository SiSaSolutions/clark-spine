import { describe, expect, it } from "vitest";

import { defaultLocale, isLocale, locales, toLocale } from "./locales";

describe("locale validation", () => {
  it("accepts supported locales", () => {
    for (const locale of locales) {
      expect(isLocale(locale)).toBe(true);
    }
  });

  it("rejects unsupported or malicious values", () => {
    for (const value of ["fr", "EN", "", "en/../..", "//evil.com", null, undefined, 42]) {
      expect(isLocale(value)).toBe(false);
    }
  });

  it("falls back to the default locale for untrusted input", () => {
    expect(toLocale("fr")).toBe(defaultLocale);
    expect(toLocale("//evil.com")).toBe(defaultLocale);
    expect(toLocale("es")).toBe("es");
  });
});
