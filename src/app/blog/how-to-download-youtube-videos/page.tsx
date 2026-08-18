import type { Metadata } from "next";
import Link from "next/link";

import { getPostBySlug } from "@/lib/blog";
import BlogLayout from "@/components/BlogLayout";

const post = getPostBySlug("how-to-download-youtube-videos")!;

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
        { href: "/youtube-video-downloader", label: "YouTube Video Downloader" },
        { href: "/blog/video-download-quality-explained", label: "Video Quality Explained" },
        { href: "/blog/mp4-vs-mp3", label: "MP4 vs MP3" },
      ]}
    >
      <p>
        Downloading a YouTube video for offline viewing is a one-minute job once you know where the
        share link lives and which resolution actually matters for what you're doing with the file.
        Here's the whole process, plus a few things that trip people up.
      </p>

      <h2 className="text-xl font-semibold text-text">Step 1: Get the video&apos;s URL</h2>
      <p>
        On desktop, the address bar already has it. On mobile, open the video in the YouTube app, tap
        Share, then Copy Link — this gives you a clean{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-sm">youtu.be/…</code> link rather than
        one bundled with playlist or timestamp parameters, which extracts more reliably.
      </p>

      <h2 className="text-xl font-semibold text-text">Step 2: Paste it into a downloader</h2>
      <p>
        Paste the link into our{" "}
        <Link href="/youtube-video-downloader" className="text-primary-2 hover:underline">
          YouTube Downloader
        </Link>
        . It reads the video's metadata and lists every resolution actually available for that
        upload — you won't see 1080p offered for a video that was only ever uploaded in 480p.
      </p>

      <h2 className="text-xl font-semibold text-text">Step 3: Pick a resolution</h2>
      <p>
        For phones and casual viewing, 480p or 720p is usually plenty and downloads faster. Reserve
        1080p for content you'll watch on a larger screen or want to keep long-term. If you only need
        the audio — a lecture, a podcast upload, a music video — the MP3 option skips the video
        entirely and produces a much smaller file.
      </p>

      <h2 className="text-xl font-semibold text-text">Why a download might fail</h2>
      <p>
        Three common causes: the video is age-restricted or private and requires a logged-in session
        to view at all, it's blocked in your region, or the link was copied from a playlist page and
        points somewhere unexpected. Re-copying the link directly from the video page usually fixes
        the third case.
      </p>
    </BlogLayout>
  );
}
