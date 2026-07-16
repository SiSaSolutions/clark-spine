import { headers } from "next/headers";

/**
 * Read the per-request CSP nonce set by middleware.
 *
 * Calling this opts the rendering into dynamic mode, which is required for
 * nonce-based CSP: Next.js injects the nonce into its script tags only when a
 * page is rendered per-request. Returns an empty string if middleware did not
 * run (e.g. during static prerender of error pages).
 */
export async function getNonce(): Promise<string> {
  const headerList = await headers();
  return headerList.get("x-nonce") ?? "";
}
