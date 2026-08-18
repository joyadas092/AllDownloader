/**
 * SnapFetch edge download proxy (Cloudflare Worker).
 *
 * Purpose: keep video bytes off the application host. The Next.js app mints a
 * short-lived HMAC token describing one CDN URL and one filename; this Worker
 * verifies it, streams the file straight through, and attaches the
 * Content-Disposition header that makes the browser save rather than play it.
 *
 * Cloudflare does not bill egress, and a streaming pass-through is I/O rather
 * than CPU, so the cost of a download here is one request — not its megabytes.
 *
 * Deploy:
 *   1. wrangler deploy (see wrangler.toml alongside this file)
 *   2. wrangler secret put DOWNLOAD_SIGNING_SECRET   # same value as the app
 *   3. Set CDN_PROXY_URL in the app to this Worker's URL, e.g.
 *      https://dl.example.com/
 *
 * Without CDN_PROXY_URL the app falls back to /api/download/stream, which is
 * functionally identical but spends host bandwidth.
 */

const encoder = new TextEncoder();

function b64urlToBytes(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToB64url(bytes) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function verify(token, secret) {
  if (!token) return null;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const encoded = token.slice(0, dot);
  const provided = token.slice(dot + 1);

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expected = bytesToB64url(await crypto.subtle.sign("HMAC", key, encoder.encode(encoded)));

  // Constant-time compare.
  if (provided.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;

  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(encoded)));
  } catch {
    return null;
  }

  if (typeof payload.u !== "string" || typeof payload.e !== "number") return null;
  if (payload.e * 1000 < Date.now()) return null;
  if (!payload.u.startsWith("https://")) return null;

  return payload;
}

const worker = {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const token = new URL(request.url).searchParams.get("t");
    const payload = await verify(token, env.DOWNLOAD_SIGNING_SECRET);
    if (!payload) {
      return new Response("This download link has expired.", { status: 403 });
    }

    const forwarded = new Headers();
    const range = request.headers.get("range");
    if (range) forwarded.set("range", range);
    forwarded.set("user-agent", request.headers.get("user-agent") || "Mozilla/5.0");

    const upstream = await fetch(payload.u, {
      method: request.method,
      headers: forwarded,
      redirect: "follow",
    });

    if (!upstream.ok && upstream.status !== 206) {
      return new Response("The source refused this download.", { status: 502 });
    }

    const headers = new Headers();
    for (const header of ["content-length", "content-type", "accept-ranges", "content-range"]) {
      const value = upstream.headers.get(header);
      if (value) headers.set(header, value);
    }
    if (!headers.has("content-type")) headers.set("content-type", "application/octet-stream");

    const filename = encodeURIComponent(payload.n || "video.mp4");
    headers.set("content-disposition", `attachment; filename*=UTF-8''${filename}`);
    // Never cache media at the edge — these are large, single-use, and expire.
    headers.set("cache-control", "private, no-store");
    headers.set("x-content-type-options", "nosniff");

    return new Response(upstream.body, { status: upstream.status, headers });
  },
};

export default worker;
