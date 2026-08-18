import type { MetadataRoute } from "next";

import { brand } from "@/lib/brand";
import { platforms } from "@/lib/platforms";
import { blogPosts } from "@/lib/blog";

/**
 * Only canonical, indexable, 200-returning pages belong here. API routes,
 * download URLs and the 404 page are deliberately absent.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const informational = ["/blog", "/about"];
  const legal = ["/privacy", "/terms", "/dmca", "/contact"];

  return [
    {
      url: `${brand.siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...platforms.map((p) => ({
      url: `${brand.siteUrl}/${p.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: p.isHub ? 0.9 : 0.8,
    })),
    ...informational.map((path) => ({
      url: `${brand.siteUrl}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...blogPosts.map((post) => ({
      url: `${brand.siteUrl}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...legal.map((path) => ({
      url: `${brand.siteUrl}${path}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
