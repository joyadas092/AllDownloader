"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Download, Loader2, Music, Video as VideoIcon } from "lucide-react";

import { humanSize } from "@/lib/format-utils";
import type { FormatOption } from "@/lib/extractor/types";

type Stage = "idle" | "starting" | "downloading" | "done" | "error";

function triggerBrowserDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  // Honoured for same-origin responses; cross-origin relies on the
  // Content-Disposition header the edge proxy sets.
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function FormatRow({ url, format }: { url: string; format: FormatOption }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [pct, setPct] = useState(0);
  const [speed, setSpeed] = useState<string | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  async function handleDownload() {
    setError(null);

    // Progressive formats already exist as one complete file on the source CDN.
    // The browser fetches them itself — no job, no temp file, no server transfer.
    if (format.direct_url) {
      triggerBrowserDownload(format.direct_url);
      setStage("done");
      return;
    }

    setStage("starting");

    let jobId: string;
    try {
      const res = await fetch("/api/download/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format_id: format.format_id }),
      });
      const data = await res.json();
      if (!res.ok || !data.job_id) {
        setError(data.message || "Couldn't start the download.");
        setStage("error");
        return;
      }
      jobId = data.job_id;
    } catch {
      setError("Network error. Please try again.");
      setStage("error");
      return;
    }

    setStage("downloading");
    const es = new EventSource(`/api/download/progress/${jobId}`);
    esRef.current = es;

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "downloading" || data.status === "queued") {
        setPct(data.pct ?? 0);
        setSpeed(data.speed ?? null);
        setEta(data.eta ?? null);
      } else if (data.status === "done") {
        es.close();
        setStage("done");
        triggerBrowserDownload(`/api/download/file/${jobId}`);
      } else if (data.status === "error" || data.status === "expired") {
        es.close();
        setError(data.error || "Download failed.");
        setStage("error");
      }
    };

    es.onerror = () => {
      es.close();
      if (stage !== "done") {
        setError("Connection lost. Please try again.");
        setStage("error");
      }
    };
  }

  const size = humanSize(format.filesize);
  const Icon = format.is_audio ? Music : VideoIcon;
  const label = `${format.extension.toUpperCase()} ${format.quality}`;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-bg-soft/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-text-muted"
        >
          <Icon size={16} />
        </span>
        <div>
          <p className="text-sm font-medium text-text">{label}</p>
          <p className="text-xs text-text-dim">
            {size}
            {size && format.direct_url ? " · " : ""}
            {format.direct_url ? "Instant" : ""}
          </p>
          {stage === "error" && (
            <p role="alert" className="text-xs text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>

      {stage === "idle" && (
        <button
          type="button"
          onClick={handleDownload}
          aria-label={`Download ${label}`}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Download size={15} aria-hidden="true" />
          Download
        </button>
      )}

      {(stage === "starting" || stage === "downloading") && (
        <div
          className="w-32 text-right"
          role="progressbar"
          aria-label={`Preparing ${label}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stage === "starting" ? 0 : pct}
        >
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${stage === "starting" ? 5 : Math.max(5, pct)}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-text-dim">
            {stage === "starting" ? "Starting…" : `${pct}% · ${speed ?? "…"} · ETA ${eta ?? "…"}`}
          </p>
        </div>
      )}

      {stage === "done" && (
        <span
          role="status"
          className="flex items-center gap-1.5 text-sm font-medium text-emerald-400"
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          Saved
        </span>
      )}

      {stage === "error" && (
        <button
          type="button"
          onClick={handleDownload}
          aria-label={`Retry download of ${label}`}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Loader2 size={15} aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}
