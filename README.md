# SnapFetch

A universal public video downloader website. Paste a link from YouTube, Instagram, TikTok, Facebook,
X/Twitter, Pinterest, Reddit, or Vimeo and download it in the best available quality — or extract
just the audio as MP3.

## Architecture

There are two download paths, and which one a format takes decides whether it costs you bandwidth.

```
                POST /api/extract  →  yt-dlp -j  →  formats list
                                          │
        ┌─────────────────────────────────┴────────────────────────────────┐
        │                                                                   │
  PATH A — direct (default)                                     PATH B — server pipeline
  Format is one complete file on                                Format is split video + audio,
  the source CDN (progressive MP4,                              or needs MP3 conversion.
  original audio track).
        │                                                                   │
  /api/extract returns a signed URL                             POST /api/download/start → job_id
        │                                                       GET  /api/download/progress/[jobId] (SSE)
  Browser fetches it via the Cloudflare                         GET  /api/download/file/[jobId]
  Worker (worker/cdn-proxy.js), or via                                     │
  /api/download/stream if no Worker is set                      yt-dlp downloads + ffmpeg muxes to
        │                                                       temp disk, streams once, deletes.
  Host bandwidth: ~2 KB (the JSON only)                         Host bandwidth: 1× in + 1× out
```

**Why this matters.** The old design routed every byte through the app server twice — once pulling
from the source, once pushing to the visitor. Path A eliminates both for the formats that don't need
processing, which on most platforms is all of them. Path B still exists because separate video/audio
streams genuinely have to be merged somewhere.

Every direct URL is HMAC-signed with `DOWNLOAD_SIGNING_SECRET` and expires after `DIRECT_LINK_TTL`,
so neither the Worker nor `/api/download/stream` can be used as an open proxy.

### Deploying the edge proxy

Without `CDN_PROXY_URL`, direct downloads fall back to `/api/download/stream`. That still skips disk
and yt-dlp entirely, but the bytes pass through your host. To get host bandwidth to near zero:

```bash
cd worker
wrangler deploy
wrangler secret put DOWNLOAD_SIGNING_SECRET   # same value as the app's
```

Then set `CDN_PROXY_URL` in the app to the deployed Worker URL. Cloudflare does not bill egress, and
a streaming pass-through is I/O rather than CPU, so a download costs one request instead of its
megabytes.

All extraction logic lives behind `src/lib/extractor/` (`ytdlp.ts`, `sign.ts`, `ssrf-guard.ts`,
`rate-limit.ts`, `jobs.ts`). Swapping yt-dlp for another extraction provider only means rewriting
`ytdlp.ts` — nothing else needs to change.

Platform content (SEO pages, FAQs, features) lives in one file: `src/lib/platforms.ts`. Add a new
platform by adding an entry there — the `/[slug]` route picks it up automatically, as does the
homepage grid, footer, and sitemap.

## Requirements

- **Node.js** 20.19+ or 22.13+ (this repo was built against Node 20.17 with an engine warning — for
  a completely clean install, upgrade Node)
- **Python** 3.9+ (only needed to install yt-dlp)
- **yt-dlp** on your `PATH` (or set `YTDLP_PATH` to an absolute path)
- **FFmpeg** on your `PATH` — required to merge separate video/audio streams and to extract MP3 audio

### Installing FFmpeg

- **Windows**: `winget install --id Gyan.FFmpeg -e`
- **macOS**: `brew install ffmpeg`
- **Debian/Ubuntu**: `sudo apt install ffmpeg`

### Installing yt-dlp

```bash
pip install -U yt-dlp
```

Verify both are on `PATH`:

```bash
ffmpeg -version
yt-dlp --version
```

## Environment variables

Copy `.env.example` to `.env.local` (Next.js loads `.env.local` automatically) and adjust as needed:

| Variable                     | Default                 | Purpose                                                              |
| ---------------------------- | ----------------------- | -------------------------------------------------------------------- |
| `BRAND_NAME`                 | `SnapFetch`             | Site name used throughout the UI and metadata                        |
| `SITE_URL`                   | `http://localhost:3000` | Canonical URL — set to your real domain in prod                      |
| `CONTACT_EMAIL`              | `support@example.com`   | Shown on the Contact page                                            |
| `CDN_PROXY_URL`              | _(empty)_               | Cloudflare Worker URL. Empty = fall back to `/api/download/stream`   |
| `DOWNLOAD_SIGNING_SECRET`    | _(ephemeral)_           | HMAC key for direct links. **Set this in production**                 |
| `DIRECT_LINK_TTL`            | `900` (seconds)         | How long a minted direct download link stays valid                   |
| `MAX_FILE_SIZE_MB`           | `500`                   | Cap for server-processed downloads (also enforced on direct streams) |
| `MAX_CONCURRENT_JOBS`        | `3`                     | Server-wide concurrent yt-dlp job cap                                |
| `MAX_CONCURRENT_JOBS_PER_IP` | `1`                     | Concurrent jobs one visitor may hold                                 |
| `DOWNLOAD_TIMEOUT_SECONDS`   | `600`                   | Kill yt-dlp if it hangs longer than this                             |
| `MAX_REQUESTS_PER_IP`        | `20`                    | API requests per minute per IP                                       |
| `TEMP_FILE_TTL`              | `600` (seconds)         | Auto-delete a finished download if never fetched                     |
| `CLEANUP_INTERVAL`           | `1800` (seconds)        | How often the orphaned-file sweeper runs                             |
| `TEMP_DOWNLOAD_DIR`          | `tmp-downloads`         | Where in-progress/finished downloads are written                     |
| `YTDLP_PATH`                 | `yt-dlp`                | Path to the yt-dlp binary                                            |

The older names `MAX_DOWNLOAD_SIZE`, `MAX_CONCURRENT_DOWNLOADS`, `RATE_LIMIT` and
`PROCESS_TIMEOUT_MS` are still honoured as fallbacks.

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

## Docker

```bash
cp .env.example .env
docker compose up -d --build
```

This bakes FFmpeg and yt-dlp into the image, builds the Next.js app, and runs it on port 3000.

## Scaling notes

- The rate limiter and job store (`src/lib/extractor/rate-limit.ts`, `jobs.ts`) are in-memory —
  correct for a single Node instance. Running multiple instances behind a load balancer needs a
  shared store (Redis) instead, since a "download started on instance A" job won't be visible to
  instance B.
- Temporary files are written to `TEMP_DOWNLOAD_DIR` on local disk. In a multi-instance deployment,
  either use sticky sessions (so a job's progress/file requests hit the same instance that started
  it) or move file storage to shared/object storage.

## Advertising slots (Adsterra)

`src/components/AdSlot.tsx` renders fixed-height containers — `AdSlotTop`,
`AdSlotAfterDownloader`, `AdSlotMiddle`, `AdSlotBottom`, `AdSlotSidebar`. Each stays a blank
reserved box, loading no third-party script, until you give it a key.

**You do not edit any component to turn ads on.** In Adsterra, create a Banner unit per placement,
copy the `key` value out of its invocation snippet (32 hex chars), and put it in your `.env`:

```
NEXT_PUBLIC_ADSTERRA_TOP=abc123…
NEXT_PUBLIC_ADSTERRA_AFTER_DOWNLOADER=
NEXT_PUBLIC_ADSTERRA_MIDDLE=
NEXT_PUBLIC_ADSTERRA_BOTTOM=
NEXT_PUBLIC_ADSTERRA_SIDEBAR=
```

Leave any of them empty and that slot simply stays blank. `NEXT_PUBLIC_` is required — these are
read in the browser, and they are publisher ids rather than secrets (every Adsterra site exposes
them in page source). Rebuild after changing them; Next inlines `NEXT_PUBLIC_` values at build time.

The sizes in `SPECS` must match the ad unit you created in Adsterra, or the reserved box and the
delivered banner will not line up. The reserved box is what keeps CLS at zero.

Non-banner formats (Social Bar, Popunder, Direct Link) are page-level, not in-flow — Adsterra gives
you a plain `<script src>` for those. Add them once in `src/app/layout.tsx` with `next/script`, not
in `AdSlot`.

No slot sits between the URL input and its results, so ads never cover the download buttons on
mobile.

## Branding and icons

- **Site name** comes from `BRAND_NAME` (default `OnlineMP4`) and flows through titles, schema,
  manifest and footer via `src/lib/brand.ts`.
- **Logo** is `src/components/icons/BrandLogo.tsx` — inline SVG, so it stays sharp at any size and
  costs no request. The favicon, apple-touch icon and OG image redraw the same mark with
  `next/og` (`icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`). To swap in a bitmap instead, drop
  it in `public/` and replace the `BrandLogo` usages in `Header.tsx` and `Footer.tsx`.
- **Platform logos** are the official brand marks, generated from the `simple-icons` package into
  `src/components/icons/PlatformIcons.tsx`. Nothing extra ships at runtime — the file is plain data
  in the repo. Regenerate after bumping the package:

  ```bash
  npm run icons:generate
  ```

  Map a platform to a mark with the `icon` field in `src/lib/platforms.ts`. `PlatformBadge` picks a
  light or dark mark automatically based on the tile's luminance, so bright brands (Snapchat yellow,
  TikTok cyan) stay legible.

## SEO surface

| Area              | Where                                                                       |
| ----------------- | --------------------------------------------------------------------------- |
| Landing pages     | `src/lib/platforms.ts` → rendered by `src/app/[slug]/page.tsx`               |
| Titles/meta/canon | `generateMetadata` per route; `alternates.canonical` on every indexable page |
| Sitemap           | `src/app/sitemap.ts` — canonical pages only, no API or download URLs         |
| Robots            | `src/app/robots.ts` — blocks `/api/` and all download endpoints              |
| Schema (JSON-LD)  | `WebSite` in the layout, `WebApplication` per tool page, `BreadcrumbList` in `Breadcrumbs`, `FAQPage` in `FaqAccordion` |
| Redirects         | `next.config.ts` — 308s from renamed slugs and common alternate spellings     |

`dynamicParams = false` on `/[slug]` means only the curated slugs exist; anything else 404s rather
than becoming an indexable URL.

## Known limitations

- Lighthouse performance was not measured in this environment (no browser available to run an
  audit) — the app avoids heavy client bundles and uses server components by default, but treat the
  90+ target as unverified until you run Lighthouse against a deployed build.
- SSRF protection blocks private/loopback/link-local IP ranges by resolving DNS before extraction,
  but does not protect against DNS-rebinding attacks where the resolved IP changes between the check
  and the actual yt-dlp request. For stricter guarantees, run yt-dlp inside a network-isolated
  container/VM.
- Force-subscribe / Telegram bot integration is a separate project (`../All Video DL`) — this
  website does not depend on it.
- Direct CDN links are minted from what yt-dlp reports. Some platforms serve media URLs that are
  short-lived or tied to request headers; when one is rejected the visitor sees a "link expired"
  message and needs to re-extract. The signed link's own TTL (`DIRECT_LINK_TTL`) is deliberately
  shorter than most CDN token lifetimes to make this rare.
- There is no Instagram photo/carousel-image downloader page. The pipeline builds format lists from
  video streams only, so such a page would rank for an intent the tool cannot actually serve.
- Vimeo extraction currently fails in yt-dlp 2026.07.04 with an OAuth token error from Vimeo's side.
  The page and routing are correct; it will start working again with an upstream yt-dlp fix.
