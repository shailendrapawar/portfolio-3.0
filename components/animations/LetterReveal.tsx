"use client"

import { motion, type Variants } from "framer-motion"

import { cn } from "@/lib/utils"

interface LetterRevealProps {
  /** The text to animate, one letter at a time. */
  text: string
  /** Classes for the wrapping element (e.g. color, font). */
  className?: string
  /** Classes applied to every individual letter. */
  letterClassName?: string
  /** Seconds before the first letter animates. Default: 0. */
  delay?: number
  /** Gap in seconds between each letter. Default: 0.05. */
  stagger?: number
  /** Per-letter animation duration in seconds. Default: 0.4. */
  duration?: number
  /** Trigger on scroll into view instead of on mount. Default: false. */
  inView?: boolean
  /** (inView only) replay every time, or just once. Default: true (once). */
  once?: boolean
}

/**
 * Reveals text letter by letter with a staggered rise. Distances use `em`, so
 * the animation scales with whatever font size the text is rendered at.
 * Wrap a word/phrase: `<LetterReveal text={name} className="text-accent" />`.
 */
export default function LetterReveal({
  text,
  className,
  letterClassName,
  delay = 0,
  stagger = 0.05,
  duration = 0.4,
  inView = false,
  once = true,
}: LetterRevealProps) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }

  const letter: Variants = {
    hidden: { opacity: 0, y: "0.4em", rotate: 6 },
    visible: {
      opacity: 1,
      y: "0em",
      rotate: 0,
      transition: { duration, ease: "easeOut" },
    },
  }

  const trigger = inView
    ? ({ whileInView: "visible", viewport: { once } } as const)
    : ({ animate: "visible" } as const)

  return (
    <motion.span
      variants={container}
      initial="hidden"
      aria-label={text}
      className={cn("inline-block", className)}
      {...trigger}
    >
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          variants={letter}
          aria-hidden
          className={cn("inline-block whitespace-pre", letterClassName)}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  )
}
