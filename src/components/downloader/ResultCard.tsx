import Image from "next/image";
import { Clock } from "lucide-react";

import { humanDuration } from "@/lib/format-utils";
import type { VideoInfo } from "@/lib/extractor/types";
import FormatRow from "./FormatRow";

export default function ResultCard({ url, info }: { url: string; info: VideoInfo }) {
  const videoFormats = info.formats.filter((f) => !f.is_audio);
  const audioFormats = info.formats.filter((f) => f.is_audio);
  const duration = humanDuration(info.duration);

  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-col gap-5 p-5 sm:flex-row">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-bg-soft sm:w-56">
          {info.thumbnail ? (
            <Image
              src={info.thumbnail}
              alt={info.title}
              fill
              unoptimized
              className="object-cover"
              sizes="224px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-dim">No preview</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-primary-2">{info.platform}</p>
          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-text sm:text-lg">{info.title}</h3>
          {duration && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-text-dim">
              <Clock size={14} />
              {duration}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5 border-t border-border p-5">
        {videoFormats.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-dim">
              Available Downloads
            </p>
            <div className="space-y-2">
              {videoFormats.map((f) => (
                <FormatRow key={f.format_id} url={url} format={f} />
              ))}
            </div>
          </div>
        )}

        {audioFormats.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-dim">Audio</p>
            <div className="space-y-2">
              {audioFormats.map((f) => (
                <FormatRow key={f.format_id} url={url} format={f} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
