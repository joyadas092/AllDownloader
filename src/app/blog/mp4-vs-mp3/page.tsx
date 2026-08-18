import type { Metadata } from "next";

import { getPostBySlug } from "@/lib/blog";
import BlogLayout from "@/components/BlogLayout";

const post = getPostBySlug("mp4-vs-mp3")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  alternates: { canonical: `/blog/${post.slug}` },
};

export default function Page() {
  return (
    <BlogLayout
      post={post}
      relatedLinks={[{ href: "/blog/video-download-quality-explained", label: "Video Quality Explained" }]}
    >
      <p>
        Every downloader gives you the choice between the full video (MP4) and audio-only (MP3). The
        right pick depends entirely on what you're going to do with the file.
      </p>

      <h2 className="text-xl font-semibold text-text">When MP4 makes sense</h2>
      <p>
        If you need to actually watch the content — a tutorial, a Reel, a talk with slides — you need
        the video track, obviously. MP4 with H.264 video and AAC audio is the most broadly compatible
        combination, playing natively on essentially every phone, TV, and media player without
        conversion.
      </p>

      <h2 className="text-xl font-semibold text-text">When MP3 makes sense</h2>
      <p>
        For a podcast clip, a music video, a lecture, or an interview where you only care about the
        audio, extracting straight to MP3 gives you a file that's often a tenth the size of the video
        version — faster to download and easier to store in bulk.
      </p>

      <h2 className="text-xl font-semibold text-text">What "192kbps" means</h2>
      <p>
        Our audio extraction encodes at 192kbps, a widely-used middle ground: noticeably better than
        the 128kbps you'll find on some streaming defaults, without the diminishing returns of going
        much higher for typical listening (phone speakers, earbuds, car audio).
      </p>

      <h2 className="text-xl font-semibold text-text">One important caveat</h2>
      <p>
        Extracting audio from a video doesn't add anything that wasn't already there — a video with
        mediocre source audio will produce a mediocre MP3, just smaller. For quality that actually
        matters, the source recording quality is what to look at first.
      </p>
    </BlogLayout>
  );
}
