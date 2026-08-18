"use client";

import { useState } from "react";
import { CheckCircle2, Link2, Loader2 } from "lucide-react";

import { detectPlatform } from "@/lib/platforms";
import type { VideoInfo } from "@/lib/extractor/types";
import PlatformBadge from "@/components/PlatformBadge";
import ResultCard from "./ResultCard";
import ErrorState from "./ErrorState";

type Stage = "idle" | "loading" | "result" | "error";

export default function DownloaderWidget({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [errorCode, setErrorCode] = useState("server_error");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const detected = url.trim() ? detectPlatform(url.trim()) : null;

  async function runExtract(targetUrl: string) {
    setStage("loading");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorCode(data.code || "server_error");
        setErrorMessage(data.message);
        setStage("error");
        return;
      }
      setInfo(data);
      setStage("result");
    } catch {
      setErrorCode("server_error");
      setErrorMessage(undefined);
      setStage("error");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    void runExtract(trimmed);
  }

  function reset() {
    setUrl("");
    setInfo(null);
    setStage("idle");
  }

  return (
    <div id="downloader" className="w-full scroll-mt-24">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:p-2 sm:pl-4"
      >
        <div className="flex flex-1 items-center gap-2 px-1 sm:px-0">
          <Link2 size={18} aria-hidden="true" className="shrink-0 text-text-dim" />
          <label htmlFor="downloader-url" className="sr-only">
            Public video URL
          </label>
          <input
            id="downloader-url"
            type="url"
            inputMode="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here…"
            className="w-full bg-transparent py-2.5 text-sm text-text placeholder:text-text-dim focus:outline-none sm:text-base"
          />
        </div>
        <button
          type="submit"
          disabled={stage === "loading" || !url.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-2 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {stage === "loading" ? (
            <Loader2 size={16} aria-hidden="true" className="animate-spin" />
          ) : null}
          {stage === "loading" ? "Fetching…" : "Download"}
        </button>
      </form>

      <div
        aria-live="polite"
        className="mt-3 flex flex-wrap items-center gap-2 px-1 text-xs text-text-dim"
      >
        {detected?.supported ? (
          <span className="flex items-center gap-1.5 text-emerald-400">
            <PlatformBadge icon={detected.icon} color={detected.color} initial={detected.initial} size={18} />
            <CheckCircle2 size={13} />
            {detected.name} URL detected
          </span>
        ) : (
          <span>
            Supports YouTube, Instagram, TikTok, Facebook, X, Pinterest, Reddit, Threads, Snapchat
            Spotlight and Vimeo.
          </span>
        )}
      </div>

      {!compact && (
        <div className="mt-6">
          {stage === "loading" && (
            <div className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-surface p-5">
              <div className="flex gap-5">
                <div className="skeleton aspect-video w-56 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-3 w-16 rounded" />
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-text-dim">Fetching video information…</p>
            </div>
          )}

          {stage === "result" && info && <ResultCard url={url.trim()} info={info} />}

          {stage === "error" && (
            <ErrorState
              code={errorCode}
              message={errorMessage}
              onRetry={() => runExtract(url.trim())}
              onReset={reset}
            />
          )}
        </div>
      )}
    </div>
  );
}
