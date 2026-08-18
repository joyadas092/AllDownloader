import type { Metadata } from "next";
import Link from "next/link";
import { FileVideo, Lock, ScrollText } from "lucide-react";

import { brand } from "@/lib/brand";
import Container from "@/components/Container";
import DownloaderWidget from "@/components/downloader/DownloaderWidget";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import PlatformGrid from "@/components/PlatformGrid";
import PopularDownloaders from "@/components/PopularDownloaders";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/AdSlot";

const title = "Online Video Downloader – Download Videos from YouTube, Instagram, TikTok & More";
const description =
  "Paste a public video link from YouTube, Instagram, TikTok, Facebook, X, Pinterest or Reddit and download it as MP4. Free, no account, works on mobile.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  keywords: [
    "online video downloader",
    "free video downloader",
    "social media video downloader",
    "hd video downloader",
    "mp4 downloader",
  ],
  openGraph: { type: "website", title, description, url: "/", siteName: brand.name },
  twitter: { card: "summary_large_image", title, description },
};

const formats = [
  {
    name: "MP4 video",
    detail:
      "H.264 video with AAC audio — the combination that plays on essentially every phone, laptop and TV made in the last decade.",
  },
  {
    name: "Original audio",
    detail:
      "The platform's own audio track, usually M4A, downloaded without re-encoding. Fastest option and no quality loss relative to the source.",
  },
  {
    name: "MP3 audio",
    detail:
      "A 192 kbps conversion for players that cannot handle M4A. Converted on demand, so it takes a few seconds longer.",
  },
];

const homeFaq = [
  {
    question: `Is ${brand.name} free to use?`,
    answer:
      "Yes. There is no account, no payment and no daily download quota. Paste a link, choose a format, and save the file.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "YouTube including Shorts, Instagram and Reels, TikTok, Facebook and Facebook Reels, X/Twitter, Pinterest, Reddit, Threads, public Snapchat Spotlight, and Vimeo. Each has its own page with platform-specific detail.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. Everything runs in your browser. There is no extension, no desktop app and nothing to sign up for.",
  },
  {
    question: "Can I download private or paid videos?",
    answer:
      "No. If a video needs a login, a password, a subscription or group membership to view, it cannot be processed here — by design.",
  },
  {
    question: "Do you keep a copy of what I download?",
    answer:
      "No. Most downloads never pass through our servers at all. The few that need combining are written to temporary storage, deleted the moment you collect them, and swept automatically if you do not.",
  },
  {
    question: "Is downloading videos legal?",
    answer:
      "It depends on the video and where you live. Downloading your own uploads, public-domain material or content licensed for reuse is generally fine. Copying someone else's work without permission usually is not — and platform terms of service may prohibit it regardless.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: brand.name,
          url: brand.siteUrl,
          description,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <section className="relative overflow-hidden pt-14 pb-10 sm:pt-20 sm:pb-14">
        <Container className="flex flex-col items-center text-center">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-text-muted">
            ⚡ FAST • SIMPLE • FREE
          </span>

          <h1
            className="animate-fade-up mt-6 max-w-3xl text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.05s" }}
          >
            Free <span className="gradient-text">Online Video Downloader</span>
          </h1>

          <p
            className="animate-fade-up mt-5 max-w-xl text-base text-text-muted sm:text-lg"
            style={{ animationDelay: "0.1s" }}
          >
            Paste a public link from YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit and
            more. Pick a quality, save the file.
          </p>

          <div className="animate-fade-up mt-10 w-full max-w-2xl" style={{ animationDelay: "0.15s" }}>
            <DownloaderWidget />
          </div>
        </Container>
      </section>

      <Container>
        <AdSlot name="AdSlotAfterDownloader" />

        <PlatformGrid />
        <HowItWorks />

        <section className="py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-text sm:text-3xl">Supported Formats</h2>
            <p className="mt-2 text-text-muted">
              What you actually get, rather than a list of every codec that exists.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {formats.map((format) => (
              <div key={format.name} className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-2">
                  <FileVideo size={19} aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-text">{format.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{format.detail}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-text-muted">
            Resolutions are never invented. If a video was only ever published at 720p, 720p is the
            ceiling — no tool can reconstruct detail the uploader never provided.
          </p>
        </section>

        <WhyChooseUs />

        <AdSlot name="AdSlotMiddle" />

        <PopularDownloaders />

        <section className="py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-text sm:text-3xl">Frequently Asked Questions</h2>
          </div>
          <div className="mx-auto max-w-2xl">
            <FaqAccordion items={homeFaq} />
          </div>
        </section>

        <section className="grid gap-5 pb-20 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-2">
              <Lock size={19} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-text">Privacy and security</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              No account, so there is no profile to build. We do not keep a history of the links you
              paste, and most downloads travel from the source platform to your browser without
              passing through us at all. Files that do need processing are deleted as soon as you
              have them. Full detail is in our{" "}
              <Link href="/privacy" className="text-primary-2 underline underline-offset-2">
                privacy policy
              </Link>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-2">
              <ScrollText size={19} aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-text">Responsible use</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              This tool exists for offline access to content you are entitled to keep: your own
              uploads, material released under a permissive licence, or videos you have permission to
              save. Re-uploading someone else&apos;s work, stripping attribution or monetising it is
              not what this is for. Rights holders can reach us through our{" "}
              <Link href="/dmca" className="text-primary-2 underline underline-offset-2">
                DMCA page
              </Link>
              .
            </p>
          </div>
        </section>

        <AdSlot name="AdSlotBottom" />
      </Container>
    </>
  );
}
