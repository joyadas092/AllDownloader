import type { Metadata } from "next";
import Link from "next/link";

import { primaryPlatforms } from "@/lib/platforms";
import Container from "@/components/Container";
import PlatformBadge from "@/components/PlatformBadge";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page doesn't exist. Jump to one of our downloaders instead.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl text-center">
        <p className="gradient-text text-6xl font-bold sm:text-7xl">404</p>
        <h1 className="mt-4 text-2xl font-bold text-text sm:text-3xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-text-muted">
          The link may be out of date, or the address may have a typo in it. The downloaders below all
          still work.
        </p>

        <div className="mt-10 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
          {primaryPlatforms().map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/50"
            >
              <PlatformBadge icon={p.icon} color={p.color} initial={p.initial} size={32} />
              <span className="text-sm font-medium text-text">{p.toolName}</span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link
            href="/"
            className="rounded-lg bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 font-medium text-white"
          >
            Go to the downloader
          </Link>
          <Link href="/blog" className="text-text-muted hover:text-text">
            Read the guides
          </Link>
          <Link href="/contact" className="text-text-muted hover:text-text">
            Report a broken link
          </Link>
        </div>
      </Container>
    </section>
  );
}
