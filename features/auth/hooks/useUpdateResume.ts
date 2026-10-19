import { useEffect, useState } from "react"

import { getResumeUrls } from "@/lib/data/resume"
import { useAuthStore } from "../store"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

/**
 * Owns the resume-link flow for the admin dashboard: holds the modal open state
 * and the link input, derives a live preview from what's typed, saves it to
 * /api/profile, and syncs the auth store on success.
 */
export function useUpdateResume() {
  const user = useAuthStore((s) => s.user)
  const setResumeUrl = useAuthStore((s) => s.setResumeUrl)

  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Seed the field from the store once the user is known / changes identity.
  useEffect(() => {
    if (!user) return
    setUrl(user.resumeUrl ?? "")
  }, [user?._id])

  // The currently-saved link, used to show/hide the "current resume" hint.
  const savedUrl = user?.resumeUrl ?? ""

  // Live preview of whatever is typed — rewritten to an embeddable URL.
  const preview = getResumeUrls(url)

  // Reset transient messages and re-seed the input every time it's opened.
  const openModal = () => {
    setError("")
    setSuccess("")
    setUrl(user?.resumeUrl ?? "")
    setOpen(true)
  }

  const handleSave = async () => {
    if (saving) return

    const value = url.trim()
    // Empty clears the link; a non-empty value must look like a URL (the server
    // enforces this too, but we fail fast for a nicer message).
    if (value && !/^https?:\/\//i.test(value)) {
      setError("Enter a valid URL starting with http:// or https://")
      return
    }

    setError("")
    setSuccess("")
    setSaving(true)

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: value }),
      })
      const body: ApiResponse<unknown> = await res
        .json()
        .catch(() => null as unknown as ApiResponse<unknown>)

      if (!res.ok || !body?.success) {
        setError(
          typeof body?.message === "string"
            ? body.message
            : "Failed to update resume"
        )
        return
      }

      setResumeUrl(value)
      setSuccess(value ? "Resume link saved." : "Resume link removed.")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return {
    open,
    setOpen,
    openModal,
    url,
    setUrl,
    savedUrl,
    preview,
    saving,
    error,
    success,
    handleSave,
  }
}
