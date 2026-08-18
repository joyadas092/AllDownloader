import { randomBytes } from "node:crypto";

function num(name: string, fallback: number, alias?: string): number {
  const raw = process.env[name] ?? (alias ? process.env[alias] : undefined);
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function str(name: string, fallback: string, alias?: string): string {
  return process.env[name] || (alias ? process.env[alias] : undefined) || fallback;
}

/**
 * Signing secret for direct-CDN download links. Without it, links are still
 * signed — but with a per-process random key, so they stop working after a
 * restart and can't be shared across instances. Set it in production.
 */
function signingSecret(): string {
  const configured = process.env.DOWNLOAD_SIGNING_SECRET;
  if (configured && configured.length >= 16) return configured;
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[env] DOWNLOAD_SIGNING_SECRET is unset or too short — falling back to an ephemeral key. " +
        "Direct download links will break on restart and across instances."
    );
  }
  return randomBytes(32).toString("hex");
}

const maxFileSizeMb = num("MAX_FILE_SIZE_MB", 0);

/**
 * Canonical site origin.
 *
 * Hosting dashboards hand you a bare hostname, and pasting that in is easy to
 * do — but `new URL()` rejects it, which takes down `metadataBase`, sitemap.xml
 * and robots.txt, i.e. the whole site. Assume https when no scheme is given
 * rather than crashing over a missing eight characters.
 */
function siteUrl(): string {
  const raw = (process.env.SITE_URL || "http://localhost:3000").trim().replace(/\/+$/, "");
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(withScheme).origin;
  } catch {
    console.warn(`[env] SITE_URL is not a usable URL (${raw}); falling back to localhost.`);
    return "http://localhost:3000";
  }
}

export const env = {
  brandName: process.env.BRAND_NAME || "OnlineMP4",
  siteUrl: siteUrl(),
  contactEmail: process.env.CONTACT_EMAIL || "support@example.com",

  // --- server-side download limits -----------------------------------------
  /** yt-dlp `--max-filesize` value, e.g. "500M". Derived from MAX_FILE_SIZE_MB when set. */
  maxDownloadSize: maxFileSizeMb > 0 ? `${maxFileSizeMb}M` : str("MAX_DOWNLOAD_SIZE", "500M"),
  /** Same limit in bytes, used to reject oversized direct-CDN streams. */
  maxFileSizeBytes: (maxFileSizeMb > 0 ? maxFileSizeMb : parseSizeMb(str("MAX_DOWNLOAD_SIZE", "500M"))) * 1024 * 1024,
  maxConcurrentDownloads: num("MAX_CONCURRENT_DOWNLOADS", 3, "MAX_CONCURRENT_JOBS"),
  maxConcurrentJobsPerIp: num("MAX_CONCURRENT_JOBS_PER_IP", 1),
  processTimeoutMs: num("DOWNLOAD_TIMEOUT_SECONDS", 0) * 1000 || num("PROCESS_TIMEOUT_MS", 10 * 60 * 1000),

  // --- temp storage --------------------------------------------------------
  tempFileTtlSeconds: num("TEMP_FILE_TTL", 600, "JOB_EXPIRY_SECONDS"),
  cleanupIntervalSeconds: num("CLEANUP_INTERVAL", 1800),
  tempDir: str("TEMP_DOWNLOAD_DIR", "tmp-downloads"),

  // --- abuse protection ----------------------------------------------------
  rateLimitPerMinute: num("MAX_REQUESTS_PER_IP", 0) || num("RATE_LIMIT", 20),

  // --- direct-CDN delivery (bandwidth saving) ------------------------------
  /**
   * Absolute URL of the Cloudflare Worker (or equivalent zero-egress edge
   * proxy) that streams CDN files to visitors. When set, video bytes never
   * touch this server. When unset we fall back to /api/download/stream, which
   * still avoids writing to disk but does use host egress.
   */
  cdnProxyUrl: (process.env.CDN_PROXY_URL || "").replace(/\/$/, ""),
  downloadSigningSecret: signingSecret(),
  directLinkTtlSeconds: num("DIRECT_LINK_TTL", 900),

  ytDlpPath: str("YTDLP_PATH", "yt-dlp"),

  /**
   * Extra yt-dlp flags, whitespace-separated, read at request time.
   *
   * Exists because YouTube bot-checks datacenter IPs ("Sign in to confirm
   * you're not a bot"), and the workaround — which player client to imitate —
   * changes as YouTube pushes back. Keeping it in the environment means trying
   * a new value is a restart rather than a rebuild.
   *
   * Example: --extractor-args youtube:player_client=tv_simply,web_safari
   *
   * Arguments are passed to execFile as a list, never through a shell, so
   * there is no injection path here — but it is still operator-only config.
   */
  ytDlpExtraArgs: (process.env.YTDLP_EXTRA_ARGS || "").split(/\s+/).filter(Boolean),

  /** Path to a Netscape-format cookies file, if one is supplied. Local dev. */
  ytDlpCookiesFile: process.env.YTDLP_COOKIES_FILE || "",

  /**
   * The same cookie jar, base64-encoded, for hosts where you cannot put a file
   * on disk. Railway has no persistent volume and no file upload, so a path
   * alone can never be satisfied there — this is how YouTube authentication
   * actually reaches production. Decoded lazily in extractor/cookies.ts; kept
   * out of this module so env.ts stays free of filesystem work.
   */
  ytDlpCookiesB64: process.env.YTDLP_COOKIES_B64 || "",

  /**
   * JavaScript runtime yt-dlp uses to solve YouTube's "n challenge" — one of
   * node, deno, quickjs, bun. Empty leaves yt-dlp on its own default (deno).
   *
   * Unsolved, the challenge means YouTube returns only thumbnails and yt-dlp
   * reports "Requested format is not available", which reads like a bad format
   * string rather than a missing runtime. Node needs to be >= 22.
   *
   * Env-driven rather than hardcoded so a dev box on an older Node isn't forced
   * onto a runtime it cannot satisfy — the Docker image sets it, local does not.
   */
  ytDlpJsRuntime: process.env.YTDLP_JS_RUNTIME || "",
};

/** Parses a yt-dlp style size string ("500M", "2G", "700") into megabytes. */
function parseSizeMb(value: string): number {
  const match = /^(\d+(?:\.\d+)?)\s*([KMGkmg])?$/.exec(value.trim());
  if (!match) return 500;
  const n = Number(match[1]);
  switch ((match[2] || "M").toUpperCase()) {
    case "K":
      return n / 1024;
    case "G":
      return n * 1024;
    default:
      return n;
  }
}
