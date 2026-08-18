import { NextRequest, NextResponse } from "next/server";

import { assertSafeUrl } from "@/lib/extractor/ssrf-guard";
import { canStartJob, createJob, scheduleJobCleanup, updateJob } from "@/lib/extractor/jobs";
import { checkRateLimit, getClientIp } from "@/lib/extractor/rate-limit";
import { ExtractError } from "@/lib/extractor/types";
import { downloadFormat } from "@/lib/extractor/ytdlp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, code: "rate_limited", message: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const rejection = canStartJob(ip);
  if (rejection) {
    return NextResponse.json(
      {
        success: false,
        code: "rate_limited",
        message:
          rejection === "ip_busy"
            ? "You already have a download in progress. Please wait for it to finish."
            : "Server is busy. Please try again shortly.",
      },
      { status: 429 }
    );
  }

  let url: string;
  let formatId: string;
  try {
    const body = await req.json();
    url = String(body?.url ?? "");
    formatId = String(body?.format_id ?? "");
    if (!url || !formatId) throw new Error("missing fields");
  } catch {
    return NextResponse.json(
      { success: false, code: "invalid_url", message: "Missing url or format_id." },
      { status: 400 }
    );
  }

  try {
    await assertSafeUrl(url);
  } catch (err) {
    if (err instanceof ExtractError) {
      return NextResponse.json({ success: false, code: err.code, message: err.message }, { status: 400 });
    }
    throw err;
  }

  const job = createJob(ip);

  downloadFormat(url, formatId, (p) => {
    updateJob(job.id, { status: "downloading", pct: p.pct, speed: p.speed, eta: p.eta });
  })
    .then((result) => {
      updateJob(job.id, {
        status: "done",
        pct: 100,
        filepath: result.filepath,
        filename: result.filename,
      });
      scheduleJobCleanup(job.id);
    })
    .catch((err) => {
      const message = err instanceof ExtractError ? err.message : "Download failed. Please try again.";
      updateJob(job.id, { status: "error", error: message });
    });

  return NextResponse.json({ job_id: job.id });
}
