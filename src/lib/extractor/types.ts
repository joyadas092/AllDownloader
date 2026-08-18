export type ExtractErrorCode =
  | "unsupported_url"
  | "invalid_url"
  | "private_video"
  | "source_unavailable"
  | "rate_limited"
  /** The source is demanding sign-in from us, not from the visitor. */
  | "auth_required"
  | "extraction_error"
  | "server_error";

export class ExtractError extends Error {
  code: ExtractErrorCode;

  constructor(code: ExtractErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "ExtractError";
  }
}

export interface FormatOption {
  format_id: string;
  quality: string;
  extension: string;
  filesize: number | null;
  is_audio: boolean;
  /**
   * When present, the file is already a single complete stream on the source
   * CDN and the browser can fetch it directly (via the edge proxy or our
   * pass-through endpoint). No yt-dlp job, no temp file, no server download.
   */
  direct_url?: string | null;
}

export interface VideoInfo {
  success: true;
  platform: string;
  title: string;
  thumbnail: string | null;
  duration: number | null;
  formats: FormatOption[];
}

export type DownloadStatus = "queued" | "downloading" | "done" | "error" | "expired";

export interface DownloadJob {
  id: string;
  ip: string;
  status: DownloadStatus;
  pct: number;
  speed: string | null;
  eta: string | null;
  filepath: string | null;
  filename: string | null;
  error: string | null;
  createdAt: number;
}
