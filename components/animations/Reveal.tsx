"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface RevealProps {
  children: React.ReactNode
  /** Direction the element travels in from. Default: "up". */
  direction?: "up" | "down" | "left" | "right"
  /** Travel distance in px. Default: 40. */
  distance?: number
  /** Seconds before the animation starts. Default: 0. */
  delay?: number
  /** Animation duration in seconds. Default: 0.6. */
  duration?: number
  /** Replay every time it scrolls into view, or only the first time. Default: true (once). */
  once?: boolean
  /** Fraction of the element that must be visible to trigger (0–1). Default: 0.2. */
  amount?: number
  className?: string
}

const offset = (direction: NonNullable<RevealProps["direction"]>, d: number) => {
  switch (direction) {
    case "up":
      return { y: d }
    case "down":
      return { y: -d }
    case "left":
      return { x: d }
    case "right":
      return { x: -d }
  }
}

/**
 * Reveals its children when they scroll into view. Same idea as `FadeIn`, but
 * triggered by the viewport instead of on mount — ideal for sections further
 * down the page: `<Reveal><Section /></Reveal>`.
 */
export default function Reveal({
  children,
  direction = "up",
  distance = 40,
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
  className,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...offset(direction, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
