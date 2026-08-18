import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "@/lib/env";

export interface DirectLinkPayload {
  /** Upstream CDN URL to stream from. */
  u: string;
  /** Filename to hand the browser. */
  n: string;
  /** Absolute expiry, epoch seconds. */
  e: number;
}

function b64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", env.downloadSigningSecret).update(payload).digest("base64url");
}

/**
 * Mints a tamper-proof token for one CDN URL. Without a valid signature the
 * stream endpoint (and the edge Worker) refuse to fetch anything, so neither
 * can be abused as an open proxy.
 */
export function createDirectToken(url: string, filename: string, ttlSeconds = env.directLinkTtlSeconds): string {
  const payload: DirectLinkPayload = {
    u: url,
    n: filename,
    e: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encoded = b64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyDirectToken(token: string | null): DirectLinkPayload | null {
  if (!token) return null;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const encoded = token.slice(0, dot);
  const provided = token.slice(dot + 1);
  const expected = sign(encoded);

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload: DirectLinkPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (typeof payload.u !== "string" || typeof payload.e !== "number") return null;
  if (payload.e * 1000 < Date.now()) return null;

  return payload;
}

/**
 * Builds the public download URL for a direct CDN file. Prefers the external
 * edge proxy (zero host egress) and falls back to our own streaming endpoint.
 */
export function buildDirectDownloadUrl(url: string, filename: string): string {
  const token = createDirectToken(url, filename);
  const base = env.cdnProxyUrl || "/api/download/stream";
  return `${base}?t=${encodeURIComponent(token)}`;
}

/** Strips characters that are unsafe in a Content-Disposition filename. */
export function safeFilename(title: string, ext: string): string {
  const cleaned = (title || "video")
    .replace(/[\\/:*?"<>|\r\n\t]+/g, " ")
    .replace(/[^\w\-. ()[\]]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100)
    .replace(/[. ]+$/, "");

  return `${cleaned || "video"}.${ext}`;
}
