import { describe, expect, it } from "vitest";

import { pickRecipient } from "./email";

describe("pickRecipient (dev-safe email routing)", () => {
  const patient = "real.patient@example.com";
  const owner = "frontdesk@practice.com";
  const override = "dev@example.com";

  it("sends to the intended recipient in production", () => {
    expect(pickRecipient(patient, true, override)).toBe(patient);
    expect(pickRecipient(owner, true, undefined)).toBe(owner);
  });

  it("redirects to the dev override outside production", () => {
    expect(pickRecipient(patient, false, override)).toBe(override);
    expect(pickRecipient(owner, false, override)).toBe(override);
  });

  it("SKIPS sending (null) in non-prod when no override is set", () => {
    // The critical guarantee: a real patient is never emailed from dev/preview.
    expect(pickRecipient(patient, false, undefined)).toBeNull();
  });
});
