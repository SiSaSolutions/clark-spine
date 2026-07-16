import type { MetadataRoute } from "next";

import { brandAssets } from "@/lib/brand";

/**
 * Web app manifest. Uses the approved spine mark (transparent); brand navy as
 * the theme color. Kept minimal — this is a marketing site, not an
 * installable app.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clark Spine and Pain Relief",
    short_name: "Clark Spine",
    description: "Chiropractic and pain-relief care in Clark, New Jersey.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0a2342",
    icons: [
      {
        src: brandAssets.icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: brandAssets.icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
