import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

import { brand } from "@/lib/brand";
import type { BlogPostMeta } from "@/lib/blog";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/AdSlot";

export default function BlogLayout({
  post,
  relatedLinks,
  children,
}: {
  post: BlogPostMeta;
  relatedLinks?: { href: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.date,
          author: { "@type": "Organization", name: brand.name },
          publisher: { "@type": "Organization", name: brand.name },
          mainEntityOfPage: `${brand.siteUrl}/blog/${post.slug}`,
        }}
      />
      <article className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title, href: `/blog/${post.slug}` },
            ]}
          />

          <h1 className="mt-6 text-3xl font-bold text-text sm:text-4xl">{post.title}</h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-text-dim">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>

          <AdSlot name="AdSlotTop" className="mt-8 mb-0" />

          <div className="prose-content mt-10 space-y-5 text-[15px] leading-relaxed text-text-muted">
            {children}
          </div>

          <AdSlot name="AdSlotBottom" />

          {relatedLinks && relatedLinks.length > 0 && (
            <div className="mt-14 border-t border-border pt-8">
              <p className="mb-4 text-sm font-semibold text-text">Related</p>
              <div className="flex flex-wrap gap-3">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-muted hover:text-text"
                  >
                    {link.label}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </article>
    </>
  );
}
