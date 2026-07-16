import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Secret must be present before the env module reads process.env (first access).
process.env.TURNSTILE_SECRET_KEY = "test-secret";

import { verifyTurnstile } from "./turnstile";

describe("verifyTurnstile", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns success when Cloudflare confirms the token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200 })),
    );
    const result = await verifyTurnstile("good-token", "203.0.113.5");
    expect(result.success).toBe(true);
  });

  it("returns failure with error codes when Cloudflare rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({ success: false, "error-codes": ["invalid-input-response"] }),
            { status: 200 },
          ),
      ),
    );
    const result = await verifyTurnstile("bad-token");
    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("invalid-input-response");
  });

  it("fails closed on a network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );
    const result = await verifyTurnstile("any-token");
    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("verification-unavailable");
  });

  it("rejects an empty token without calling the network", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await verifyTurnstile("");
    expect(result.success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
