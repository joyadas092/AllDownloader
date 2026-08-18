/**
 * The OnlineMP4 mark: a glossy blue film reel with a play head, and a download
 * arrow breaking out of the bottom edge.
 *
 * Drawn as inline SVG rather than shipped as a bitmap so it stays sharp at
 * every size, costs no extra request, and can be recoloured from CSS. The
 * gradient ids are namespaced because several instances can share a page.
 */
export default function BrandLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="OnlineMP4"
      className={className}
    >
      <defs>
        <linearGradient id="omp4-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4cc3ff" />
          <stop offset="55%" stopColor="#1d7cf2" />
          <stop offset="100%" stopColor="#0b46c4" />
        </linearGradient>
        <linearGradient id="omp4-play" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9fdcff" />
          <stop offset="100%" stopColor="#1e86f5" />
        </linearGradient>
        <linearGradient id="omp4-arrow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cfe8ff" />
        </linearGradient>
      </defs>

      {/* Outer reel */}
      <circle cx="32" cy="32" r="30" fill="url(#omp4-ring)" />
      <circle cx="32" cy="32" r="24" fill="#05173d" />

      {/* Film sprockets */}
      <g fill="#dceeff">
        {[16, 25, 34, 43].map((y) => (
          <rect key={`l${y}`} x="11.5" y={y - 3} width="6" height="6" rx="1.6" />
        ))}
        {[16, 25, 34, 43].map((y) => (
          <rect key={`r${y}`} x="46.5" y={y - 3} width="6" height="6" rx="1.6" />
        ))}
      </g>

      {/* Play head */}
      <path
        d="M26 17.5 L45 29.5 a2.4 2.4 0 0 1 0 4 L26 45.5 a2.4 2.4 0 0 1 -3.6 -2 V19.5 a2.4 2.4 0 0 1 3.6 -2 Z"
        fill="url(#omp4-play)"
        stroke="#0b46c4"
        strokeWidth="1.6"
      />

      {/* Download arrow, breaking the reel's lower edge */}
      <path
        d="M27 38 h10 a2 2 0 0 1 2 2 v8 h4.5 a1.4 1.4 0 0 1 1 2.4 l-9.5 10.2 a2 2 0 0 1 -2.9 0 L21.6 50.4 a1.4 1.4 0 0 1 1 -2.4 H27 v-8 a2 2 0 0 1 2 -2 Z"
        fill="url(#omp4-arrow)"
        stroke="#0b46c4"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
