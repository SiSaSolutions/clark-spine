import type { NextConfig } from "next";

import { staticSecurityHeaders } from "./src/lib/security/headers";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Fail the production build on type or lint errors rather than shipping them.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Apply the static, request-independent security headers site-wide.
        // The per-request, nonce-based Content-Security-Policy is set in middleware.
        source: "/:path*",
        headers: staticSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
