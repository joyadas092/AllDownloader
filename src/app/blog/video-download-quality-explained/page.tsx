import type { Metadata } from "next";
import Link from "next/link";

import { getPostBySlug } from "@/lib/blog";
import BlogLayout from "@/components/BlogLayout";

const post = getPostBySlug("video-download-quality-explained")!;

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
        { href: "/blog/mp4-vs-mp3", label: "MP4 vs MP3" },
        { href: "/youtube-video-downloader", label: "YouTube Video Downloader" },
      ]}
    >
      <p>
        Resolution numbers like 360p, 720p, and 1080p refer to vertical pixel count — a 1080p video
        is 1920×1080 pixels, a 360p video is 640×360. More pixels means a sharper picture, but it
        also means a bigger file and a longer download.
      </p>

      <h2 className="text-xl font-semibold text-text">What each range is good for</h2>
      <p>
        <strong className="text-text">360p–480p</strong> is fine for a small phone screen or when
        you're on a limited data plan — the file is small and quick to move around.{" "}
        <strong className="text-text">720p</strong> is the sweet spot for most phones and laptops; it
        looks sharp without ballooning the file size. <strong className="text-text">1080p</strong>{" "}
        and above are worth it for a TV, a large monitor, or footage you're archiving long-term.
      </p>

      <h2 className="text-xl font-semibold text-text">Why file size scales so fast</h2>
      <p>
        Doubling the resolution roughly quadruples the pixel count, and bitrate (how much data
        encodes each second of video) usually scales up to match — so a 1080p file isn't twice the
        size of 720p, it's often three to four times larger for the same length of video.
      </p>

      <h2 className="text-xl font-semibold text-text">Why some videos don&apos;t offer every quality</h2>
      <p>
        A downloader can only offer resolutions the source actually generated. If a video was
        originally uploaded in 720p, no downloader can conjure a genuine 1080p version from it — you
        might see an "upscaled" file elsewhere, but it won't contain any more real detail. Our{" "}
        <Link href="/youtube-video-downloader" className="text-primary-2 hover:underline">
          YouTube Downloader
        </Link>{" "}
        only lists qualities that genuinely exist for that upload.
      </p>
    </BlogLayout>
  );
}
