import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { primaryPlatforms } from "@/lib/platforms";
import PlatformBadge from "@/components/PlatformBadge";

export default function PlatformGrid() {
  const unique = primaryPlatforms();

  return (
    <section id="platforms" className="scroll-mt-24 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-text sm:text-3xl">Supported Platforms</h2>
        <p className="mt-2 text-text-muted">Paste any public video link from these sites, and more.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {unique.map((p) => (
          <Link
            key={p.id}
            href={`/${p.slug}`}
            className="group relative flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface-2 sm:p-6"
          >
            <PlatformBadge
              icon={p.icon}
              color={p.color}
              initial={p.initial}
              size={56}
              className="transition-transform group-hover:scale-105"
            />

            <span className="min-w-0">
              <span className="block text-base font-semibold text-text sm:text-lg">{p.name}</span>
              <span className="mt-0.5 block text-xs text-text-dim">{p.familyLabel}</span>
            </span>

            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="absolute right-4 top-4 text-text-dim opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
