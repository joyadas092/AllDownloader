import { platformIcons } from "@/components/icons/PlatformIcons";

/**
 * Relative luminance of a #rrggbb colour, per WCAG. Used to decide whether a
 * tile needs a light or dark mark — Snapchat yellow and TikTok cyan are far too
 * bright to carry a white logo.
 */
function luminance(hex: string): number {
  const channels = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/**
 * A platform's official mark on a tile tinted with that platform's own colour.
 *
 * Brand paths are single-colour, so the mark is drawn in whichever of light or
 * dark reads against the tile. Entries with no mark fall back to a letter.
 */
export default function PlatformBadge({
  icon,
  color,
  initial,
  size = 40,
  className = "",
}: {
  /** Key from PlatformIcons, e.g. "youtube". */
  icon?: string;
  color: string;
  initial?: string;
  size?: number;
  className?: string;
}) {
  const data = icon ? platformIcons[icon] : undefined;
  const foreground = /^#[0-9a-f]{6}$/i.test(color) && luminance(color) > 0.45 ? "#0b1020" : "#ffffff";

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl font-bold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        color: foreground,
        background: `linear-gradient(135deg, ${color}, ${color}99)`,
      }}
      aria-hidden
    >
      {data ? (
        <svg
          viewBox="0 0 24 24"
          width={size * 0.56}
          height={size * 0.56}
          fill="currentColor"
          focusable="false"
        >
          <path d={data.path} />
        </svg>
      ) : (
        initial
      )}
    </div>
  );
}
