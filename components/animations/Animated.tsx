"use client"

import { motion, type Variants } from "framer-motion"

import { cn } from "@/lib/utils"

/** Preset entrance animations. Add more here and they're instantly usable. */
const presets = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -64 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 64 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -8, scale: 0.96 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
} satisfies Record<string, Variants>

export type AnimationType = keyof typeof presets

interface AnimatedProps {
  children: React.ReactNode
  /** Which preset to play. Default: "fadeInUp". */
  type?: AnimationType
  /** `mount` plays immediately; `inView` plays on scroll into view. Default: "mount". */
  trigger?: "mount" | "inView"
  /** Seconds before the animation starts. Default: 0. */
  delay?: number
  /** Animation duration in seconds. Default: 0.5. */
  duration?: number
  /** (inView only) replay every time, or just once. Default: true (once). */
  once?: boolean
  /** (inView only) fraction visible before triggering (0–1). Default: 0.2. */
  amount?: number
  className?: string
}

/**
 * Flexible catch-all wrapper — pick any preset via the `type` prop when
 * `FadeIn` / `Reveal` don't fit: `<Animated type="zoomIn">...</Animated>`.
 * All props fall back to sensible defaults.
 */
export default function Animated({
  children,
  type = "fadeInUp",
  trigger = "mount",
  delay = 0,
  duration = 0.5,
  once = true,
  amount = 0.2,
  className,
}: AnimatedProps) {
  const trigger_props =
    trigger === "inView"
      ? ({ whileInView: "visible", viewport: { once, amount } } as const)
      : ({ animate: "visible" } as const)

  return (
    <motion.div
      variants={presets[type]}
      initial="hidden"
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
      {...trigger_props}
    >
      {children}
    </motion.div>
  )
}
