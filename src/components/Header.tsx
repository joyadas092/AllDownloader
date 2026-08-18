"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";

import { brand } from "@/lib/brand";
import Container from "@/components/Container";
import BrandLogo from "@/components/icons/BrandLogo";
import PlatformBadge from "@/components/PlatformBadge";
import { getPlatformBySlug } from "@/lib/platforms";

interface MenuItem {
  href: string;
  label: string;
  description: string;
  /** Renders the platform's brand mark when the entry maps to one. */
  slug?: string;
}

interface MenuGroup {
  label: string;
  /** Two-column grid of tools, like the platform picker in the reference design. */
  items: MenuItem[];
  footer?: { href: string; label: string; note: string };
}

const platformItem = (slug: string, description: string): MenuItem => {
  const platform = getPlatformBySlug(slug);
  return { href: `/${slug}`, label: platform?.toolName ?? slug, description, slug };
};

const menus: MenuGroup[] = [
  {
    label: "Downloaders",
    items: [
      platformItem("youtube-video-downloader", "Save any public YouTube video as MP4."),
      platformItem("instagram-video-downloader", "Download videos from public Instagram posts."),
      platformItem("tiktok-video-downloader", "Grab TikTok clips from full or short links."),
      platformItem("facebook-video-downloader", "Public Facebook videos in SD or HD."),
      platformItem("twitter-video-downloader", "Videos and GIFs from public tweets."),
      platformItem("x-video-downloader", "Built for the x.com post URL format."),
      platformItem("pinterest-video-downloader", "Save video Pins and pin.it short links."),
      platformItem("reddit-video-downloader", "Reddit videos with the audio merged in."),
      platformItem("snapchat-video-downloader", "Public Spotlight clips and profile videos."),
      platformItem("threads-video-downloader", "Videos attached to public Threads posts."),
      platformItem("vimeo-video-downloader", "Higher-bitrate MP4s from public Vimeo."),
    ],
    footer: {
      href: "/online-video-downloader",
      label: "See all downloaders",
      note: "One box for every supported platform",
    },
  },
  {
    label: "Short-form & Audio",
    items: [
      platformItem("youtube-shorts-downloader", "Vertical Shorts, framing preserved."),
      platformItem("instagram-reels-downloader", "HD Reels straight from a /reel/ link."),
      platformItem("facebook-reels-downloader", "Vertical Facebook Reels as MP4."),
      platformItem("youtube-mp3-downloader", "Original audio track, or a 192 kbps MP3."),
    ],
    footer: {
      href: "/blog/mp4-vs-mp3",
      label: "MP4 vs MP3 — which to pick",
      note: "What you gain and lose with audio-only",
    },
  },
  {
    label: "Resources",
    items: [
      { href: "/blog", label: "Guides", description: "How-tos for each platform." },
      {
        href: "/blog/video-download-quality-explained",
        label: "Quality Explained",
        description: "360p vs 720p vs 1080p, and file size.",
      },
      { href: "/about", label: "About", description: "How the downloader handles your files." },
      { href: "/contact", label: "Contact", description: "Bug reports and questions." },
      { href: "/privacy", label: "Privacy Policy", description: "What we do and don't store." },
      { href: "/dmca", label: "DMCA / Copyright", description: "For rights holders." },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close on outside click and on Escape, so the panel never traps the page.
  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  return (
    <header className="glass sticky top-0 z-50 border-b border-border/80">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-text">
          <BrandLogo size={32} />
          <span className="text-lg">{brand.name}</span>
        </Link>

        <div ref={navRef} className="hidden md:block">
          <nav aria-label="Main" className="flex items-center gap-1">
            {menus.map((menu) => {
              const isOpen = openMenu === menu.label;
              return (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(menu.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenMenu(isOpen ? null : menu.label)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {menu.label}
                    <ChevronDown
                      size={15}
                      aria-hidden="true"
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      className={`animate-fade-up absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 ${
                        menu.items.length > 6 ? "w-[42rem]" : "w-[34rem]"
                      }`}
                    >
                      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/50">
                        <ul className="grid gap-1 p-3 sm:grid-cols-2">
                          {menu.items.map((item) => {
                            const platform = item.slug ? getPlatformBySlug(item.slug) : undefined;
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setOpenMenu(null)}
                                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-surface-2"
                                >
                                  {platform ? (
                                    <PlatformBadge
                                      icon={platform.icon}
                                      color={platform.color}
                                      initial={platform.initial}
                                      size={36}
                                    />
                                  ) : (
                                    <span
                                      aria-hidden="true"
                                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-2"
                                    >
                                      <ArrowRight size={16} />
                                    </span>
                                  )}
                                  <span className="min-w-0">
                                    <span className="block text-sm font-medium text-text">
                                      {item.label}
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">
                                      {item.description}
                                    </span>
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>

                        {menu.footer && (
                          <Link
                            href={menu.footer.href}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center justify-center gap-2 border-t border-border bg-bg-soft px-4 py-3.5 text-center transition-colors hover:bg-surface-2"
                          >
                            <span className="text-sm font-medium text-primary-2">
                              {menu.footer.label}
                            </span>
                            <ArrowRight size={14} aria-hidden="true" className="text-primary-2" />
                            <span className="hidden text-xs text-text-dim sm:inline">
                              · {menu.footer.note}
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/online-video-downloader"
              className="rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:text-text"
            >
              All Platforms
            </Link>
          </nav>
        </div>

        <div className="hidden md:block">
          <Link
            href="/#downloader"
            className="rounded-lg bg-gradient-to-r from-primary to-primary-2 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-transform hover:scale-[1.03]"
          >
            Download Now
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-text md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </Container>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-bg-soft md:hidden"
        >
          <Container className="py-3">
            {menus.map((menu) => (
              <details key={menu.label} className="group border-b border-border/60 last:border-0">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-base font-medium text-text marker:content-none">
                  {menu.label}
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className="text-text-dim transition-transform group-open:rotate-180"
                  />
                </summary>
                <ul className="pb-3">
                  {menu.items.map((item) => {
                    const platform = item.slug ? getPlatformBySlug(item.slug) : undefined;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-text-muted hover:bg-surface hover:text-text"
                        >
                          {platform && (
                            <PlatformBadge
                              icon={platform.icon}
                              color={platform.color}
                              initial={platform.initial}
                              size={28}
                            />
                          )}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                  {menu.footer && (
                    <li>
                      <Link
                        href={menu.footer.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-primary-2"
                      >
                        {menu.footer.label}
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </li>
                  )}
                </ul>
              </details>
            ))}

            <Link
              href="/#downloader"
              onClick={() => setMobileOpen(false)}
              className="mt-4 block rounded-lg bg-gradient-to-r from-primary to-primary-2 px-3 py-3 text-center text-base font-medium text-white"
            >
              Download Now
            </Link>
          </Container>
        </nav>
      )}
    </header>
  );
}
