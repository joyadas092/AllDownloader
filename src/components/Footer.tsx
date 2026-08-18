import Link from "next/link";

import { brand } from "@/lib/brand";
import Container from "@/components/Container";
import BrandLogo from "@/components/icons/BrandLogo";
import { getPlatformBySlug } from "@/lib/platforms";

/**
 * Grouped by the platform a visitor is thinking about, not by keyword. Kept
 * deliberately short — a footer stuffed with every possible phrase helps nobody
 * and reads as spam to both users and crawlers.
 */
const columns: { heading: string; slugs: string[] }[] = [
  {
    heading: "YouTube Tools",
    slugs: ["youtube-video-downloader", "youtube-shorts-downloader", "youtube-mp3-downloader"],
  },
  {
    heading: "Instagram & Threads",
    slugs: ["instagram-video-downloader", "instagram-reels-downloader", "threads-video-downloader"],
  },
  {
    heading: "Facebook & TikTok",
    slugs: ["facebook-video-downloader", "facebook-reels-downloader", "tiktok-video-downloader"],
  },
  {
    heading: "Other Platforms",
    slugs: [
      "twitter-video-downloader",
      "x-video-downloader",
      "pinterest-video-downloader",
      "reddit-video-downloader",
      "snapchat-video-downloader",
      "vimeo-video-downloader",
    ],
  },
];

const companyLinks = [
  { href: "/online-video-downloader", label: "All downloaders" },
  { href: "/blog", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/dmca", label: "DMCA / Copyright" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-soft">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-semibold text-text">
            <BrandLogo size={32} />
            <span className="text-lg">{brand.name}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-text-muted">{brand.tagline}</p>
          <p className="mt-4 max-w-sm text-xs text-text-dim">
            Only download content you own, have permission to save, or that is otherwise legally
            available for download.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h3 className="text-sm font-semibold text-text">{column.heading}</h3>
            <ul className="mt-4 space-y-3 text-sm text-text-muted">
              {column.slugs.map((slug) => {
                const platform = getPlatformBySlug(slug);
                if (!platform) return null;
                return (
                  <li key={slug}>
                    <Link href={`/${slug}`} className="hover:text-text">
                      {platform.toolName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}

        <nav aria-label="Company and legal">
          <h3 className="text-sm font-semibold text-text">Company</h3>
          <ul className="mt-4 space-y-3 text-sm text-text-muted">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-border py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-text-dim sm:flex-row">
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            {brand.name} is an independent service, not affiliated with or endorsed by YouTube,
            Instagram, TikTok, Facebook, X, Pinterest, Reddit, Snapchat, Threads or Vimeo.
          </p>
        </Container>
      </div>
    </footer>
  );
}
