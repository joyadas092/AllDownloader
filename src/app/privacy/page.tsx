import type { Metadata } from "next";
import Link from "next/link";

import { brand } from "@/lib/brand";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${brand.name} handles the URLs you submit and the files it generates.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy" }]} />
        <h1 className="mt-6 text-3xl font-bold text-text sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-text-dim">Last updated: August 2026</p>

        <div className="prose-content mt-10 space-y-6 text-[15px] leading-relaxed text-text-muted">
          <p>
            This policy explains what {brand.name} ("we", "us") collects when you use this website,
            and how it's handled.
          </p>

          <h2 className="text-lg font-semibold text-text">What we process</h2>
          <p>
            When you submit a video URL, we send it to our extraction service to read the video's
            metadata and, if you request a download, to fetch the file. The URL and the resulting
            temporary file are processed only to fulfill that request.
          </p>

          <h2 className="text-lg font-semibold text-text">Temporary files</h2>
          <p>
            Downloaded video files are stored temporarily on our servers only for as long as needed
            to deliver them to you. Files are deleted automatically after a short retention window,
            and immediately after being downloaded via a one-time link, whichever comes first. We do
            not build a library of downloaded content.
          </p>

          <h2 className="text-lg font-semibold text-text">Logs and technical data</h2>
          <p>
            Like most web services, our servers log basic technical data (such as IP address and
            request timestamps) for security, rate-limiting, and abuse prevention. We don't sell this
            data or use it for advertising.
          </p>

          <h2 className="text-lg font-semibold text-text">Cookies and analytics</h2>
          <p>
            We only load analytics tools (such as Google Analytics or Plausible) if they've been
            explicitly configured for this deployment. No advertising trackers are used.
          </p>

          <h2 className="text-lg font-semibold text-text">Third-party platforms</h2>
          <p>
            We are not affiliated with the platforms this tool supports. When you submit a link, our
            server fetches publicly available data from that platform on your behalf — the same as
            your browser would if you visited the link directly.
          </p>

          <h2 className="text-lg font-semibold text-text">Contact</h2>
          <p>
            Questions about this policy can be sent through our{" "}
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
