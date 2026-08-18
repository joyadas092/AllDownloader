import type { Metadata } from "next";
import Link from "next/link";

import { getPostBySlug } from "@/lib/blog";
import BlogLayout from "@/components/BlogLayout";

const post = getPostBySlug("how-to-save-tiktok-videos")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  alternates: { canonical: `/blog/${post.slug}` },
};

export default function Page() {
  return (
    <BlogLayout
      post={post}
      relatedLinks={[
        { href: "/tiktok-video-downloader", label: "TikTok Video Downloader" },
        { href: "/blog/how-to-download-instagram-reels", label: "How to Download Instagram Reels" },
      ]}
    >
      <p>
        TikTok's in-app save button works fine when it's available, but plenty of creators disable
        it, and it doesn't help at all if you're on desktop or the link was shared to you outside the
        app. Here's the browser-based route.
      </p>

      <h2 className="text-xl font-semibold text-text">Copying the link</h2>
      <p>
        Tap Share on the video, then Copy Link. You'll get either a full{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-sm">tiktok.com/@user/video/…</code>{" "}
        link or a shortened{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-sm">vm.tiktok.com/…</code> one — both
        work the same way with a downloader, since the short link just redirects to the full one.
      </p>

      <h2 className="text-xl font-semibold text-text">Downloading</h2>
      <p>
        Paste the link into our{" "}
        <Link href="/tiktok-video-downloader" className="text-primary-2 hover:underline">
          TikTok Video Downloader
        </Link>{" "}
        and download the MP4. Whether the result includes TikTok's on-screen watermark depends on the
        source file TikTok serves — a downloader can only pass through what's actually there.
      </p>

      <h2 className="text-xl font-semibold text-text">Common failure: profile links</h2>
      <p>
        Copying a link from a creator's profile page (rather than opening the specific video first)
        produces a profile URL with no video attached — extraction will fail because there's nothing
        to extract. Always open the individual video before tapping Share.
      </p>
    </BlogLayout>
  );
}
