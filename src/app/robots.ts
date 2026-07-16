import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/public-env";

/**
 * Robots policy.
 *
 * Only the production deployment is crawlable. Preview/development deployments
 * (Vercel sets VERCEL_ENV) return a blanket disallow so unfinished or
 * unverified content is never indexed. The API is always disallowed.
 */
export default function robots(): MetadataRoute.Robots {
  const isProductionDeploy = process.env.VERCEL_ENV === "production";

  if (!isProductionDeploy) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
