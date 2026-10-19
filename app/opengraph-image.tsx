import { ImageResponse } from "next/og"
import { readFileSync } from "node:fs"
import { join } from "node:path"

// Social share card (WhatsApp, X/Twitter, LinkedIn, iMessage, Slack, …).
// Replaces the default favicon fallback so previews show the "S" logo.
export const runtime = "nodejs"
export const alt = "Shailendra Pawar — Software Development Engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// White "S" logo, inlined as a data URI so it renders inside the generated PNG.
const logo = readFileSync(join(process.cwd(), "public", "s-letter-dark.png"))
const logoSrc = `data:image/png;base64,${logo.toString("base64")}`

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
          gap: 30,
          background:
            "radial-gradient(circle at 50% 32%, #1e293b 0%, #0a0a0a 72%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={200}
          height={200}
          style={{ objectFit: "contain" }}
          alt=""
        />
        <div
          style={{
            display: "flex",
            fontSize: 74,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          Shailendra Pawar
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 40,
              height: 4,
              background: "#2563EB",
              borderRadius: 2,
            }}
          />
          <div style={{ display: "flex", fontSize: 36, color: "#94a3b8" }}>
            Software Development Engineer
          </div>
          <div
            style={{
              display: "flex",
              width: 40,
              height: 4,
              background: "#2563EB",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
