import Link from "next/link";
import { AlertTriangle, Lock, RefreshCw, Ban, Clock, ServerCrash, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ERROR_MAP: Record<string, { icon: LucideIcon; title: string; message: string }> = {
  unsupported_url: {
    icon: Ban,
    title: "This platform isn't supported yet",
    message: "We couldn't recognize a downloadable video at that link.",
  },
  invalid_url: {
    icon: AlertTriangle,
    title: "That doesn't look like a valid link",
    message: "Double check you've pasted the full video URL.",
  },
  private_video: {
    icon: Lock,
    title: "Unable to access this video",
    message: "The video may be private, unavailable, or temporarily blocked by the source platform.",
  },
  source_unavailable: {
    icon: AlertTriangle,
    title: "Video unavailable",
    message: "It may have been deleted, region-locked, or the link is no longer valid.",
  },
  rate_limited: {
    icon: Clock,
    title: "Too many requests",
    message: "Please wait a moment before trying again.",
  },
  extraction_error: {
    icon: RefreshCw,
    title: "Temporary extraction error",
    message: "Something went wrong reading that link. It usually works on a retry.",
  },
  server_error: {
    icon: ServerCrash,
    title: "Server error",
    message: "Something went wrong on our end. Please try again shortly.",
  },
};

export default function ErrorState({
  code,
  message,
  onRetry,
  onReset,
}: {
  code: string;
  message?: string;
  onRetry: () => void;
  onReset: () => void;
}) {
  const info = ERROR_MAP[code] ?? ERROR_MAP.server_error;
  const Icon = info.icon;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="animate-fade-up rounded-2xl border border-border bg-surface p-8 text-center"
    >
      <div
        aria-hidden="true"
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-400"
      >
        <Icon size={26} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-text">{info.title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-text-muted">{message || info.message}</p>
      {code === "unsupported_url" && (
        <p className="mx-auto mt-3 max-w-sm text-sm text-text-dim">
          Check the{" "}
          <Link href="/online-video-downloader" className="text-primary-2 underline underline-offset-2">
            list of supported platforms
          </Link>{" "}
          to see what works.
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-gradient-to-r from-primary to-primary-2 px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:text-text"
        >
          <X size={15} />
          Paste Another URL
        </button>
      </div>
    </div>
  );
}
