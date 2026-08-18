import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { assertSafeUrl } from "@/lib/extractor/ssrf-guard";
import { verifyDirectToken } from "@/lib/extractor/sign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Pass-through for CDN-hosted files. Used only when CDN_PROXY_URL is unset —
 * with the edge Worker configured, browsers never hit this route and the host
 * serves zero video bytes.
 *
 * Even here nothing is written to disk and no yt-dlp process runs: the upstream
 * body is piped straight to the client. Only signed URLs minted by /api/extract
 * are accepted, so this cannot be used as an open proxy.
 */
export async function GET(req: NextRequest) {
  const payload = verifyDirectToken(req.nextUrl.searchParams.get("t"));
  if (!payload) {
    return NextResponse.json(
      { success: false, code: "source_unavailable", message: "This download link has expired." },
      { status: 403 }
    );
  }

  try {
    await assertSafeUrl(payload.u);
  } catch {
    return NextResponse.json(
      { success: false, code: "invalid_url", message: "That source isn't allowed." },
      { status: 400 }
    );
  }

  const forwarded = new Headers();
  const range = req.headers.get("range");
  if (range) forwarded.set("range", range);
  // Some CDNs (TikTok, Instagram) reject requests without a browser-ish agent.
  forwarded.set("user-agent", req.headers.get("user-agent") ?? "Mozilla/5.0");

  let upstream: Response;
  try {
    upstream = await fetch(payload.u, { headers: forwarded, redirect: "follow" });
  } catch {
    return NextResponse.json(
      { success: false, code: "source_unavailable", message: "The source didn't respond." },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { success: false, code: "source_unavailable", message: "The source refused this download." },
      { status: 502 }
    );
  }

  const length = Number(upstream.headers.get("content-length") ?? 0);
  if (length > env.maxFileSizeBytes) {
    return NextResponse.json(
      { success: false, code: "source_unavailable", message: "That file is larger than we allow." },
      { status: 413 }
    );
  }

  const headers = new Headers({
    "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
    "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(payload.n)}`,
    // Never let a CDN or the platform cache multi-hundred-MB media responses.
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });
  for (const header of ["content-length", "accept-ranges", "content-range"]) {
    const value = upstream.headers.get(header);
    if (value) headers.set(header, value);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
