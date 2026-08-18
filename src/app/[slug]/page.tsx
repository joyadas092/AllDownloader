import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Link2, Smartphone } from "lucide-react";

import { brand } from "@/lib/brand";
import { getPlatformBySlug, platforms } from "@/lib/platforms";
import Container from "@/components/Container";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import DownloaderWidget from "@/components/downloader/DownloaderWidget";
import FaqAccordion from "@/components/FaqAccordion";
import PlatformBadge from "@/components/PlatformBadge";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/AdSlot";

/** Only the curated slugs are pages — anything else is a 404, never an index-able URL. */
export const dynamicParams = false;

export function generateStaticParams() {
  return platforms.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  if (!platform) return {};

  const url = `/${platform.slug}`;

  return {
    title: platform.title,
    description: platform.metaDescription,
    alternates: { canonical: url },
    keywords: platform.keywords,
    openGraph: {
      type: "website",
      title: platform.title,
      description: platform.metaDescription,
      url,
      siteName: brand.name,
    },
    twitter: {
      card: "summary_large_image",
      title: platform.title,
      description: platform.metaDescription,
    },
  };
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const platform = getPlatformBySlug(slug);
  if (!platform) notFound();

  const parent = platform.parentSlug ? getPlatformBySlug(platform.parentSlug) : undefined;
  const crumbs: Crumb[] = [
    ...(parent ? [{ label: platform.familyLabel, href: `/${parent.slug}` }] : []),
    { label: platform.toolName, href: `/${platform.slug}` },
  ];

  const related = platform.related
    .map((s) => getPlatformBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: `${platform.toolName} — ${brand.name}`,
          url: `${brand.siteUrl}/${platform.slug}`,
          description: platform.metaDescription,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <Container>
        <AdSlot name="AdSlotTop" className="mt-6 mb-0" />
      </Container>

      <section className="pt-8 pb-10 sm:pt-10 sm:pb-14">
        <Container>
          <Breadcrumbs items={crumbs} />

          <div className="mt-6 flex items-center gap-4">
            <PlatformBadge icon={platform.icon} color={platform.color} initial={platform.initial} size={48} />
            <h1 className="text-2xl font-bold text-text sm:text-4xl">{platform.h1}</h1>
          </div>

          <p className="mt-4 max-w-2xl text-text-muted">{platform.intro}</p>

          <div className="mt-8 max-w-2xl">
            <DownloaderWidget />
          </div>
        </Container>
      </section>

      <Container>
        <AdSlot name="AdSlotAfterDownloader" />

        <section className="py-12">
          <h2 className="text-xl font-bold text-text sm:text-2xl">
            How to Download {platform.name} Videos
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platform.instructions.map((step, i) => (
              <li key={step} className="rounded-2xl border border-border bg-surface p-5">
                <span className="gradient-text text-3xl font-bold opacity-40">{i + 1}</span>
                <p className="mt-2 text-sm text-text-muted">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-12">
          <h2 className="text-xl font-bold text-text sm:text-2xl">
            {platform.toolName} Features
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {platform.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-text-muted"
              >
                <CheckCircle2 size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-400" />
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className="py-12">
          <h2 className="text-xl font-bold text-text sm:text-2xl">Supported Formats and Quality</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
            {platform.formatsExplainer}
          </p>

          <h3 className="mt-8 text-base font-semibold text-text">Links this page accepts</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {platform.urlForms.map((form) => (
              <li
                key={form}
                className="flex items-start gap-2.5 rounded-lg border border-border bg-bg-soft/60 px-4 py-3 text-sm text-text-muted"
              >
                <Link2 size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-text-dim" />
                <code className="font-mono text-xs">{form}</code>
              </li>
            ))}
          </ul>
        </section>

        <AdSlot name="AdSlotMiddle" />

        <section className="py-12">
          <h2 className="text-xl font-bold text-text sm:text-2xl">How It Works</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
            When you paste a link, we ask the source platform which versions of that video exist and
            show you the list. Nothing is downloaded until you choose one.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted">
            Most formats are already a single complete file on the platform&apos;s own servers, so your
            browser fetches them directly — nothing is copied onto ours. The exceptions are videos
            stored as separate picture and sound tracks: those are combined into one MP4 in temporary
            storage, handed to you, and deleted immediately afterwards.
          </p>
        </section>

        <section className="py-12">
          <h2 className="flex items-center gap-2 text-xl font-bold text-text sm:text-2xl">
            <Smartphone size={20} aria-hidden="true" className="text-primary-2" />
            Download {platform.name} Videos on Mobile
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-text">On Android</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{platform.mobile.android}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-text">On iPhone and iPad</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{platform.mobile.ios}</p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="mb-6 text-xl font-bold text-text sm:text-2xl">
            {platform.name} Downloader FAQs
          </h2>
          <div className="max-w-2xl">
            <FaqAccordion items={platform.faq} />
          </div>
        </section>

        <section className="py-12">
          <h2 className="mb-2 text-xl font-bold text-text sm:text-2xl">More Download Tools</h2>
          <p className="mb-6 text-sm text-text-muted">
            Closely related tools, if {platform.toolName} is not quite what you needed.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
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
        </section>

        <AdSlot name="AdSlotBottom" />
      </Container>
    </>
  );
}
