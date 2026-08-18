import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { env } from "@/lib/env";
import type { DownloadJob } from "./types";

const jobs = new Map<string, DownloadJob>();
let activeCount = 0;
/** Active (queued/downloading) job count per client IP. */
const activeByIp = new Map<string, number>();

export function getTempDir(): string {
  const dir = path.resolve(/* turbopackIgnore: true */ process.cwd(), env.tempDir);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function activeJobCount(): number {
  return activeCount;
}

export type StartRejection = "server_busy" | "ip_busy";

/**
 * Global concurrency guards the box; the per-IP guard stops a single visitor
 * from occupying every slot (and every yt-dlp process) on their own.
 */
export function canStartJob(ip: string): StartRejection | null {
  if (activeCount >= env.maxConcurrentDownloads) return "server_busy";
  if ((activeByIp.get(ip) ?? 0) >= env.maxConcurrentJobsPerIp) return "ip_busy";
  return null;
}

export function createJob(ip: string): DownloadJob {
  const job: DownloadJob = {
    id: randomUUID(),
    ip,
    status: "queued",
    pct: 0,
    speed: null,
    eta: null,
    filepath: null,
    filename: null,
    error: null,
    createdAt: Date.now(),
  };
  jobs.set(job.id, job);
  activeCount += 1;
  activeByIp.set(ip, (activeByIp.get(ip) ?? 0) + 1);
  return job;
}

function releaseSlot(job: DownloadJob): void {
  activeCount = Math.max(0, activeCount - 1);
  const remaining = (activeByIp.get(job.ip) ?? 1) - 1;
  if (remaining > 0) activeByIp.set(job.ip, remaining);
  else activeByIp.delete(job.ip);
}

export function getJob(id: string): DownloadJob | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, patch: Partial<DownloadJob>): void {
  const job = jobs.get(id);
  if (!job) return;
  const wasActive = job.status === "queued" || job.status === "downloading";
  Object.assign(job, patch);

  if (wasActive && (job.status === "done" || job.status === "error" || job.status === "expired")) {
    releaseSlot(job);
  }
}

function deleteJobFile(job: DownloadJob): void {
  if (!job.filepath) return;
  try {
    fs.rmSync(job.filepath, { force: true });
    fs.rmSync(path.dirname(job.filepath), { recursive: true, force: true });
  } catch {
    // best effort
  }
}

/**
 * Hands out a finished job exactly once and forgets it, so the download URL
 * cannot be replayed. The caller owns the file from here and must pass the
 * returned job to `cleanupJob` when the transfer ends.
 */
export function consumeJobFile(id: string): DownloadJob | undefined {
  const job = jobs.get(id);
  if (!job) return undefined;
  jobs.delete(id);
  return job;
}

/**
 * Deletes a job's file and directory. Takes the job object rather than an id
 * because the common caller is the download route, which has already consumed
 * (and therefore un-registered) the job — an id lookup would find nothing and
 * silently leak the file.
 */
export function cleanupJob(job: DownloadJob): void {
  deleteJobFile(job);
  jobs.delete(job.id);
}

/**
 * Every finished job gets a TTL. If the visitor never collects the file it
 * moves to `expired` and the bytes leave the disk, so nothing accumulates.
 */
export function scheduleJobCleanup(id: string): void {
  setTimeout(() => {
    const job = jobs.get(id);
    if (!job) return;
    job.status = "expired";
    deleteJobFile(job);
    jobs.delete(id);
  }, env.tempFileTtlSeconds * 1000).unref();
}


/** Wipes the entire temp download directory and resets in-memory job state. */
export function clearTempDirCompletely(): void {
  const dir = getTempDir();
  for (const name of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, name), { recursive: true, force: true });
  }
  jobs.clear();
  activeByIp.clear();
  activeCount = 0;
}

/**
 * Defensive sweep for job folders on disk older than maxAgeSeconds that
 * aren't backing an active in-memory job — covers files orphaned by a
 * server crash/restart between download completion and TTL cleanup.
 */
export function sweepOrphanedFiles(maxAgeSeconds: number): void {
  const dir = getTempDir();
  const trackedDirs = new Set(
    [...jobs.values()].filter((j) => j.filepath).map((j) => path.dirname(j.filepath as string))
  );
  const now = Date.now();

  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return;
  }

  for (const name of entries) {
    const entryPath = path.join(dir, name);
    if (trackedDirs.has(entryPath)) continue;
    try {
      const stat = fs.statSync(entryPath);
      if (now - stat.mtimeMs > maxAgeSeconds * 1000) {
        fs.rmSync(entryPath, { recursive: true, force: true });
      }
    } catch {
      // best effort
    }
  }
}
