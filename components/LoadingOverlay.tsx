"use client"

import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type LoadingOverlayProps = {
  /** Whether the overlay is visible. */
  show: boolean
  /** Optional caption shown under the spinner. */
  label?: string
}

/**
 * Full-screen, blurred overlay with a large spinner — used for short auth
 * transitions (signing in / out). Always mounted so it can fade in/out smoothly
 * via opacity rather than popping in.
 */
export default function LoadingOverlay({ show, label }: LoadingOverlayProps) {
  return (
    <div
      aria-hidden={!show}
      role="status"
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-background/70 backdrop-blur-sm transition-opacity duration-300",
        show ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <span className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card shadow-lg">
        <Loader2 className="size-8 animate-spin text-primary" />
      </span>
      {label && (
        <p className="animate-pulse text-sm font-medium text-muted-foreground">
          {label}
        </p>
      )}
    </div>
  )
}
