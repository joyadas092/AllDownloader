import { NextRequest } from "next/server";

import { getJob } from "@/lib/extractor/jobs";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let closed = false;

      const send = (data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const interval = setInterval(() => {
        const job = getJob(jobId);
        if (!job) {
          send({ status: "error", error: "Job not found or expired." });
          clearInterval(interval);
          closed = true;
          controller.close();
          return;
        }

        send({
          status: job.status,
          pct: job.pct,
          speed: job.speed,
          eta: job.eta,
          error: job.error,
        });

        if (job.status === "done" || job.status === "error") {
          clearInterval(interval);
          closed = true;
          controller.close();
        }
      }, 500);

      _req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        closed = true;
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
