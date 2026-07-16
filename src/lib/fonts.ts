import { Inter, Lora } from "next/font/google";

/**
 * Self-hosted fonts via next/font (no external requests at runtime — files are
 * downloaded and served from our own origin, satisfying `font-src 'self'`).
 * `display: swap` avoids invisible-text flashes on slow connections.
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});
