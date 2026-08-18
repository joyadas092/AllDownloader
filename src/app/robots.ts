import type { MetadataRoute } from "next";

import { brand } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Every API surface: JSON endpoints, SSE progress streams and the
          // one-shot download URLs. None of these are pages, and the download
          // routes would burn bandwidth on every crawl if they were followed.
          "/api/",
          "/api/extract",
          "/api/download/",
        ],
      },
    ],
    sitemap: `${brand.siteUrl}/sitemap.xml`,
    host: brand.siteUrl,
  };
}
