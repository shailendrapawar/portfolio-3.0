import { renderShareCard } from "@/lib/og/shareCard"

// Same card, served for X/Twitter (summary_large_image). Config must be
// declared as literals here — Next can't statically parse re-exported config.
export const runtime = "nodejs"
export const alt = "Shailendra Pawar — Software Development Engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function TwitterImage() {
  return renderShareCard()
}
