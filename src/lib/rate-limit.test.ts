import { describe, expect, it } from "vitest";

// Ensure Upstash is NOT configured for this test so we exercise the fail-closed path.
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

import { checkInquiryRateLimit } from "./rate-limit";

describe("checkInquiryRateLimit", () => {
  it("fails CLOSED when the limiter is not configured", async () => {
    const outcome = await checkInquiryRateLimit("client-hash");
    expect(outcome.success).toBe(false);
    expect(outcome.unavailable).toBe(true);
    expect(outcome.retryAfterSeconds).toBeGreaterThan(0);
  });
});
