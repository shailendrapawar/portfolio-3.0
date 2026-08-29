"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  /** Seconds before the animation starts. Default: 0. */
  delay?: number
  /** Animation duration in seconds. Default: 0.5. */
  duration?: number
  /** Direction the element travels in from. `none` = pure opacity. Default: "up". */
  direction?: "up" | "down" | "left" | "right" | "none"
  /** Travel distance in px for the chosen direction. Default: 16. */
  distance?: number
  className?: string
}

const offset = (direction: NonNullable<FadeInProps["direction"]>, d: number) => {
  switch (direction) {
    case "up":
      return { y: d }
    case "down":
      return { y: -d }
    case "left":
      return { x: d }
    case "right":
      return { x: -d }
    default:
      return {}
  }
}

/**
 * Fades its children in on mount, optionally sliding from a direction.
 * Wrap any element: `<FadeIn><Card /></FadeIn>`.
 */
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 16,
  className,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...offset(direction, distance) }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
