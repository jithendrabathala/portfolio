import { ImageResponse } from "next/og";
import { profile, siteMeta } from "@/content/site";

export const alt = siteMeta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time. Deliberately plain: OG images are rendered by
 * Satori, which supports only a subset of CSS — no custom shaders, no
 * backdrop-filter, and flexbox only. Matching the site's HUD framing with
 * borders keeps it recognisable without fighting those limits.
 */
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0f0f14",
        color: "#f5f5f7",
        padding: 64,
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#9a9aa5",
        }}
      >
        <span>{profile.role}</span>
        <span>{profile.location}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -1,
            textTransform: "uppercase",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 30,
            color: "#9a9aa5",
            maxWidth: 900,
          }}
        >
          {profile.tagline}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 20,
          color: "#e08a45",
        }}
      >
        <div style={{ width: 64, height: 2, backgroundColor: "#e08a45" }} />
        <span>{profile.email}</span>
      </div>
    </div>,
    size,
  );
}
