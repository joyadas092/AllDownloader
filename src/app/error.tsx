"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

import Container from "@/components/Container";

/**
 * Route-level error boundary. Next 16 passes `retry`, which re-renders the
 * failed segment — no full page reload needed.
 */
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-xl text-center">
        <p className="gradient-text text-6xl font-bold sm:text-7xl">500</p>
        <h1 className="mt-4 text-2xl font-bold text-text sm:text-3xl">Something went wrong</h1>
        <p className="mt-4 text-text-muted">
          This one is on us, not on your link. Try again — if it keeps failing, the downloader on the
          home page is the fastest way back to working.
        </p>

        {error.digest && (
          <p className="mt-4 font-mono text-xs text-text-dim">Reference: {error.digest}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => retry()}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-2 px-5 py-2.5 font-medium text-white"
          >
            <RefreshCw size={15} aria-hidden="true" />
            Try again
          </button>
          <Link href="/" className="text-text-muted hover:text-text">
            Back to the downloader
          </Link>
          <Link href="/contact" className="text-text-muted hover:text-text">
            Report this
          </Link>
        </div>
      </Container>
    </section>
  );
}
