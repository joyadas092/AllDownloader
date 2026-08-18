import type { Metadata } from "next";
import Link from "next/link";

import { getPostBySlug } from "@/lib/blog";
import BlogLayout from "@/components/BlogLayout";

const post = getPostBySlug("how-to-download-instagram-reels")!;

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
        { href: "/instagram-reels-downloader", label: "Instagram Reels Downloader" },
        { href: "/instagram-video-downloader", label: "Instagram Video Downloader" },
        { href: "/blog/how-to-save-tiktok-videos", label: "How to Save TikTok Videos" },
      ]}
    >
      <p>
        Reels don't have a "Download" button inside Instagram — that's by design. The workaround
        isn't complicated, but it does mean going through a link, not a menu item.
      </p>

      <h2 className="text-xl font-semibold text-text">Finding the Reel link</h2>
      <p>
        Open the Reel, tap the paper-plane Share icon below it, and choose Copy Link near the top of
        the share sheet. That copies a direct{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-sm">instagram.com/reel/…</code> URL to
        your clipboard — this is the only link format that reliably resolves to the underlying video.
      </p>

      <h2 className="text-xl font-semibold text-text">Downloading it</h2>
      <p>
        Paste that link into our{" "}
        <Link href="/instagram-reels-downloader" className="text-primary-2 hover:underline">
          Instagram Reel Downloader
        </Link>
        . Because Reels are single pre-encoded files, you'll typically see one quality option rather
        than a full ladder of resolutions — that's what Instagram itself generated for the Reel.
      </p>

      <h2 className="text-xl font-semibold text-text">If it won&apos;t download</h2>
      <p>
        The most common reason is that the account is private — only content from public accounts can
        be processed without logging in as a follower. The second most common reason is a stale or
        truncated link; re-copy it directly from the Share sheet rather than from a browser address
        bar, which sometimes appends tracking parameters that break extraction.
      </p>

      <h2 className="text-xl font-semibold text-text">A note on audio</h2>
      <p>
        Some Reels use licensed music that Instagram serves with the audio muted or swapped in
        certain regions. If a downloaded Reel plays silently, that reflects what Instagram's own
        servers delivered — it isn't something a downloader can restore.
      </p>
    </BlogLayout>
  );
}
