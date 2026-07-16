/**
 * Centralized brand-asset configuration — the single source of truth for
 * every brand file referenced from metadata, the manifest, and structured
 * data. All assets are generated from the approved spine mark
 * (`public/brand/clark-spine-icon.svg`, in sync with
 * `src/components/brand/SpineMark.tsx`) by `scripts/generate-brand-assets.mjs`.
 *
 * Favicon / app icons (`src/app/icon0.svg`, `icon1.png`, `favicon.ico`,
 * `apple-icon.png`) are wired automatically by Next.js file conventions and
 * intentionally have no entry here.
 */
export const brandAssets = {
  /** Standalone approved spine mark (transparent SVG). */
  iconSvg: "/brand/clark-spine-icon.svg",
  /** Transparent raster mark for the web manifest. */
  icon192: "/brand/clark-spine-icon-192.png",
  /** Transparent raster mark for the manifest and JSON-LD `logo`. */
  icon512: "/brand/clark-spine-icon-512.png",
  /** Branded 1200×630 Open Graph / Twitter large-image card. */
  ogImage: "/brand/clark-spine-og.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
} as const;
