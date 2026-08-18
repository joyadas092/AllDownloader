import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05173d",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" fill="#1d7cf2" />
          <circle cx="32" cy="32" r="24" fill="#05173d" />
          <g fill="#dceeff">
            <rect x="11.5" y="21" width="6" height="6" rx="1.6" />
            <rect x="11.5" y="31" width="6" height="6" rx="1.6" />
            <rect x="46.5" y="21" width="6" height="6" rx="1.6" />
            <rect x="46.5" y="31" width="6" height="6" rx="1.6" />
          </g>
          <path d="M25 18 L45 30 L45 34 L25 46 Z" fill="#7fd0ff" />
          <path
            d="M27 38 h10 v10 h6 l-11 12 l-11 -12 h6 z"
            fill="#ffffff"
            stroke="#0b46c4"
            strokeWidth="2"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
