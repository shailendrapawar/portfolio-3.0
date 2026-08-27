import { useState } from "react"

// Owns the open/close state for the full-screen resume preview modal.
export function useResumeModal() {
  const [open, setOpen] = useState(false)

  return {
    open,
    setOpen,
    openModal: () => setOpen(true),
    closeModal: () => setOpen(false),
  }
}
