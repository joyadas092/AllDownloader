export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "how-to-download-youtube-videos",
    title: "How to Download YouTube Videos (The Right Way)",
    excerpt:
      "A practical walkthrough of downloading public YouTube videos for offline viewing, including which quality to pick and why.",
    date: "2026-06-02",
    readTime: "4 min read",
  },
  {
    slug: "how-to-download-instagram-reels",
    title: "How to Download Instagram Reels to Your Phone or Computer",
    excerpt:
      "Save a Reel in a few taps — where to find the share link, and what to do when a Reel won't download.",
    date: "2026-06-10",
    readTime: "3 min read",
  },
  {
    slug: "how-to-save-tiktok-videos",
    title: "How to Save TikTok Videos Without the App",
    excerpt:
      "Everything that changes between saving a TikTok in-app versus from a browser, and how to get a clean copy either way.",
    date: "2026-06-18",
    readTime: "3 min read",
  },
  {
    slug: "how-to-download-facebook-videos",
    title: "How to Download a Facebook Video from a Public Post",
    excerpt:
      "Facebook's share links come in a few different shapes. Here's how to find the right one and download the video behind it.",
    date: "2026-06-25",
    readTime: "3 min read",
  },
  {
    slug: "video-download-quality-explained",
    title: "Video Quality Explained: 360p vs 720p vs 1080p",
    excerpt:
      "What resolution actually changes, how it affects file size, and how to pick the right one for your connection and device.",
    date: "2026-07-03",
    readTime: "5 min read",
  },
  {
    slug: "mp4-vs-mp3",
    title: "MP4 vs MP3: Choosing Video or Audio-Only Downloads",
    excerpt:
      "When it makes sense to strip a video down to audio, what you lose, and what MP3 quality settings actually mean.",
    date: "2026-07-11",
    readTime: "4 min read",
  },
];

export function getPostBySlug(slug: string): BlogPostMeta | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
