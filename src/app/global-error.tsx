"use client";

/**
 * Last-resort boundary: catches failures in the root layout itself, so it has
 * to render its own <html> and <body>. Styles are inlined because the layout
 * that imports the stylesheet is exactly what failed.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070b12",
          color: "#e5e7eb",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <main>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Something went wrong</h1>
          <p style={{ color: "#9ca3af", marginTop: "0.75rem" }}>
            The page failed to load. Reloading usually fixes it.
          </p>
          {error.digest && (
            <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.75rem" }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: "1.5rem",
              padding: "0.65rem 1.25rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#6366f1",
              color: "#fff",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
