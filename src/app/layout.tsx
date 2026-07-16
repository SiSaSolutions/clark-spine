import type { ReactNode } from "react";

import "@/styles/globals.css";

/**
 * Root layout. Deliberately a passthrough: the `<html>`/`<body>` elements are
 * rendered by `app/[locale]/layout.tsx` so the `lang` attribute reflects the
 * active locale. Middleware guarantees every page resolves under `/[locale]`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
