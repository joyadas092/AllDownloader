import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  // One canonical URL shape. Without this a page is reachable both with and
  // without a trailing slash, which splits ranking signals.
  trailingSlash: false,

  // lucide-react ships one module per icon; this keeps only the icons actually
  // imported in the client bundle.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async redirects() {
    return [
      // Slugs renamed to match how people actually search. 308 so the old
      // URLs pass their signals on permanently.
      { source: "/youtube-downloader", destination: "/youtube-video-downloader", permanent: true },
      {
        source: "/instagram-reel-downloader",
        destination: "/instagram-reels-downloader",
        permanent: true,
      },
      // Common alternate spellings people type or link to.
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/copyright", destination: "/dmca", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Immutable build assets — safe to cache hard.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Download endpoints serve large, single-use, per-visitor files. They
        // must never be stored by a CDN or intermediary proxy.
        source: "/api/download/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/api/extract",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
