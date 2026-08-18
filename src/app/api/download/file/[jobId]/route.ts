import fs from "node:fs";

import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";

import { consumeJobFile, cleanupJob } from "@/lib/extractor/jobs";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const job = consumeJobFile(jobId);

  if (!job || job.status !== "done" || !job.filepath || !fs.existsSync(job.filepath)) {
    return NextResponse.json(
      { success: false, code: "source_unavailable", message: "This download has expired." },
      { status: 404 }
    );
  }

  const stat = fs.statSync(job.filepath);
  const nodeStream = fs.createReadStream(job.filepath);

  // Delete as soon as the transfer ends, however it ends — a completed
  // download, an aborted one, or a read error. Nothing lingers on disk.
  nodeStream.on("close", () => cleanupJob(job));
  nodeStream.on("error", () => cleanupJob(job));

  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(stat.size),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(job.filename ?? "video.mp4")}`,
      // Single-use, per-visitor file — must never be cached by a CDN or proxy.
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
