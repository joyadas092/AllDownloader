import { env } from "@/lib/env";

const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;

/** In-memory fixed-window limiter, good for a single Node instance. */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);

  if (hits.size > 5000) {
    for (const [key, values] of hits) {
      if (values.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return timestamps.length <= env.rateLimitPerMinute;
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
