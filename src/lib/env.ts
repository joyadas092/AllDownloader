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

export const env = {
  brandName: process.env.BRAND_NAME || "OnlineMP4",
  siteUrl: (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
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
