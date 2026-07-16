import type { MetadataRoute } from "next";

/**
 * Web app manifest. Uses the practice's logo mark; brand navy as the theme
 * color. Kept minimal — this is a marketing site, not an installable app.
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
        src: "/brand/logo-mark.png",
        sizes: "1176x1176",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
