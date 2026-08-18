import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { brand } from "@/lib/brand";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  // Only used inside <code> samples on the platform pages.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: { default: `${brand.name} – ${brand.tagline}`, template: `%s | ${brand.name}` },
  description:
    "Download videos from YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit and Vimeo. Paste a link, pick a quality, and save in seconds.",
  applicationName: brand.name,
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} – ${brand.tagline}`,
    description: "Download public videos from your favorite platforms in high quality.",
    url: brand.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} – ${brand.tagline}`,
    description: "Download public videos from your favorite platforms in high quality.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#070b12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            // No SearchAction: the site has no site-search endpoint, and
            // declaring one that doesn't exist is misleading markup.
            "@type": "WebSite",
            name: brand.name,
            url: brand.siteUrl,
            inLanguage: "en",
            publisher: {
              "@type": "Organization",
              name: brand.name,
              url: brand.siteUrl,
            },
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-text"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
