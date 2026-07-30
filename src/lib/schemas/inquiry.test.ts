import { describe, expect, it } from "vitest";

import { inquirySchema } from "./inquiry";

const valid = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  phone: "9085550123",
  subject: "New patient",
  message: "I would like to request an appointment for lower back pain.",
  company: "",
  turnstileToken: "token-abc",
};

function fieldCode(input: Record<string, unknown>, field: string): string | undefined {
  const result = inquirySchema.safeParse(input);
  if (result.success) return undefined;
  return result.error.issues.find((i) => i.path[0] === field)?.message;
}

describe("inquirySchema", () => {
  it("accepts a valid inquiry", () => {
    const result = inquirySchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("defaults optional subject to an empty string", () => {
    const { subject: _s, ...rest } = valid;
    const result = inquirySchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.subject).toBe("");
    }
  });

  it("requires the phone number", () => {
    expect(fieldCode({ ...valid, phone: "" }, "phone")).toBe("phone_required");
    const { phone: _p, ...noPhone } = valid;
    expect(fieldCode(noPhone, "phone")).toBe("phone_required");
  });

  it("rejects phone numbers that are not exactly 10 digits", () => {
    expect(fieldCode({ ...valid, phone: "908" }, "phone")).toBe("phone_length");
    expect(fieldCode({ ...valid, phone: "12345678901" }, "phone")).toBe("phone_length");
  });

  it("rejects phone numbers containing non-digit characters", () => {
    expect(fieldCode({ ...valid, phone: "90a5550123" }, "phone")).toBe("phone_invalid");
    expect(fieldCode({ ...valid, phone: "(908) 555-0123" }, "phone")).toBe("phone_invalid");
    expect(fieldCode({ ...valid, phone: "abcdefghij" }, "phone")).toBe("phone_invalid");
  });

  it("accepts a bare 10-digit phone number", () => {
    expect(inquirySchema.safeParse({ ...valid, phone: "7325551234" }).success).toBe(true);
  });

  it("rejects names containing newlines (header-injection defense)", () => {
    expect(
      fieldCode({ ...valid, firstName: "Jane\r\nBcc: evil@x.com" }, "firstName"),
    ).toBe("invalid");
  });

  it("rejects names with digits or angle brackets", () => {
    expect(fieldCode({ ...valid, lastName: "Sm1th" }, "lastName")).toBe("invalid");
    expect(fieldCode({ ...valid, firstName: "<script>" }, "firstName")).toBe("invalid");
  });

  it("rejects invalid emails and emails with newlines", () => {
    expect(fieldCode({ ...valid, email: "not-an-email" }, "email")).toBe("invalid");
    expect(fieldCode({ ...valid, email: "a@b.com\nBcc: x" }, "email")).toBe("invalid");
  });

  it("enforces the minimum message length", () => {
    expect(fieldCode({ ...valid, message: "too short" }, "message")).toBe("too_short");
  });

  it("rejects a filled honeypot", () => {
    expect(fieldCode({ ...valid, company: "I am a bot" }, "company")).toBe("invalid");
  });

  it("requires a turnstile token", () => {
    expect(fieldCode({ ...valid, turnstileToken: "" }, "turnstileToken")).toBe("captcha");
  });

  it("rejects an over-long message", () => {
    expect(fieldCode({ ...valid, message: "x".repeat(2001) }, "message")).toBe(
      "too_long",
    );
  });
});
