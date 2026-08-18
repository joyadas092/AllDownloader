import { ImageResponse } from "next/og";

import { brand } from "@/lib/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#070b12",
          backgroundImage:
            "radial-gradient(circle at 25% 15%, rgba(29,124,242,0.38), transparent 55%), radial-gradient(circle at 80% 85%, rgba(76,195,255,0.28), transparent 55%)",
        }}
      >
        <div style={{ display: "flex", marginBottom: 32 }}>
          <svg width="128" height="128" viewBox="0 0 64 64">
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
        <div style={{ fontSize: 64, fontWeight: 700, color: "white" }}>{brand.name}</div>
        <div style={{ fontSize: 28, color: "#9ca3af", marginTop: 16 }}>{brand.tagline}</div>
      </div>
    ),
    { ...size }
  );
}
