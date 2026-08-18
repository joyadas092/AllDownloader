import type { Metadata } from "next";
import Link from "next/link";

import { brand } from "@/lib/brand";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "DMCA / Copyright Policy",
  description: `How to submit a copyright takedown request to ${brand.name}.`,
  alternates: { canonical: "/dmca" },
};

export default function DmcaPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ label: "DMCA / Copyright", href: "/dmca" }]} />
        <h1 className="mt-6 text-3xl font-bold text-text sm:text-4xl">DMCA / Copyright Policy</h1>
        <p className="mt-2 text-sm text-text-dim">Last updated: August 2026</p>

        <div className="prose-content mt-10 space-y-6 text-[15px] leading-relaxed text-text-muted">
          <p>
            {brand.name} does not host video content. It's a tool that fetches publicly available
            videos, at a user's request, directly from the source platform — the same content the
            user could already view by visiting that platform's link.
          </p>

          <h2 className="text-lg font-semibold text-text">Responsibility</h2>
          <p>
            Users are solely responsible for ensuring they have the right to download and use any
            content they process through this tool. We expect use consistent with the terms of the
            source platform and applicable copyright law.
          </p>

          <h2 className="text-lg font-semibold text-text">Submitting a takedown request</h2>
          <p>
            If you're a rights holder and believe this service is being used to facilitate
            infringement of your copyrighted work, contact us via our{" "}
            <Link href="/contact" className="text-primary-2 hover:underline">
              Contact page
            </Link>{" "}
            with:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>A description of the copyrighted work.</li>
            <li>The specific URL(s) or content in question.</li>
            <li>Your contact information and a statement of good-faith belief that use is unauthorized.</li>
          </ul>
          <p>We'll review and respond to valid requests promptly.</p>
        </div>
      </Container>
    </section>
  );
}
