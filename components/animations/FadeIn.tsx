"use client"

import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  /**
   * Controlled visibility. Omit for a plain on-mount entrance. When provided,
   * the element also animates *out* (reverse of its entrance) as `show` flips
   * to `false`, via AnimatePresence — ideal for toggled overlays/menus.
   */
  show?: boolean
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
 *
 * Pass `show` to get exit animations too: keep it rendered and toggle the flag
 * (`<FadeIn show={open}>...`) instead of conditionally mounting it.
 */
export default function FadeIn({
  children,
  show,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 16,
  className,
}: FadeInProps) {
  const hidden = { opacity: 0, ...offset(direction, distance) }
  const visible = { opacity: 1, x: 0, y: 0 }
  const transition = { duration, delay, ease: "easeOut" } as const

  // Controlled: animate both entrance and exit around `show`.
  if (show !== undefined) {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={hidden}
            animate={visible}
            exit={hidden}
            transition={transition}
            className={cn(className)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Uncontrolled: play once on mount.
  return (
    <motion.div
      initial={hidden}
      animate={visible}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
