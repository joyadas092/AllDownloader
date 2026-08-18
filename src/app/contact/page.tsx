import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { brand } from "@/lib/brand";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${brand.name} team.`,
  alternates: { canonical: "/contact" },
};

const contactEmail = process.env.CONTACT_EMAIL || "support@example.com";

export default function ContactPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container className="max-w-2xl">
        <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
        <h1 className="mt-6 text-3xl font-bold text-text sm:text-4xl">Contact</h1>
        <p className="mt-4 text-text-muted">
          Questions, bug reports, or copyright requests — reach us by email and we'll get back to
          you.
        </p>

        <a
          href={`mailto:${contactEmail}`}
          className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/50"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary-2">
            <Mail size={20} />
          </span>
          <div>
            <p className="font-medium text-text">{contactEmail}</p>
            <p className="text-sm text-text-dim">Typical response time: 1–2 business days</p>
          </div>
        </a>
      </Container>
    </section>
  );
}
