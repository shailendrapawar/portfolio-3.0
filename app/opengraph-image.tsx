import { renderShareCard } from "@/lib/og/shareCard"

// Social share card (WhatsApp, X/Twitter, LinkedIn, iMessage, Slack, …).
// Replaces the default favicon fallback so previews show the "S" logo.
export const runtime = "nodejs"
export const alt = "Shailendra Pawar — Software Development Engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return renderShareCard()
}
