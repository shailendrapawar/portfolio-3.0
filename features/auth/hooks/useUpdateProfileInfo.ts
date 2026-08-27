import { useEffect, useState } from "react"

import { useAuthStore } from "../store"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

/**
 * Owns the text profile-info flow (name, designation, bio): seeds fields from
 * the auth store, saves them to /api/profile, and syncs the store on success.
 */
export function useUpdateProfileInfo() {
  const user = useAuthStore((s) => s.user)
  const setProfileInfo = useAuthStore((s) => s.setProfileInfo)

  const [name, setName] = useState("")
  const [designation, setDesignation] = useState("")
  const [bio, setBio] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Seed the fields from the store once the user is known / changes identity.
  // Keyed on the id so re-saving (which replaces the user object) doesn't wipe
  // in-progress edits.
  useEffect(() => {
    if (!user) return
    setName(user.name ?? "")
    setDesignation(user.designation ?? "")
    setBio(user.bio ?? "")
  }, [user?._id])

  const handleSave = async () => {
    if (saving) return
    if (!name.trim()) {
      setError("Name is required.")
      return
    }
    setError("")
    setSuccess("")
    setSaving(true)

    const payload = {
      name: name.trim(),
      designation: designation.trim(),
      bio: bio.trim(),
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body: ApiResponse<unknown> = await res
        .json()
        .catch(() => null as unknown as ApiResponse<unknown>)

      if (!res.ok || !body?.success) {
        setError(
          typeof body?.message === "string"
            ? body.message
            : "Failed to update profile"
        )
        return
      }

      setProfileInfo(payload)
      setSuccess("Profile updated.")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return {
    name,
    setName,
    designation,
    setDesignation,
    bio,
    setBio,
    saving,
    error,
    success,
    handleSave,
  }
}
