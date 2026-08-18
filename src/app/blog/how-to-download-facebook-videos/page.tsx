import type { Metadata } from "next";
import Link from "next/link";

import { getPostBySlug } from "@/lib/blog";
import BlogLayout from "@/components/BlogLayout";

const post = getPostBySlug("how-to-download-facebook-videos")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  alternates: { canonical: `/blog/${post.slug}` },
};

export default function Page() {
  return (
    <BlogLayout
      post={post}
      relatedLinks={[{ href: "/facebook-video-downloader", label: "Facebook Video Downloader" }]}
    >
      <p>
        Facebook video links come in more shapes than most platforms — a post URL, a Watch page URL,
        or a shortened <code className="rounded bg-surface px-1.5 py-0.5 text-sm">fb.watch</code>{" "}
        link — and which one you copy affects whether extraction works cleanly.
      </p>

      <h2 className="text-xl font-semibold text-text">Getting the right link</h2>
      <p>
        Open the video directly (not the profile or Page it was posted from), click the three-dot
        menu above the post, and choose Copy Link. This grabs a link that points at the video itself
        rather than the surrounding feed context.
      </p>

      <h2 className="text-xl font-semibold text-text">Downloading it</h2>
      <p>
        Paste the link into our{" "}
        <Link href="/facebook-video-downloader" className="text-primary-2 hover:underline">
          Facebook Video Downloader
        </Link>
        . Public Page and Group videos often expose both SD and HD renditions — pick whichever suits
        where you're going to watch it.
      </p>

      <h2 className="text-xl font-semibold text-text">When it doesn&apos;t work</h2>
      <p>
        Facebook requires a login to view content in private groups or friends-only posts, and that
        content can't be extracted without authenticating as that user — which a public downloader
        tool won't do. If a link fails, check whether you can open it in a private/incognito browser
        window; if it also fails there, the video isn't public.
      </p>
    </BlogLayout>
  );
}
