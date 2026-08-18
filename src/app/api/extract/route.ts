import { NextRequest, NextResponse } from "next/server";

import { assertSafeUrl } from "@/lib/extractor/ssrf-guard";
import { checkRateLimit, getClientIp } from "@/lib/extractor/rate-limit";
import { ExtractError } from "@/lib/extractor/types";
import { extractInfo } from "@/lib/extractor/ytdlp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, code: "rate_limited", message: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  let url: string;
  try {
    const body = await req.json();
    url = String(body?.url ?? "");
  } catch {
    return NextResponse.json(
      { success: false, code: "invalid_url", message: "Missing request body." },
      { status: 400 }
    );
  }

  try {
    await assertSafeUrl(url);
    const info = await extractInfo(url);
    return NextResponse.json(info);
  } catch (err) {
    if (err instanceof ExtractError) {
      const status = err.code === "rate_limited" ? 429 : err.code === "invalid_url" ? 400 : 422;
      return NextResponse.json({ success: false, code: err.code, message: err.message }, { status });
    }
    return NextResponse.json(
      { success: false, code: "server_error", message: "Something went wrong on our end." },
      { status: 500 }
    );
  }
}
