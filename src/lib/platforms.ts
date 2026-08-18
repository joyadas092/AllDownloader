export interface PlatformFaq {
  question: string;
  answer: string;
}

export interface PlatformConfig {
  slug: string;
  /** Groups pages that share a source platform, e.g. all YouTube tools. */
  id: string;
  /** Display name of the source platform. */
  name: string;
  /** Full tool name, used in nav and card labels. */
  toolName: string;
  /** hostnames (without www.) that map to this platform */
  hosts: string[];
  color: string;
  /** Fallback letter, shown when there is no brand mark for this entry. */
  initial: string;
  /** Key into PlatformIcons — the platform's official brand mark. */
  icon?: string;
  /** Breadcrumb group label, e.g. "YouTube Tools". */
  familyLabel: string;
  /** Slug of the family's main page. Omitted on the family's own main page. */
  parentSlug?: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** URL shapes this page accepts, listed on the page so intent is clear. */
  urlForms: string[];
  instructions: string[];
  features: string[];
  formatsExplainer: string;
  mobile: { android: string; ios: string };
  faq: PlatformFaq[];
  /** Contextual internal links — slugs of genuinely related tools. */
  related: string[];
  keywords: string[];
  /** Multi-platform hub page rather than a single-source tool. */
  isHub?: boolean;
}

export const platforms: PlatformConfig[] = [
  // ---------------------------------------------------------------- YouTube
  {
    slug: "youtube-video-downloader",
    id: "youtube",
    name: "YouTube",
    toolName: "YouTube Video Downloader",
    hosts: ["youtube.com", "youtu.be", "m.youtube.com", "music.youtube.com"],
    color: "#FF3B3B",
    initial: "Y",
    icon: "youtube",
    familyLabel: "YouTube Tools",
    title: "YouTube Video Downloader – Download YouTube Videos Online",
    metaDescription:
      "Paste a public YouTube link to download the video as MP4, up to the resolution the uploader published. Works in any browser, nothing to install.",
    h1: "YouTube Video Downloader",
    intro:
      "Paste a public YouTube URL and this page lists every resolution the video was actually published in — from 144p up to 1080p and beyond on 4K uploads. Pick one and it saves straight to your device.",
    urlForms: [
      "youtube.com/watch?v=…",
      "youtu.be/… share links",
      "m.youtube.com links copied from the mobile app",
      "music.youtube.com track links",
    ],
    instructions: [
      "Open the video and copy its URL from the address bar, or tap Share → Copy link in the app.",
      "Paste the link into the box above and press Download.",
      "Wait a moment while the available resolutions load.",
      "Pick the resolution you want and save the file.",
    ],
    features: [
      "Every resolution the uploader published, not a fixed list",
      "File size shown before you commit to a download",
      "Lower resolutions download instantly — they stream straight from YouTube's own servers",
      "No account, no extension, no desktop app",
    ],
    formatsExplainer:
      "YouTube stores most videos twice: a single combined file at lower resolutions, and separate video and audio streams for HD. Combined files (typically 360p and below) transfer directly to your browser. HD resolutions are muxed into an MP4 with H.264 video and AAC audio before you get them, which is why they take a few seconds longer.",
    mobile: {
      android:
        "Tap Share under the video, choose Copy link, then paste it here. Chrome saves the result to your Downloads folder, and it appears in Files or your gallery.",
      ios: "Tap Share → Copy Link in the YouTube app, paste it here, then tap Download. Safari asks you to confirm, and the file lands in the Downloads section of the Files app.",
    },
    faq: [
      {
        question: "What resolution can I download a YouTube video in?",
        answer:
          "Whatever the uploader published. If a video only exists in 720p, no tool can produce a 1080p copy of it. We list the real resolutions available for that specific video rather than promising a fixed set.",
      },
      {
        question: "Why do some qualities download instantly and others take longer?",
        answer:
          "YouTube serves lower resolutions as one complete file, so your browser can fetch it directly. HD resolutions arrive as separate video and audio streams that have to be combined into a single MP4 first.",
      },
      {
        question: "Can I download an age-restricted or private video?",
        answer:
          "No. Age-restricted, private, members-only and unlisted-with-restrictions videos all require a signed-in YouTube session, which this tool does not use.",
      },
      {
        question: "Does downloading affect the creator's view count?",
        answer:
          "Fetching a video this way is not counted as a view. If you want to support a creator, watch on YouTube — download for offline use only.",
      },
      {
        question: "Where does the file go on my device?",
        answer:
          "Wherever your browser saves downloads. On desktop that is usually the Downloads folder; on Android, Files → Downloads; on iPhone, the Downloads section of the Files app.",
      },
    ],
    related: ["youtube-shorts-downloader", "youtube-mp3-downloader", "online-video-downloader"],
    keywords: [
      "youtube video downloader",
      "download youtube video",
      "youtube to mp4",
      "hd video downloader",
    ],
  },
  {
    slug: "youtube-shorts-downloader",
    id: "youtube",
    name: "YouTube Shorts",
    toolName: "YouTube Shorts Downloader",
    hosts: ["youtube.com", "youtu.be"],
    color: "#FF3B3B",
    initial: "S",
    icon: "youtube",
    familyLabel: "YouTube Tools",
    parentSlug: "youtube-video-downloader",
    title: "YouTube Shorts Downloader – Download Shorts in HD",
    metaDescription:
      "Download public YouTube Shorts as vertical MP4 files. Paste a /shorts/ link and save the clip in the quality it was uploaded in.",
    h1: "YouTube Shorts Downloader",
    intro:
      "Shorts are vertical clips under three minutes, and YouTube serves them from a different URL shape than regular videos. Paste a /shorts/ link here and the vertical MP4 comes back with its 9:16 framing intact.",
    urlForms: [
      "youtube.com/shorts/… — the canonical Shorts URL",
      "youtu.be/… share links generated from a Short",
      "A regular watch?v= link that redirects to a Short",
    ],
    instructions: [
      "Open the Short and tap the Share arrow on the right-hand side.",
      "Choose Copy link — the URL will contain /shorts/.",
      "Paste it above and press Download.",
      "Save the vertical MP4 to your device.",
    ],
    features: [
      "Keeps the original 9:16 vertical framing — no cropping or letterboxing",
      "Most Shorts are small enough to transfer instantly",
      "Audio stays in sync with the clip",
      "Works from the mobile app's share sheet",
    ],
    formatsExplainer:
      "Shorts are short and lightweight, so YouTube usually keeps a single combined file for them. That means most Shorts download directly from YouTube's servers to your browser with nothing to merge — typically a 1080x1920 MP4 a few megabytes in size.",
    mobile: {
      android:
        "In the YouTube app, tap the Share arrow beside the Short, then Copy link. Paste it here and download — Chrome puts the clip in your Downloads folder.",
      ios: "Tap Share → Copy Link on the Short, paste it above, and confirm the Safari download prompt. The MP4 appears under Downloads in the Files app.",
    },
    faq: [
      {
        question: "Why is my Shorts link not recognised?",
        answer:
          "Make sure you copied the link to the Short itself and not to the creator's channel. A valid link contains /shorts/ followed by the video ID.",
      },
      {
        question: "Will the Short download with music?",
        answer:
          "Yes, when the audio is part of the uploaded video. Shorts built on a licensed audio track that YouTube attaches separately may occasionally come through without it.",
      },
      {
        question: "Can I download Shorts in 1080p?",
        answer:
          "Most Shorts are uploaded at 1080x1920 and download at that size. Some older or re-uploaded Shorts exist only at lower resolutions.",
      },
      {
        question: "Is there a length limit?",
        answer:
          "Shorts max out at three minutes by YouTube's own rules, so length is never the constraint here.",
      },
    ],
    related: ["youtube-video-downloader", "youtube-mp3-downloader", "tiktok-video-downloader"],
    keywords: ["youtube shorts downloader", "download youtube shorts", "shorts to mp4"],
  },
  {
    slug: "youtube-mp3-downloader",
    id: "youtube",
    name: "YouTube Audio",
    toolName: "YouTube MP3 Downloader",
    hosts: ["youtube.com", "youtu.be", "music.youtube.com"],
    color: "#FF3B3B",
    initial: "M",
    icon: "youtube",
    familyLabel: "YouTube Tools",
    parentSlug: "youtube-video-downloader",
    title: "YouTube to MP3 – Extract Audio from YouTube Videos",
    metaDescription:
      "Pull the audio out of a public YouTube video and save it as MP3 or in its original format. Useful for lectures, podcasts and long-form talks.",
    h1: "YouTube MP3 Downloader",
    intro:
      "Sometimes only the audio matters — a lecture, a podcast episode, an interview. Paste a YouTube link and you get two audio options: the untouched original track, or a converted 192 kbps MP3.",
    urlForms: [
      "youtube.com/watch?v=… video links",
      "youtu.be/… share links",
      "music.youtube.com track and album-track links",
    ],
    instructions: [
      "Copy the link to the video whose audio you want.",
      "Paste it above and press Download.",
      "Scroll to the Audio section of the results.",
      "Choose the original audio track for speed, or MP3 for maximum compatibility.",
    ],
    features: [
      "Original audio track downloads instantly with no re-encoding",
      "MP3 conversion at 192 kbps when you need a universally playable file",
      "Far smaller files than downloading the full video",
      "Keeps the full length of long recordings",
    ],
    formatsExplainer:
      "YouTube's own audio stream is usually AAC in an M4A container. Downloading that original is fastest and lossless relative to the source, because nothing is re-encoded. The MP3 option runs a conversion at 192 kbps — pick it only if your player genuinely cannot handle M4A, since converting from one lossy format to another always loses a little quality.",
    mobile: {
      android:
        "Copy the video link from the YouTube app's Share menu, paste it here, and choose an audio option. Most Android music players read both M4A and MP3 from the Downloads folder.",
      ios: "Paste the copied link above and pick an audio format. iOS handles M4A natively, so the original track usually works better than MP3 on an iPhone.",
    },
    faq: [
      {
        question: "Should I choose MP3 or the original audio?",
        answer:
          "Take the original unless you need MP3 specifically. It downloads faster, skips a lossy re-encode, and plays on virtually every modern device including iPhones.",
      },
      {
        question: "What bitrate is the MP3?",
        answer:
          "192 kbps, which is a reasonable balance of size and quality for speech and most music. The source audio quality still caps the result.",
      },
      {
        question: "Can I download a whole playlist or album as audio?",
        answer:
          "No — this tool handles one link at a time by design, which keeps processing predictable and fast for everyone.",
      },
      {
        question: "Is it legal to extract audio from YouTube?",
        answer:
          "It depends entirely on the content and your jurisdiction. Extracting your own uploads or content licensed for reuse is fine; copying commercial music you do not have rights to is not.",
      },
    ],
    related: ["youtube-video-downloader", "youtube-shorts-downloader", "online-video-downloader"],
    keywords: [
      "youtube mp3 downloader",
      "youtube to mp3",
      "youtube audio downloader",
      "extract audio from youtube",
    ],
  },

  // -------------------------------------------------------------- Instagram
  {
    slug: "instagram-video-downloader",
    id: "instagram",
    name: "Instagram",
    toolName: "Instagram Video Downloader",
    hosts: ["instagram.com", "ddinstagram.com"],
    color: "#E1306C",
    initial: "I",
    icon: "instagram",
    familyLabel: "Instagram Tools",
    title: "Instagram Video Downloader – Save Instagram Videos Online",
    metaDescription:
      "Download videos from public Instagram posts in their original quality. Paste the post link and the MP4 saves straight to your device.",
    h1: "Instagram Video Downloader",
    intro:
      "Instagram gives you no download button for someone else's feed video. Paste the post link here and the video comes back as a plain MP4, at the resolution Instagram encoded it in.",
    urlForms: [
      "instagram.com/p/… — standard feed posts",
      "instagram.com/tv/… — longer-form IGTV-era videos",
      "Links copied from the app's Share → Copy link menu",
    ],
    instructions: [
      "Open the post, tap the three-dot menu (or the share icon), then Copy link.",
      "Paste the link above and press Download.",
      "Save the MP4 when the result card appears.",
    ],
    features: [
      "Original quality, exactly as Instagram encoded the post",
      "No Instagram login or app permissions needed",
      "Downloads transfer directly from Instagram's CDN, so they are near-instant",
      "Handles both single-video posts and video carousels",
    ],
    formatsExplainer:
      "Instagram pre-encodes one MP4 per video and serves it as a single complete file, so there is no quality menu to choose from — and nothing to merge. The file you get is byte-for-byte what Instagram would stream to the app.",
    mobile: {
      android:
        "Tap the three dots above the post → Copy link, paste it here, and download. Chrome saves it to Downloads and your gallery picks it up shortly after.",
      ios: "Use Share → Copy Link in the Instagram app, paste it above, then confirm Safari's download prompt. Open Files → Downloads to find the video, and use the share sheet to move it to Photos.",
    },
    faq: [
      {
        question: "Can I download from a private Instagram account?",
        answer:
          "No. If a post is not visible to a logged-out visitor, it cannot be processed. That restriction is intentional.",
      },
      {
        question: "What about carousels with several videos?",
        answer:
          "A carousel link returns the videos it contains. Photos inside a carousel are not handled — this is a video tool.",
      },
      {
        question: "Why did my Instagram link stop working after a while?",
        answer:
          "Instagram's media URLs are time-limited. If you leave a result card open for a long time, fetch the link again to get a fresh one.",
      },
      {
        question: "Does the download include the caption or comments?",
        answer: "No. You get the video file only — no caption, metadata or comment text.",
      },
    ],
    related: ["instagram-reels-downloader", "threads-video-downloader", "online-video-downloader"],
    keywords: [
      "instagram video downloader",
      "download instagram video",
      "instagram post download",
      "save instagram videos",
    ],
  },
  {
    slug: "instagram-reels-downloader",
    id: "instagram",
    name: "Instagram Reels",
    toolName: "Instagram Reels Downloader",
    hosts: ["instagram.com"],
    color: "#E1306C",
    initial: "R",
    icon: "instagram",
    familyLabel: "Instagram Tools",
    parentSlug: "instagram-video-downloader",
    title: "Instagram Reels Downloader – Download Instagram Reels Online",
    metaDescription:
      "Save public Instagram Reels as vertical MP4 files in HD. Paste the Reel link and download it to your phone or computer in seconds.",
    h1: "Instagram Reels Downloader",
    intro:
      "Reels live at their own /reel/ URL and are encoded separately from feed posts. Paste a public Reel link and you get the vertical MP4 in the resolution Instagram generated — usually 1080x1920.",
    urlForms: [
      "instagram.com/reel/… — the canonical Reel URL",
      "instagram.com/reels/… — the variant the web player sometimes uses",
      "Share-sheet links from the mobile app",
    ],
    instructions: [
      "Open the Reel and tap the paper-plane share icon.",
      "Choose Copy link from the share sheet.",
      "Paste it above and press Download.",
      "Save the vertical MP4.",
    ],
    features: [
      "Preserves the full-height 9:16 frame",
      "HD output when the creator uploaded in HD",
      "We add no watermark or overlay of our own",
      "Single-file transfer, so Reels download almost instantly",
    ],
    formatsExplainer:
      "Instagram encodes each Reel once, typically as a 1080x1920 H.264 MP4 with AAC audio, and serves it as one file. That means your download is a direct copy with no re-encoding step and no quality loss.",
    mobile: {
      android:
        "Tap the share arrow on the Reel → Copy link, paste it here, and download. The MP4 lands in Downloads and shows up in Google Photos or your gallery app.",
      ios: "Copy the Reel link from the share sheet, paste it above, and accept Safari's prompt. Then open Files → Downloads and share the video into Photos if you want it in your camera roll.",
    },
    faq: [
      {
        question: "Will the Reel have a watermark?",
        answer:
          "We add nothing. If the creator exported the Reel from another app, or Instagram baked in an overlay at upload time, that is part of the source video and cannot be stripped out.",
      },
      {
        question: "Why does my downloaded Reel have no music?",
        answer:
          "Reels using a licensed track from Instagram's audio library sometimes have that audio attached at playback rather than encoded into the file. In those cases the source file itself is silent.",
      },
      {
        question: "Can I download Reels from a private account?",
        answer: "No — only Reels that a logged-out visitor can view are accessible.",
      },
      {
        question: "How is this different from the Instagram Video Downloader page?",
        answer:
          "Same engine, different URL shape. Reels use /reel/ links and are always vertical; feed videos use /p/ links and can be any aspect ratio. Either page accepts either link.",
      },
    ],
    related: ["instagram-video-downloader", "tiktok-video-downloader", "youtube-shorts-downloader"],
    keywords: [
      "instagram reels downloader",
      "download instagram reels",
      "reel to mp4",
      "reels downloader",
    ],
  },

  // --------------------------------------------------------------- Facebook
  {
    slug: "facebook-video-downloader",
    id: "facebook",
    name: "Facebook",
    toolName: "Facebook Video Downloader",
    hosts: ["facebook.com", "fb.watch", "m.facebook.com", "fb.com"],
    color: "#1877F2",
    initial: "F",
    icon: "facebook",
    familyLabel: "Facebook Tools",
    title: "Facebook Video Downloader – Download Facebook Videos Online",
    metaDescription:
      "Download videos from public Facebook posts, Pages and Groups as MP4. Paste the link, choose SD or HD, and save it to your device.",
    h1: "Facebook Video Downloader",
    intro:
      "Facebook usually stores each video twice — a smaller SD copy and a larger HD one. Paste a public video link and you get to pick which one you actually want.",
    urlForms: [
      "facebook.com/watch?v=… — the Watch player",
      "facebook.com/<page>/videos/… — Page and profile uploads",
      "fb.watch/… — short share links",
      "m.facebook.com links copied from the mobile site",
    ],
    instructions: [
      "Open the video, click the three-dot menu on the post, then Copy link.",
      "Paste the link above and press Download.",
      "Compare the SD and HD options — the file size is shown for each.",
      "Download the version you want.",
    ],
    features: [
      "Both SD and HD renditions listed when Facebook has them",
      "File sizes shown up front, so mobile data is not a gamble",
      "Works for public Pages, Groups and profile posts",
      "Supports fb.watch short links without extra steps",
    ],
    formatsExplainer:
      "Facebook delivers complete MP4 files rather than split streams, so both the SD and HD options transfer straight from Facebook's CDN to your browser with nothing to merge. HD is typically 720p or 1080p; SD is usually 360p and a fraction of the size.",
    mobile: {
      android:
        "Tap the three dots on the post → Copy link, paste it here, and pick a quality. On mobile data, SD is often the sensible choice.",
      ios: "Copy the post link from the Facebook app, paste it above, and confirm the download. The MP4 appears in Files → Downloads.",
    },
    faq: [
      {
        question: "Can I download a video from a private Group?",
        answer:
          "No. If the video needs a logged-in account with Group membership to view, it cannot be fetched here.",
      },
      {
        question: "Should I pick SD or HD?",
        answer:
          "HD if you plan to watch on a big screen or keep it long-term. SD if you are on mobile data or just want a quick copy — it is often five to ten times smaller.",
      },
      {
        question: "Why does my fb.watch link fail?",
        answer:
          "fb.watch links expire and sometimes point at content that has since been made private or removed. Open the link in a browser first to check it still plays while logged out.",
      },
      {
        question: "Does this work for Facebook Live replays?",
        answer:
          "Usually yes, once the live broadcast has ended and Facebook has published the recording as a normal video post.",
      },
    ],
    related: ["facebook-reels-downloader", "instagram-video-downloader", "online-video-downloader"],
    keywords: [
      "facebook video downloader",
      "download facebook video",
      "fb video download",
      "facebook mp4 downloader",
    ],
  },
  {
    slug: "facebook-reels-downloader",
    id: "facebook",
    name: "Facebook Reels",
    toolName: "Facebook Reels Downloader",
    hosts: ["facebook.com", "fb.watch"],
    color: "#1877F2",
    initial: "R",
    icon: "facebook",
    familyLabel: "Facebook Tools",
    parentSlug: "facebook-video-downloader",
    title: "Facebook Reels Downloader – Save Facebook Reels as MP4",
    metaDescription:
      "Download public Facebook Reels as vertical MP4 files. Paste the Reel link and save the clip to your phone or computer.",
    h1: "Facebook Reels Downloader",
    intro:
      "Facebook Reels sit at their own /reel/ URL and are encoded as vertical video. Paste a public Reel link here to save it as an MP4 with its 9:16 framing untouched.",
    urlForms: [
      "facebook.com/reel/… — the canonical Reel URL",
      "fb.watch/… short links that resolve to a Reel",
      "Reel links copied from the Facebook mobile app",
    ],
    instructions: [
      "Open the Reel and tap the share icon beneath it.",
      "Choose Copy link.",
      "Paste the link above and press Download.",
      "Save the vertical MP4.",
    ],
    features: [
      "Keeps the vertical 9:16 aspect ratio",
      "Single-file transfer, so downloads finish quickly",
      "Works with both facebook.com/reel and fb.watch links",
      "No Facebook account required",
    ],
    formatsExplainer:
      "Reels are encoded once as a complete vertical MP4, so there is normally a single quality on offer rather than the SD/HD pair you see on regular Facebook video posts.",
    mobile: {
      android:
        "Tap the share arrow on the Reel → Copy link, paste it above, and download. The clip goes to your Downloads folder.",
      ios: "Copy the Reel link from the share sheet, paste it here, and confirm the download in Safari. Find it under Downloads in the Files app.",
    },
    faq: [
      {
        question: "Why does my Reel link open a different video?",
        answer:
          "Facebook's share sheet sometimes copies a link to the surrounding feed rather than the Reel itself. Open the Reel full-screen first, then copy the link.",
      },
      {
        question: "Can I download Reels posted by a private profile?",
        answer: "No. Only Reels visible without logging in can be processed.",
      },
      {
        question: "Is there an HD option for Reels?",
        answer:
          "Facebook usually publishes one rendition per Reel, so there is typically nothing to choose between. When a second quality exists, it is listed.",
      },
    ],
    related: ["facebook-video-downloader", "instagram-reels-downloader", "tiktok-video-downloader"],
    keywords: ["facebook reels downloader", "download facebook reels", "fb reels download"],
  },

  // ----------------------------------------------------------------- TikTok
  {
    slug: "tiktok-video-downloader",
    id: "tiktok",
    name: "TikTok",
    toolName: "TikTok Video Downloader",
    hosts: ["tiktok.com", "vm.tiktok.com", "vt.tiktok.com"],
    color: "#25F4EE",
    initial: "T",
    icon: "tiktok",
    familyLabel: "TikTok Tools",
    title: "TikTok Video Downloader – Download TikTok Videos",
    metaDescription:
      "Download public TikTok videos as MP4 in HD. Works with full tiktok.com links and vm.tiktok.com short links from the app's share sheet.",
    h1: "TikTok Video Downloader",
    intro:
      "TikTok's own save button is often disabled by the creator, and when it works it burns a watermark into the frame. Paste a public link here to get the MP4 that TikTok's servers actually hold.",
    urlForms: [
      "tiktok.com/@user/video/… — the full canonical link",
      "vm.tiktok.com/… — short links from the app share sheet",
      "vt.tiktok.com/… — the regional short-link variant",
    ],
    instructions: [
      "Tap Share on the TikTok video, then Copy link.",
      "Paste the link above and press Download.",
      "Save the MP4 from the result card.",
    ],
    features: [
      "Short vm.tiktok.com and vt.tiktok.com links resolved automatically",
      "Downloads pull straight from TikTok's CDN — usually a couple of seconds",
      "Vertical framing and audio preserved as uploaded",
      "No app, no account, no login",
    ],
    formatsExplainer:
      "TikTok serves one primary MP4 per video, already combining picture and sound, so there is a single quality on offer and nothing to merge. Files are usually a few megabytes at 1080x1920.",
    mobile: {
      android:
        "Tap Share → Copy link in the TikTok app, switch to your browser, paste, and download. Chrome saves the MP4 to Downloads.",
      ios: "Copy the link from TikTok's share sheet, paste it here in Safari, and confirm the download prompt. The file appears under Downloads in Files.",
    },
    faq: [
      {
        question: "Does this remove the TikTok watermark?",
        answer:
          "We hand you the file TikTok's servers provide, without adding anything. Whether a watermark is baked into that file depends on how the creator uploaded it — we cannot promise a clean frame on every video, and no honest tool can.",
      },
      {
        question: "Why did my short link fail?",
        answer:
          "vm.tiktok.com links expire relatively quickly. Copy a fresh link from the app, or open the short link first and copy the full tiktok.com URL it lands on.",
      },
      {
        question: "Can I download a TikTok from a private account?",
        answer: "No. Only videos from public accounts can be fetched.",
      },
      {
        question: "Can I download just the sound?",
        answer:
          "The result card includes an audio option when TikTok exposes the track separately. Otherwise you can extract audio from the downloaded MP4 with any media player.",
      },
    ],
    related: ["instagram-reels-downloader", "youtube-shorts-downloader", "online-video-downloader"],
    keywords: [
      "tiktok video downloader",
      "tiktok downloader",
      "tiktok mp4 downloader",
      "download tiktok video",
    ],
  },

  // -------------------------------------------------------------- Pinterest
  {
    slug: "pinterest-video-downloader",
    id: "pinterest",
    name: "Pinterest",
    toolName: "Pinterest Video Downloader",
    hosts: ["pinterest.com", "pin.it", "pinterest.co.uk", "in.pinterest.com"],
    color: "#E60023",
    initial: "P",
    icon: "pinterest",
    familyLabel: "Pinterest Tools",
    title: "Pinterest Video Downloader – Download Pinterest Videos",
    metaDescription:
      "Save video Pins from Pinterest as MP4. Paste a Pin link or a pin.it short link and download the clip to your device.",
    h1: "Pinterest Video Downloader",
    intro:
      "A growing share of Pins are short videos — recipes, tutorials, walkthroughs — and Pinterest offers no way to keep one offline. Paste a Pin link here and the video saves as an MP4.",
    urlForms: [
      "pinterest.com/pin/… — standard Pin links",
      "pin.it/… — short links from the app's share menu",
      "Regional domains such as in.pinterest.com and pinterest.co.uk",
    ],
    instructions: [
      "Open the video Pin and tap the share icon.",
      "Choose Copy link.",
      "Paste it above and press Download.",
      "Save the MP4.",
    ],
    features: [
      "pin.it short links resolved automatically",
      "Regional Pinterest domains supported",
      "Direct CDN transfer — no waiting on server processing",
      "No Pinterest account needed",
    ],
    formatsExplainer:
      "Pinterest stores one video rendition per Pin as a complete MP4. Idea Pins with several segments may expose more than one clip; each is listed separately when that happens.",
    mobile: {
      android:
        "Tap the share icon on the Pin → Copy link, paste it here, and download. The MP4 goes to your Downloads folder.",
      ios: "Copy the Pin link from the share sheet, paste it above, and confirm the Safari prompt. Find the file in Files → Downloads.",
    },
    faq: [
      {
        question: "Why does my Pin say unsupported?",
        answer:
          "The most common reason is that the Pin is a still image rather than a video. This tool handles video Pins only.",
      },
      {
        question: "Do pin.it short links work?",
        answer: "Yes — they are followed to the underlying Pin automatically.",
      },
      {
        question: "Can I download an entire board?",
        answer:
          "No. One Pin per request, which keeps processing fast and predictable for everyone using the service.",
      },
    ],
    related: ["instagram-reels-downloader", "tiktok-video-downloader", "online-video-downloader"],
    keywords: [
      "pinterest video downloader",
      "pinterest downloader",
      "download pinterest video",
      "pin video download",
    ],
  },

  // -------------------------------------------------------------- X (Twitter)
  {
    slug: "twitter-video-downloader",
    id: "twitter",
    name: "Twitter",
    toolName: "Twitter Video Downloader",
    // x.com is claimed by the X page below so the detected badge matches the
    // domain the visitor actually pasted; both pages accept either link.
    hosts: ["twitter.com", "mobile.twitter.com", "t.co"],
    color: "#1D9BF0",
    initial: "T",
    icon: "twitter",
    familyLabel: "Twitter / X Tools",
    title: "Twitter Video Downloader – Download Twitter Videos in MP4",
    metaDescription:
      "Download videos and GIFs from public tweets as MP4. Paste a twitter.com or x.com post link and save the clip in the best available bitrate.",
    h1: "Twitter Video Downloader",
    intro:
      "Twitter encodes each video clip at several bitrates and picks one for you based on your connection. Paste a public post link here and you get to take the highest one instead.",
    urlForms: [
      "twitter.com/<user>/status/… — classic post links",
      "x.com/<user>/status/… — the current domain, handled identically",
      "mobile.twitter.com links",
      "t.co short links from the share sheet",
    ],
    instructions: [
      "Open the post, tap the share icon, then Copy link.",
      "Paste the link above and press Download.",
      "Save the MP4 from the result card.",
    ],
    features: [
      "Picks the highest bitrate rendition rather than a connection-based guess",
      "Animated GIFs come through as MP4, which is how Twitter actually stores them",
      "Handles posts containing more than one video",
      "twitter.com and x.com links both work",
    ],
    formatsExplainer:
      "Twitter publishes several complete MP4 renditions per clip at different bitrates — typically 320p, 480p and 720p. Each is a full file, so downloads transfer directly with no merging step.",
    mobile: {
      android:
        "Tap the share icon under the post → Copy link, paste it here, and download. The MP4 lands in Downloads.",
      ios: "Copy the post link from the share sheet, paste it above, and confirm the download in Safari. Look in Files → Downloads.",
    },
    faq: [
      {
        question: "Does this work with x.com links as well as twitter.com?",
        answer:
          "Yes. Both domains point at the same platform, and both are accepted on this page and on the X Video Downloader page.",
      },
      {
        question: "Can I download a video from a protected account?",
        answer: "No. Protected accounts require an approved follower session, which this tool does not have.",
      },
      {
        question: "What happens with a post containing multiple videos?",
        answer: "Each video in the post is listed separately so you can pick the one you want.",
      },
      {
        question: "Why is the quality lower than what I saw in the app?",
        answer:
          "The app can adapt upward as you watch. If a post's highest published rendition is 720p, that is the ceiling — the original upload quality is not recoverable.",
      },
    ],
    related: ["x-video-downloader", "reddit-video-downloader", "online-video-downloader"],
    keywords: [
      "twitter video downloader",
      "download twitter video",
      "tweet video download",
      "twitter mp4 downloader",
    ],
  },
  {
    slug: "x-video-downloader",
    id: "twitter",
    name: "X",
    toolName: "X Video Downloader",
    hosts: ["x.com"],
    color: "#000000",
    initial: "X",
    icon: "x",
    familyLabel: "Twitter / X Tools",
    parentSlug: "twitter-video-downloader",
    title: "X Video Downloader – Save Videos from X Posts",
    metaDescription:
      "Download videos from public X posts as MP4. Paste an x.com link and save the clip at the highest bitrate X publishes.",
    h1: "X Video Downloader",
    intro:
      "This page exists because the platform renamed itself and the URLs changed with it. Paste an x.com post link and the attached video downloads as an MP4 — the same engine as our Twitter page, reached by the URL you actually have.",
    urlForms: [
      "x.com/<user>/status/… — current post links",
      "twitter.com/<user>/status/… — legacy links, still valid",
      "t.co short links",
    ],
    instructions: [
      "Open the post on X and tap the share icon.",
      "Choose Copy link.",
      "Paste it above and press Download.",
      "Save the MP4.",
    ],
    features: [
      "Built for the x.com URL shape",
      "Highest published bitrate selected automatically",
      "Multi-video posts handled item by item",
      "No X account or subscription required",
    ],
    formatsExplainer:
      "X stores each clip as several complete MP4 renditions at different bitrates. We list them so you can trade file size against quality yourself.",
    mobile: {
      android:
        "Share → Copy link on the post, paste it here, and download. Chrome saves the MP4 to Downloads.",
      ios: "Copy the link from X's share sheet, paste it above, and confirm the Safari download. The file appears in Files → Downloads.",
    },
    faq: [
      {
        question: "Is this different from the Twitter Video Downloader?",
        answer:
          "Functionally no — x.com and twitter.com are one platform, and both pages accept both link formats. Two pages exist so whichever URL you copied leads somewhere sensible.",
      },
      {
        question: "Can I download videos from X Premium subscriber-only posts?",
        answer: "No. Anything gated behind a subscription or a protected account is out of reach.",
      },
      {
        question: "Do X's longer-form videos work?",
        answer:
          "Yes, as long as the post is public. Longer uploads simply mean a larger file and a slightly longer transfer.",
      },
    ],
    related: ["twitter-video-downloader", "reddit-video-downloader", "online-video-downloader"],
    keywords: ["x video downloader", "download x video", "x.com video download"],
  },

  // ----------------------------------------------------------------- Reddit
  {
    slug: "reddit-video-downloader",
    id: "reddit",
    name: "Reddit",
    toolName: "Reddit Video Downloader",
    hosts: ["reddit.com", "v.redd.it", "old.reddit.com", "redd.it"],
    color: "#FF4500",
    initial: "R",
    icon: "reddit",
    familyLabel: "Other Tools",
    title: "Reddit Video Downloader – Download Reddit Videos with Audio",
    metaDescription:
      "Download Reddit videos with the sound included. Reddit stores audio separately, so we merge both tracks into one playable MP4.",
    h1: "Reddit Video Downloader",
    intro:
      "Reddit is the awkward one: it stores video and audio as two separate files, which is why so many saved Reddit clips end up silent. Paste a post link and we merge both tracks into a single MP4 before handing it over.",
    urlForms: [
      "reddit.com/r/<sub>/comments/… — standard post links",
      "v.redd.it/… — direct video links",
      "old.reddit.com links",
      "redd.it short links",
    ],
    instructions: [
      "Open the Reddit post and click Share, then Copy link.",
      "Paste the link above and press Download.",
      "Wait while the video and audio tracks are merged.",
      "Save the finished MP4 with sound.",
    ],
    features: [
      "Merges Reddit's separate video and audio streams automatically",
      "Multiple resolutions listed when the post has them",
      "Works with old.reddit.com and crossposted links",
      "No Reddit account required",
    ],
    formatsExplainer:
      "Because Reddit splits audio from video, these downloads are muxed on our servers into an MP4 with H.264 video and AAC audio. That takes a few seconds longer than a direct transfer, and it is the reason the file actually has sound.",
    mobile: {
      android:
        "Tap Share on the post → Copy link, paste it above, and download once the merge finishes. The MP4 goes to your Downloads folder.",
      ios: "Copy the post link, paste it here, and wait for merging to complete before the download prompt appears. Find the file under Downloads in the Files app.",
    },
    faq: [
      {
        question: "Why do Reddit videos saved elsewhere have no sound?",
        answer:
          "Most tools grab only the video stream, because that is the URL Reddit exposes most obviously. The audio lives at a separate address and has to be fetched and merged deliberately.",
      },
      {
        question: "Why does this take longer than other platforms?",
        answer:
          "It is the only common platform here that requires a real merge. Two files have to be downloaded and combined before you get anything.",
      },
      {
        question: "Do crossposts work?",
        answer: "Yes, as long as the link resolves to a public post that contains a video.",
      },
      {
        question: "Some Reddit videos still come through silent — why?",
        answer:
          "A number of Reddit uploads genuinely have no audio track at all. When there is nothing to merge, the result is silent by definition.",
      },
    ],
    related: ["twitter-video-downloader", "online-video-downloader", "vimeo-video-downloader"],
    keywords: [
      "reddit video downloader",
      "download reddit video",
      "reddit video with audio",
      "v.redd.it downloader",
    ],
  },

  // -------------------------------------------------------------- Snapchat
  {
    slug: "snapchat-video-downloader",
    id: "snapchat",
    name: "Snapchat",
    toolName: "Snapchat Video Downloader",
    hosts: ["snapchat.com", "t.snapchat.com"],
    color: "#FFFC00",
    initial: "S",
    icon: "snapchat",
    familyLabel: "Other Tools",
    title: "Snapchat Video Downloader – Save Public Spotlight Videos",
    metaDescription:
      "Download public Snapchat Spotlight videos as MP4. Paste a Spotlight or public profile link and save the clip to your device.",
    h1: "Snapchat Video Downloader",
    intro:
      "Snapchat is built around content that disappears, so most of it is genuinely out of reach. What this page handles is the part Snapchat publishes openly on the web: Spotlight clips and public profile videos.",
    urlForms: [
      "snapchat.com/spotlight/… — public Spotlight clips",
      "snapchat.com/add/<user> profile videos that are publicly listed",
      "t.snapchat.com/… short links pointing at public content",
    ],
    instructions: [
      "Open the Spotlight clip on the web or tap Share in the app.",
      "Copy the link — it should contain snapchat.com.",
      "Paste it above and press Download.",
      "Save the MP4.",
    ],
    features: [
      "Handles public Spotlight and public profile videos",
      "Vertical framing preserved",
      "Single-file transfer where Snapchat serves one",
      "No Snapchat login required",
    ],
    formatsExplainer:
      "Spotlight clips are published as complete vertical MP4s, so they download directly with no merging. Snaps, Stories and anything sent privately are not published on the web and cannot be retrieved by any tool.",
    mobile: {
      android:
        "Use Share → Copy link on a Spotlight clip, paste it here, and download. The MP4 saves to Downloads.",
      ios: "Copy the Spotlight link from the share sheet, paste it above, and confirm the Safari prompt. Look under Downloads in Files.",
    },
    faq: [
      {
        question: "Can I download someone's Snap or Story?",
        answer:
          "No, and be sceptical of anything that claims otherwise. Snaps and Stories are not published on the open web — they are delivered to specific recipients and expire.",
      },
      {
        question: "What exactly does work here?",
        answer:
          "Public Spotlight videos and videos on public profiles — the content Snapchat deliberately makes viewable without an account.",
      },
      {
        question: "Will the sender know I downloaded something?",
        answer:
          "This tool never touches private content, so there is nothing to notify anyone about. Snapchat's own screenshot notifications apply only inside the app.",
      },
    ],
    related: ["tiktok-video-downloader", "instagram-reels-downloader", "online-video-downloader"],
    keywords: ["snapchat video downloader", "download snapchat video", "snapchat spotlight download"],
  },

  // --------------------------------------------------------------- Threads
  {
    slug: "threads-video-downloader",
    id: "threads",
    name: "Threads",
    toolName: "Threads Video Downloader",
    hosts: ["threads.net", "threads.com"],
    color: "#101010",
    initial: "T",
    icon: "threads",
    familyLabel: "Other Tools",
    title: "Threads Video Downloader – Save Videos from Threads Posts",
    metaDescription:
      "Download videos attached to public Threads posts as MP4. Paste the post link and save the clip to your phone or computer.",
    h1: "Threads Video Downloader",
    intro:
      "Threads runs on Meta's infrastructure and encodes video much like Instagram does. Paste a public Threads post link and any video attached to it downloads as a plain MP4.",
    urlForms: [
      "threads.net/@<user>/post/… — standard post links",
      "threads.com/@<user>/post/… — the newer domain",
      "Links copied from the Threads app share sheet",
    ],
    instructions: [
      "Open the Threads post and tap the share icon.",
      "Choose Copy link.",
      "Paste it above and press Download.",
      "Save the MP4.",
    ],
    features: [
      "Both threads.net and threads.com links accepted",
      "Original encoding preserved, no re-compression",
      "Direct CDN transfer, so downloads are quick",
      "No Threads or Instagram login required",
    ],
    formatsExplainer:
      "Threads videos are served as single complete MP4 files from Meta's CDN, the same way Instagram serves feed video. There is normally one quality per post and nothing to merge.",
    mobile: {
      android:
        "Tap the share icon on the post → Copy link, paste it here, and download. The file lands in your Downloads folder.",
      ios: "Copy the post link from the share sheet, paste it above, and confirm the download. Find it under Downloads in the Files app.",
    },
    faq: [
      {
        question: "Do posts from private Threads accounts work?",
        answer: "No. Only posts visible to someone who is not logged in can be processed.",
      },
      {
        question: "Why does my Threads link not resolve?",
        answer:
          "Threads has moved between threads.net and threads.com. Both are accepted, but a link copied mid-migration can point at a redirect — open it in a browser and copy the URL you land on.",
      },
      {
        question: "Can I download the images in a post?",
        answer: "No, this is a video tool. Posts with only photos return nothing to download.",
      },
    ],
    related: ["instagram-video-downloader", "twitter-video-downloader", "online-video-downloader"],
    keywords: ["threads video downloader", "download threads video", "threads.net video download"],
  },

  // ----------------------------------------------------------------- Vimeo
  {
    slug: "vimeo-video-downloader",
    id: "vimeo",
    name: "Vimeo",
    toolName: "Vimeo Video Downloader",
    hosts: ["vimeo.com", "player.vimeo.com"],
    color: "#1AB7EA",
    initial: "V",
    icon: "vimeo",
    familyLabel: "Other Tools",
    title: "Vimeo Video Downloader – Download Public Vimeo Videos",
    metaDescription:
      "Download public Vimeo videos as MP4, in the resolutions the uploader published. Paste the link and choose a quality.",
    h1: "Vimeo Video Downloader",
    intro:
      "Vimeo gives uploaders unusually fine control over who can download what, so what is available varies more here than on other platforms. Paste a public Vimeo link and the page lists exactly what that video offers.",
    urlForms: [
      "vimeo.com/<id> — standard video links",
      "player.vimeo.com/video/<id> — embedded player links",
      "vimeo.com/<user>/<name> — vanity URLs",
    ],
    instructions: [
      "Copy the Vimeo URL from your browser's address bar.",
      "Paste it above and press Download.",
      "Review the resolutions the uploader made available.",
      "Pick one and save the MP4.",
    ],
    features: [
      "Lists the real resolutions for that specific video, up to 4K on some uploads",
      "Works with embedded player.vimeo.com URLs",
      "Higher bitrates than most social platforms, since Vimeo compresses less",
      "No Vimeo account required",
    ],
    formatsExplainer:
      "Vimeo tends to publish several complete MP4 renditions per video, so most downloads transfer directly. Vimeo also compresses less aggressively than social platforms — expect noticeably larger files at the same resolution.",
    mobile: {
      android:
        "Copy the Vimeo link from your browser or the app's share menu, paste it here, and pick a resolution. Note that Vimeo files are large — prefer Wi-Fi.",
      ios: "Paste the copied Vimeo link above and choose a quality. Because these files are big, watch for Safari's confirmation prompt before the download starts.",
    },
    faq: [
      {
        question: "Why can't I download some Vimeo videos?",
        answer:
          "Vimeo lets uploaders password-protect videos, restrict them to specific domains, or disable downloads entirely. Any of those blocks extraction, and that is the uploader's decision to make.",
      },
      {
        question: "Why are Vimeo files so much larger than YouTube's?",
        answer:
          "Vimeo compresses less aggressively at the same resolution. A 1080p Vimeo file can easily be several times the size of a 1080p YouTube file — and visibly cleaner.",
      },
      {
        question: "Do private or password-protected videos work?",
        answer: "No. If a video needs a password or login to view, it cannot be fetched here.",
      },
    ],
    related: ["youtube-video-downloader", "reddit-video-downloader", "online-video-downloader"],
    keywords: ["vimeo downloader", "download vimeo video", "vimeo to mp4"],
  },

  // ------------------------------------------------------------------- Hub
  {
    slug: "online-video-downloader",
    id: "general",
    name: "Online",
    toolName: "Online Video Downloader",
    hosts: [],
    color: "#7C5CFF",
    initial: "O",
    familyLabel: "All Downloaders",
    isHub: true,
    title: "Online Video Downloader – One Tool for Every Platform",
    metaDescription:
      "One downloader for YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit and more. Paste any public video link and save it as MP4.",
    h1: "Online Video Downloader",
    intro:
      "One box, any supported platform. Paste a public video link from YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit, Threads, Snapchat Spotlight or Vimeo, and the page works out where it came from and what qualities exist.",
    urlForms: [
      "Any public video URL from a supported platform",
      "Short share links (youtu.be, fb.watch, vm.tiktok.com, pin.it, redd.it)",
      "Mobile app share-sheet links",
    ],
    instructions: [
      "Copy a public video link from any supported platform.",
      "Paste it into the box above and press Download.",
      "Check the detected platform badge and the qualities listed.",
      "Pick a format and save it.",
    ],
    features: [
      "One interface instead of a different site per platform",
      "Detects the source platform from the URL as you type",
      "Shows the real formats for that specific video, not a generic promise",
      "Most downloads stream straight from the source CDN to your browser",
    ],
    formatsExplainer:
      "Output is MP4 with H.264 video and AAC audio wherever possible, since that combination plays on essentially every device made in the last decade. Audio-only downloads come as the original track (usually M4A) or as a converted 192 kbps MP3.",
    mobile: {
      android:
        "Every platform's Android app has a Share → Copy link option. Copy, switch to Chrome, paste here, and download — files land in your Downloads folder.",
      ios: "Copy the link from the app's share sheet, open this page in Safari, paste, and download. Confirm Safari's prompt, then find the file under Downloads in the Files app.",
    },
    faq: [
      {
        question: "Which platforms are supported?",
        answer:
          "YouTube (including Shorts), Instagram and Reels, TikTok, Facebook and Facebook Reels, X/Twitter, Pinterest, Reddit, Threads, public Snapchat Spotlight, and Vimeo. Each has a dedicated page with platform-specific detail.",
      },
      {
        question: "Do I need to pick the right page for my link?",
        answer:
          "No. Every page runs the same engine and accepts any supported link. The dedicated pages simply explain the quirks of one platform in more depth.",
      },
      {
        question: "Is there a file size or length limit?",
        answer:
          "There is a size cap on downloads that need server-side processing, which keeps the service responsive for everyone. Direct transfers from the source CDN are not affected by it.",
      },
      {
        question: "Do you store the videos I download?",
        answer:
          "No. Files that need server-side merging are written to temporary storage, deleted as soon as you collect them, and swept away automatically if you do not. Direct downloads never touch our servers at all.",
      },
      {
        question: "Is it free?",
        answer: "Yes — no account, no payment, no download quota.",
      },
    ],
    related: [
      "youtube-video-downloader",
      "instagram-reels-downloader",
      "tiktok-video-downloader",
      "facebook-video-downloader",
    ],
    keywords: [
      "online video downloader",
      "free video downloader",
      "social media video downloader",
      "hd video downloader",
      "mp4 downloader",
    ],
  },
];

export function getPlatformBySlug(slug: string): PlatformConfig | undefined {
  return platforms.find((p) => p.slug === slug);
}

/** Pages grouped by source platform, in declaration order. */
export function platformFamilies(): PlatformConfig[][] {
  const groups = new Map<string, PlatformConfig[]>();
  for (const p of platforms) {
    const group = groups.get(p.id) ?? [];
    group.push(p);
    groups.set(p.id, group);
  }
  return [...groups.values()];
}

/** One representative page per source platform, for grids and nav. */
export function primaryPlatforms(): PlatformConfig[] {
  return platforms.filter((p) => !p.parentSlug && !p.isHub);
}

export interface DetectedPlatform {
  id: string;
  name: string;
  color: string;
  initial: string;
  icon?: string;
  supported: true;
}

export function detectPlatform(url: string): DetectedPlatform | { supported: false } {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return { supported: false };
  }

  for (const p of platforms) {
    if (p.hosts.some((h) => hostname === h || hostname.endsWith(`.${h}`))) {
      return {
        id: p.id,
        name: p.name,
        color: p.color,
        initial: p.initial,
        icon: p.icon,
        supported: true,
      };
    }
  }
  return { supported: false };
}
