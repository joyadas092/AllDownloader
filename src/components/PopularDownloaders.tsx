import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { platforms } from "@/lib/platforms";

export default function PopularDownloaders() {
  return (
    <section className="py-20">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-text sm:text-3xl">Platform-Specific Downloaders</h2>
        <p className="mt-2 text-text-muted">
          Each page covers the quirks of one platform — URL formats, quality options and mobile steps.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="group flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-primary/50"
          >
            <span className="text-sm font-medium text-text">{p.toolName}</span>
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="text-text-dim transition-transform group-hover:translate-x-1 group-hover:text-primary-2"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
