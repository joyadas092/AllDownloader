export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { clearTempDirCompletely, sweepOrphanedFiles } = await import("@/lib/extractor/jobs");
  const { env } = await import("@/lib/env");

  clearTempDirCompletely();
  console.log("[startup] cleared tmp-downloads");

  // Anything on disk older than two TTLs has no live job behind it.
  const maxAgeSeconds = Math.max(env.tempFileTtlSeconds * 2, 600);
  setInterval(() => {
    sweepOrphanedFiles(maxAgeSeconds);
  }, env.cleanupIntervalSeconds * 1000).unref();

  const shutdown = (signal: string) => {
    clearTempDirCompletely();
    console.log(`[shutdown:${signal}] cleared tmp-downloads`);
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}
