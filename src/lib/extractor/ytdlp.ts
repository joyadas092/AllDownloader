import { execFile, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";

import { env } from "@/lib/env";
import { getTempDir } from "./jobs";
import { buildDirectDownloadUrl, safeFilename } from "./sign";
import { ExtractError, type FormatOption, type VideoInfo } from "./types";

const execFileAsync = promisify(execFile);

interface RawFormat {
  format_id: string;
  url?: string | null;
  protocol?: string | null;
  height?: number | null;
  vcodec?: string | null;
  acodec?: string | null;
  abr?: number | null;
  filesize?: number | null;
  filesize_approx?: number | null;
  ext?: string | null;
}

interface RawInfo {
  title?: string;
  thumbnail?: string | null;
  duration?: number | null;
  extractor_key?: string;
  formats?: RawFormat[];
  filesize?: number | null;
  filesize_approx?: number | null;
}

function sizeOf(f: RawFormat): number {
  return f.filesize ?? f.filesize_approx ?? 0;
}

/**
 * True when the CDN serves this format as one plain HTTP file. DASH/HLS
 * manifests (m3u8, dash segments) can't be handed to a browser as a download,
 * so those still have to go through the server pipeline.
 */
function isPlainHttp(f: RawFormat): boolean {
  const protocol = (f.protocol ?? "").toLowerCase();
  const url = f.url ?? "";
  if (!url.startsWith("https://")) return false;
  return protocol === "https" || protocol === "http" || protocol === "";
}

const hasVideo = (f: RawFormat) => !!f.vcodec && f.vcodec !== "none";
const hasAudio = (f: RawFormat) => !!f.acodec && f.acodec !== "none";

interface HeightCandidates {
  /** Single file with both tracks — can be handed straight to the browser. */
  progressive?: RawFormat;
  /** Video-only rendition, needs a server-side mux with an audio track. */
  videoOnly?: RawFormat;
}

/**
 * A format that looks directly fetchable. Whether it really is has to be
 * confirmed against the CDN before we offer it — see resolveDirectLinks.
 */
interface DirectCandidate {
  url: string;
  filename: string;
  /** Drop the row entirely if the CDN rejects us, rather than falling back. */
  dropIfUnreachable: boolean;
}

type BuiltFormat = FormatOption & { candidate?: DirectCandidate };

/**
 * Splits the source's renditions into two buckets per resolution: ones the
 * browser can pull directly from the CDN (zero host bandwidth) and ones that
 * genuinely need server-side merging.
 */
function buildFormatOptions(info: RawInfo, title: string): BuiltFormat[] {
  const byHeight = new Map<number, HeightCandidates>();

  for (const f of info.formats ?? []) {
    const height = f.height;
    if (!height || !hasVideo(f)) continue;

    const bucket = byHeight.get(height) ?? {};

    if (hasAudio(f) && isPlainHttp(f)) {
      if (!bucket.progressive || sizeOf(f) > sizeOf(bucket.progressive)) bucket.progressive = f;
    } else {
      if (!bucket.videoOnly || sizeOf(f) > sizeOf(bucket.videoOnly)) bucket.videoOnly = f;
    }

    byHeight.set(height, bucket);
  }

  const qualities: BuiltFormat[] = [...byHeight.entries()]
    .sort((a, b) => b[0] - a[0])
    .slice(0, 6)
    .map(([height, bucket]) => {
      const source = bucket.progressive;
      if (source) {
        const ext = source.ext || "mp4";
        return {
          // If the CDN turns out to reject direct requests, this same format_id
          // still downloads correctly through the server pipeline.
          format_id: source.format_id,
          quality: `${height}p`,
          extension: ext,
          filesize: sizeOf(source) || null,
          is_audio: false,
          direct_url: null,
          candidate: {
            url: source.url as string,
            filename: safeFilename(title, ext),
            dropIfUnreachable: false,
          },
        };
      }

      const merge = bucket.videoOnly as RawFormat;
      return {
        format_id: `${merge.format_id}+bestaudio/best`,
        quality: `${height}p`,
        extension: "mp4",
        filesize: sizeOf(merge) || null,
        is_audio: false,
        direct_url: null,
      };
    });

  if (qualities.length === 0) {
    // Nothing reported a resolution. That is normal for sources with a single
    // rendition — plain file hosts and smaller platforms — where the one format
    // on offer is the complete video, codecs simply unlabelled.
    const single = (info.formats ?? [])
      .filter((f) => f.vcodec !== "none" && isPlainHttp(f))
      .sort((a, b) => sizeOf(b) - sizeOf(a))[0];

    const ext = single?.ext || "mp4";
    qualities.push({
      format_id: single?.format_id ?? "best",
      quality: "Best available",
      extension: ext,
      filesize: sizeOf(single ?? ({} as RawFormat)) || info.filesize || info.filesize_approx || null,
      is_audio: false,
      direct_url: null,
      candidate: single
        ? { url: single.url as string, filename: safeFilename(title, ext), dropIfUnreachable: false }
        : undefined,
    });
  }

  // Original audio track, if the CDN exposes it as a plain file — this costs
  // us nothing and is what most "download the audio" visitors actually want.
  const bestAudio = (info.formats ?? [])
    .filter((f) => !hasVideo(f) && hasAudio(f) && isPlainHttp(f))
    .sort((a, b) => (b.abr ?? 0) - (a.abr ?? 0) || sizeOf(b) - sizeOf(a))[0];

  if (bestAudio) {
    const ext = bestAudio.ext || "m4a";
    qualities.push({
      format_id: bestAudio.format_id,
      quality: `Original audio (${ext.toUpperCase()})`,
      extension: ext,
      filesize: sizeOf(bestAudio) || null,
      is_audio: true,
      direct_url: null,
      // This row only exists because it is free. If the CDN won't serve it
      // directly, drop it — the MP3 option below already covers audio-only.
      candidate: {
        url: bestAudio.url as string,
        filename: safeFilename(title, ext),
        dropIfUnreachable: true,
      },
    });
  }

  // Converted MP3 always needs ffmpeg, so it stays on the server pipeline.
  qualities.push({
    format_id: "bestaudio/best",
    quality: "MP3 audio",
    extension: "mp3",
    filesize: null,
    is_audio: true,
    direct_url: null,
  });

  return qualities;
}

const PROBE_TIMEOUT_MS = 3000;

/**
 * Asks the CDN for the first byte of a candidate file.
 *
 * A URL appearing in yt-dlp's output does not mean a browser can fetch it.
 * YouTube in particular hands out googlevideo URLs that are bound to the
 * session which requested them and answer 403 to anyone else, while Instagram,
 * TikTok, Facebook and X embed their authorisation in the URL itself and serve
 * it to anybody. Rather than hardcoding that per platform — which would rot the
 * moment a platform changes — we spend one ~1 KB request to find out.
 */
async function isDirectlyFetchable(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: {
        range: "bytes=0-0",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    // Drain so the socket can be reused rather than left hanging.
    await res.body?.cancel();
    return res.status === 200 || res.status === 206;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Confirms each direct candidate, then either promotes it to a signed download
 * link or falls the row back to the server pipeline (or removes it, for rows
 * that only existed because they were free).
 */
async function resolveDirectLinks(formats: BuiltFormat[]): Promise<FormatOption[]> {
  const results = await Promise.all(
    formats.map(async (format) => {
      const { candidate, ...option } = format;
      if (!candidate) return option;

      if (await isDirectlyFetchable(candidate.url)) {
        return { ...option, direct_url: buildDirectDownloadUrl(candidate.url, candidate.filename) };
      }
      return candidate.dropIfUnreachable ? null : option;
    })
  );

  return results.filter((f): f is FormatOption => f !== null);
}

function mapYtDlpError(stderr: string): ExtractError {
  const lower = stderr.toLowerCase();
  if (lower.includes("private video") || lower.includes("login required")) {
    return new ExtractError("private_video", "This video is private or requires login to view.");
  }
  if (
    lower.includes("unsupported url") ||
    lower.includes("no video formats found") ||
    lower.includes("unable to extract")
  ) {
    return new ExtractError("unsupported_url", "This link isn't supported or doesn't contain a video.");
  }
  if (
    lower.includes("video unavailable") ||
    lower.includes("this content isn't available") ||
    lower.includes("404") ||
    lower.includes("not found")
  ) {
    return new ExtractError("source_unavailable", "The video is unavailable, deleted, or region-locked.");
  }
  if (lower.includes("http error 429") || lower.includes("rate-limit")) {
    return new ExtractError("rate_limited", "The source platform is rate-limiting us. Try again shortly.");
  }
  return new ExtractError("extraction_error", "Couldn't process that link right now. Please try again.");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runYtDlpJson(url: string): Promise<string> {
  const MAX_ATTEMPTS = 3;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await execFileAsync(
        env.ytDlpPath,
        ["-j", "--no-warnings", "--no-playlist", "--socket-timeout", "20", url],
        { timeout: env.processTimeoutMs, maxBuffer: 1024 * 1024 * 32 }
      );
      return result.stdout;
    } catch (err: unknown) {
      const e = err as { stderr?: string; killed?: boolean };
      if (e.killed) throw new ExtractError("extraction_error", "The source took too long to respond.");

      const mapped = mapYtDlpError(e.stderr ?? "");
      // Only retry the generic/unclassified failure — platforms like Instagram
      // intermittently throttle anonymous requests, and a short retry often succeeds.
      // Permanent cases (private, unsupported, source gone) fail immediately instead.
      if (mapped.code !== "extraction_error" || attempt === MAX_ATTEMPTS) throw mapped;
      await sleep(600 * attempt);
    }
  }

  throw new ExtractError("server_error", "Unreachable");
}

export async function extractInfo(url: string): Promise<VideoInfo> {
  const stdout = await runYtDlpJson(url);

  let info: RawInfo;
  try {
    info = JSON.parse(stdout);
  } catch {
    throw new ExtractError("server_error", "Received an unexpected response while reading the video.");
  }

  const title = info.title ?? "video";

  return {
    success: true,
    platform: info.extractor_key ?? "Video",
    title,
    thumbnail: info.thumbnail ?? null,
    duration: info.duration ?? null,
    formats: await resolveDirectLinks(buildFormatOptions(info, title)),
  };
}

export interface DownloadProgress {
  pct: number;
  speed: string | null;
  eta: string | null;
}

export interface DownloadResult {
  filepath: string;
  filename: string;
}

const PROGRESS_RE = /\[download]\s+([\d.]+)% of\s+~?\s*[\d.]+\w+\s+at\s+([^\s]+)\s+ETA\s+([\d:]+)/;

export function downloadFormat(
  url: string,
  formatId: string,
  onProgress: (p: DownloadProgress) => void
): Promise<DownloadResult> {
  return new Promise((resolve, reject) => {
    const jobDir = path.join(getTempDir(), randomUUID());
    fs.mkdirSync(jobDir, { recursive: true });

    const isAudio = formatId === "bestaudio/best";
    const outTemplate = path.join(jobDir, "%(title).100s.%(ext)s");

    const args = [
      "-o",
      outTemplate,
      "-f",
      formatId,
      "--no-playlist",
      "--no-warnings",
      "--newline",
      "--restrict-filenames",
      "--max-filesize",
      env.maxDownloadSize,
      "--socket-timeout",
      "20",
    ];

    if (isAudio) {
      args.push("--extract-audio", "--audio-format", "mp3", "--audio-quality", "192K");
    } else {
      args.push("--merge-output-format", "mp4");
    }

    args.push(url);

    const child = spawn(env.ytDlpPath, args, { windowsHide: true });
    let stderrBuf = "";

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
    }, env.processTimeoutMs);
    timer.unref();

    child.stdout.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      for (const line of text.split(/\r|\n/)) {
        const match = PROGRESS_RE.exec(line);
        if (match) {
          onProgress({ pct: Math.round(parseFloat(match[1])), speed: match[2], eta: match[3] });
        }
      }
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderrBuf += chunk.toString();
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      reject(new ExtractError("server_error", err.message));
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        fs.rmSync(jobDir, { recursive: true, force: true });
        reject(mapYtDlpError(stderrBuf));
        return;
      }

      const files = fs.readdirSync(jobDir);
      if (files.length === 0) {
        reject(new ExtractError("server_error", "Download finished but no file was produced."));
        return;
      }

      const filename = files[0];
      resolve({ filepath: path.join(jobDir, filename), filename });
    });
  });
}
