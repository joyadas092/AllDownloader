import type { Metadata } from "next";
import Link from "next/link";

import { brand } from "@/lib/brand";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: `About ${brand.name}`,
  description: `What ${brand.name} is, how it handles your downloads, and where its limits are.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="py-14 sm:py-20">
      <Container className="max-w-2xl">
        <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
        <h1 className="mt-6 text-3xl font-bold text-text sm:text-4xl">About {brand.name}</h1>

        <div className="mt-6 space-y-5 text-text-muted">
          <p>
            {brand.name} is a browser-based tool for saving public videos from social platforms. You
            paste a link, it shows you which versions of that video exist, and you pick one. That is
            the whole product.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-text">How it handles your downloads</h2>
          <p>
            Most videos are stored by their platform as one complete file. For those, your browser
            fetches the file from the platform&apos;s own servers — it never travels through us. That
            is faster for you and keeps our running costs low enough that the service can stay free.
          </p>
          <p>
            Some videos are stored as separate picture and sound tracks, which have to be combined
            into a single playable file first. Those are processed in temporary storage, handed to
            you, and deleted immediately. Nothing is archived, indexed or kept.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-text">What it deliberately will not do</h2>
          <p>
            Anything behind a login stays behind that login. Private accounts, password-protected
            videos, paid subscriptions, private groups and disappearing messages are all out of reach,
            and we are not interested in changing that.
          </p>
          <p>
            We also do not claim to remove watermarks. If a platform bakes one into the file it
            serves, that is the file — no honest tool can undo it.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-text">Independence</h2>
          <p>
            {brand.name} is an independent project. It is not affiliated with, endorsed by, or
            connected to YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit, Snapchat, Threads
            or Vimeo. All trademarks belong to their respective owners.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-text">Get in touch</h2>
          <p>
            Bug reports and questions go to our{" "}
            <Link href="/contact" className="text-primary-2 underline underline-offset-2">
              contact page
            </Link>
            . Rights holders should use the{" "}
            <Link href="/dmca" className="text-primary-2 underline underline-offset-2">
              DMCA page
            </Link>
            . Our{" "}
            <Link href="/terms" className="text-primary-2 underline underline-offset-2">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary-2 underline underline-offset-2">
              privacy policy
            </Link>{" "}
            set out the rest.
          </p>
        </div>
      </Container>
    </section>
  );
}
