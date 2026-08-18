import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { brand } from "@/lib/brand";
import { blogPosts } from "@/lib/blog";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Blog",
  description: `Guides and explainers on downloading and managing video from ${brand.name}.`,
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
        <h1 className="mt-6 text-3xl font-bold text-text sm:text-4xl">Blog</h1>
        <p className="mt-3 max-w-xl text-text-muted">
          Practical guides on downloading, formats, and getting the most out of {brand.name}.
        </p>

        <div className="mt-12 space-y-4">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center gap-1.5 text-xs text-text-dim">
                <CalendarDays size={13} />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                <span>·</span>
                {post.readTime}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-text">{post.title}</h2>
              <p className="mt-1.5 text-sm text-text-muted">{post.excerpt}</p>
              <span className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary-2">
                Read article
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
