import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { env } from "@/lib/env";

/**
 * Supplies the Netscape-format cookie jar yt-dlp needs to get past YouTube's
 * "Sign in to confirm you're not a bot" check.
 *
 * That check is triggered by IP reputation, not by anything we do: the same
 * yt-dlp version extracts fine from a residential connection and fails from a
 * datacenter one. Cookies from a signed-in session are the free way through.
 *
 * Two sources, in priority order:
 *   YTDLP_COOKIES_FILE  a path — convenient locally
 *   YTDLP_COOKIES_B64   base64 of the same file — for hosts with no disk
 *
 * The result is memoised: decoding and writing happens once per process, not
 * once per download.
 */

/** `undefined` = not resolved yet; `null` = resolved to "no jar available". */
let cached: string | null | undefined;

/**
 * A jar that decodes cleanly but isn't a cookie file at all (wrong variable
 * pasted, base64 of an error page, truncated copy/paste) makes yt-dlp fail in a
 * way that looks identical to having no cookies. Checking the shape up front
 * turns that into one obvious log line.
 */
function looksLikeCookieJar(text: string): boolean {
  if (text.startsWith("# Netscape HTTP Cookie File")) return true;
  // Some exporters drop the header; a tab-delimited youtube domain line is the
  // other reliable tell.
  return /^\.?(?:[\w-]+\.)*youtube\.com\t/m.test(text);
}

/**
 * Absolute path to a cookie jar yt-dlp can use, or null when none is
 * configured. Never throws — a cookie problem must not take down extraction for
 * the platforms that don't need one.
 */
export function resolveCookiesFile(): string | null {
  if (cached !== undefined) return cached;

  cached = null;

  try {
    if (env.ytDlpCookiesFile) {
      if (fs.existsSync(env.ytDlpCookiesFile)) {
        cached = env.ytDlpCookiesFile;
      } else {
        console.warn(`[cookies] YTDLP_COOKIES_FILE points at a missing path: ${env.ytDlpCookiesFile}`);
      }
      return cached;
    }

    if (!env.ytDlpCookiesB64) return cached;

    const decoded = Buffer.from(env.ytDlpCookiesB64, "base64").toString("utf8");
    if (!looksLikeCookieJar(decoded)) {
      // Deliberately does not echo the value — a valid jar is a live credential.
      console.warn("[cookies] ignoring malformed jar: YTDLP_COOKIES_B64 is not a Netscape cookie file");
      return cached;
    }

    // Must be somewhere writable: yt-dlp rewrites the jar in place as YouTube
    // rotates cookies, and a read-only path turns that into a hard error.
    const target = path.join(os.tmpdir(), "yt-cookies.txt");
    fs.writeFileSync(target, decoded, { mode: 0o600 });
    cached = target;
  } catch (err) {
    console.warn(`[cookies] could not prepare cookie jar: ${(err as Error).message}`);
    cached = null;
  }

  return cached;
}
