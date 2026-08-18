import type { Metadata } from "next";
import Link from "next/link";

import { brand } from "@/lib/brand";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing use of ${brand.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ label: "Terms", href: "/terms" }]} />
        <h1 className="mt-6 text-3xl font-bold text-text sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-text-dim">Last updated: August 2026</p>

        <div className="prose-content mt-10 space-y-6 text-[15px] leading-relaxed text-text-muted">
          <p>By using {brand.name}, you agree to these terms. If you don't agree, please don't use the service.</p>

          <h2 className="text-lg font-semibold text-text">Acceptable use</h2>
          <p>
            You may use this tool to download videos you own, have explicit permission to download,
            or that are otherwise legally available for downloading under the source platform's own
            terms and applicable copyright law. You're responsible for how you use downloaded
            content.
          </p>

          <h2 className="text-lg font-semibold text-text">What we don&apos;t allow</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Automated or bulk scraping of the service outside normal browser use.</li>
            <li>Attempting to bypass rate limits, security controls, or access restrictions.</li>
            <li>Using the service to infringe copyright or violate a platform's terms of service.</li>
          </ul>

          <h2 className="text-lg font-semibold text-text">No warranty</h2>
          <p>
            The service is provided "as is." Extraction depends on third-party platforms outside our
            control, so availability, accuracy, and quality of results aren't guaranteed. We may
            modify or discontinue features at any time.
          </p>

          <h2 className="text-lg font-semibold text-text">Limitation of liability</h2>
          <p>
            To the extent permitted by law, {brand.name} isn't liable for indirect, incidental, or
            consequential damages arising from use of the service.
          </p>

          <h2 className="text-lg font-semibold text-text">Changes</h2>
          <p>We may update these terms from time to time. Continued use after a change means you accept the updated terms.</p>

          <h2 className="text-lg font-semibold text-text">Contact</h2>
          <p>
            Questions about these terms can be sent through our{" "}
            <Link href="/contact" className="text-primary-2 hover:underline">
              Contact page
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
