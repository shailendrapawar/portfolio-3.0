import { useEffect, useState } from "react"

import { useImageUpload } from "@/features/project/hooks/useImageUpload"
import { useAuthStore } from "../store"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

/**
 * Owns the profile-picture update flow: pick a file → preview → upload to
 * Cloudinary (via useImageUpload) → persist { url, id } to /api/profile →
 * sync the auth store. Components just render what this returns.
 */
export function useUpdateProfilePicture() {
  const currentUrl = useAuthStore((s) => s.user?.profilePicture?.url)
  const setProfilePicture = useAuthStore((s) => s.setProfilePicture)

  const { upload, uploading, error: uploadError } = useImageUpload()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Build/revoke the local object URL as the selected file changes.
  useEffect(() => {
    if (!file) {
      setPreview("")
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const selectFile = (next: File | null) => {
    setError("")
    setSuccess("")
    setFile(next)
  }

  const handleSave = async () => {
    if (!file || saving || uploading) return
    setError("")
    setSuccess("")
    setSaving(true)

    try {
      const image = await upload(file)
      if (!image) {
        setError(uploadError || "Failed to upload image")
        return
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePicture: image }),
      })
      const body: ApiResponse<unknown> = await res
        .json()
        .catch(() => null as unknown as ApiResponse<unknown>)

      if (!res.ok || !body?.success) {
        setError(
          typeof body?.message === "string"
            ? body.message
            : "Failed to update profile picture"
        )
        return
      }

      setProfilePicture(image)
      setFile(null)
      setSuccess("Profile picture updated.")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return {
    currentUrl,
    preview,
    file,
    selectFile,
    handleSave,
    busy: uploading || saving,
    error,
    success,
  }
}
