import { lookup } from "node:dns/promises";
import net from "node:net";

import { ExtractError } from "./types";

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;
  const [a, b] = parts;

  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // loopback
  if (a === 169 && b === 254) return true; // link-local / cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
  if (a === 192 && b === 0) return true; // 192.0.0.0/24, 192.0.2.0/24 reserved
  if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking range
  if (a >= 224) return true; // multicast + reserved (224+)

  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1") return true; // loopback
  if (lower.startsWith("fe80:") || lower.startsWith("fe8") || lower.startsWith("fec")) return true; // link-local
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local fc00::/7
  if (lower.startsWith("::ffff:")) {
    const mapped = lower.split(":").pop() ?? "";
    if (net.isIPv4(mapped)) return isPrivateIPv4(mapped);
  }
  return false;
}

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  if (net.isIPv6(ip)) return isPrivateIPv6(ip);
  return true; // unknown format, fail closed
}

/**
 * Blocks SSRF: only public http(s) hosts may be extracted from. Rejects
 * localhost, private/link-local/reserved IP ranges, and non-http schemes.
 */
export async function assertSafeUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new ExtractError("invalid_url", "That doesn't look like a valid URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ExtractError("invalid_url", "Only http and https links are supported.");
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "0.0.0.0") {
    throw new ExtractError("invalid_url", "That host isn't allowed.");
  }

  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new ExtractError("invalid_url", "That host isn't allowed.");
    }
    return url;
  }

  let records: { address: string }[];
  try {
    records = await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new ExtractError("source_unavailable", "Couldn't resolve that host.");
  }

  if (records.length === 0 || records.some((r) => isPrivateIp(r.address))) {
    throw new ExtractError("invalid_url", "That host isn't allowed.");
  }

  return url;
}
