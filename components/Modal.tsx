"use client"

import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type ModalProps = {
  /** Controlled open state. */
  open: boolean
  /** Called when the modal requests to open/close (backdrop, escape, close button). */
  onOpenChange: (open: boolean) => void
  /** The component to render inside the modal — e.g. a form. */
  children: React.ReactNode
  /** Optional heading shown at the top of the modal. */
  title?: React.ReactNode
  /** Optional supporting text under the title. */
  description?: React.ReactNode
  /** Extra classes for the popup container. */
  className?: string
}

/**
 * Reusable controlled modal. Pass any component (typically a form) as
 * `children`; it renders centered in a dialog with a backdrop.
 */
export default function Modal({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />

        <Dialog.Popup
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-lg outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            className
          )}
        >
          {(title || description) && (
            <div className="flex flex-col gap-1 pr-6">
              {title && (
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="text-sm text-muted-foreground">
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}

          <Dialog.Close
            className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label="Close"
          >
            <X className="size-4" />
          </Dialog.Close>

          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
