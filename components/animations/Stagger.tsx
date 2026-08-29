"use client"

import { motion, type Variants } from "framer-motion"

import { cn } from "@/lib/utils"

interface StaggerProps {
  children: React.ReactNode
  /** Gap in seconds between each child's animation. Default: 0.1. */
  stagger?: number
  /** Delay in seconds before the first child animates. Default: 0. */
  delay?: number
  /** Trigger on scroll into view instead of on mount. Default: true. */
  inView?: boolean
  /** (inView only) replay every time, or just once. Default: true (once). */
  once?: boolean
  /** (inView only) fraction visible before triggering (0–1). Default: 0.2. */
  amount?: number
  className?: string
}

interface StaggerItemProps {
  children: React.ReactNode
  /** Travel distance in px the item rises from. Default: 20. */
  distance?: number
  /** Item animation duration in seconds. Default: 0.5. */
  duration?: number
  className?: string
}

/**
 * Container that reveals its children one after another. Wrap the list, and
 * wrap each child in `StaggerItem`:
 *
 *   <Stagger>
 *     {items.map((i) => (
 *       <StaggerItem key={i.id}><Card {...i} /></StaggerItem>
 *     ))}
 *   </Stagger>
 */
export default function Stagger({
  children,
  stagger = 0.1,
  delay = 0,
  inView = true,
  once = true,
  amount = 0.2,
  className,
}: StaggerProps) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }

  const trigger = inView
    ? ({ whileInView: "visible", viewport: { once, amount } } as const)
    : ({ animate: "visible" } as const)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      className={cn(className)}
      {...trigger}
    >
      {children}
    </motion.div>
  )
}

/** A single item inside `Stagger` — inherits the container's orchestration. */
export function StaggerItem({
  children,
  distance = 20,
  duration = 0.5,
  className,
}: StaggerItemProps) {
  const item: Variants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: "easeOut" },
    },
  }

  return (
    <motion.div variants={item} className={cn(className)}>
      {children}
    </motion.div>
  )
}
