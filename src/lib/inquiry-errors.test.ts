import { describe, expect, it } from "vitest";

import { resolveFieldMessage } from "./inquiry-errors";
import type { InquiryErrorMessages } from "./inquiry-errors";

const m: InquiryErrorMessages = {
  required: "required",
  invalidName: "invalidName",
  invalidEmail: "invalidEmail",
  invalidPhone: "invalidPhone",
  tooLong: "tooLong",
  messageTooShort: "messageTooShort",
  captcha: "captcha",
  rateLimit: "rateLimit",
  server: "server",
  network: "network",
};

describe("resolveFieldMessage", () => {
  it("maps name fields", () => {
    expect(resolveFieldMessage("firstName", "invalid", m)).toBe("invalidName");
    expect(resolveFieldMessage("lastName", "too_long", m)).toBe("tooLong");
  });

  it("maps email codes", () => {
    expect(resolveFieldMessage("email", "required", m)).toBe("required");
    expect(resolveFieldMessage("email", "invalid", m)).toBe("invalidEmail");
    expect(resolveFieldMessage("email", "too_long", m)).toBe("tooLong");
  });

  it("maps message codes", () => {
    expect(resolveFieldMessage("message", "too_short", m)).toBe("messageTooShort");
    expect(resolveFieldMessage("message", "too_long", m)).toBe("tooLong");
  });

  it("maps captcha/honeypot to the captcha message", () => {
    expect(resolveFieldMessage("turnstileToken", "captcha", m)).toBe("captcha");
    expect(resolveFieldMessage("company", "invalid", m)).toBe("captcha");
  });

  it("falls back to the server message for unknown fields", () => {
    expect(resolveFieldMessage("mystery", "invalid", m)).toBe("server");
  });
});
