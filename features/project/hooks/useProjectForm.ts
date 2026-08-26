import { useEffect, useState } from "react"

import { PROJECT_CATEGORY, PROJECT_STATUS } from "../constant"
import type { ICreateProjectPayload } from "../validators"
import type { IProject } from "../model"
import { useImageUpload } from "./useImageUpload"

export type ProjectWithId = IProject & { _id: string }

// The form keeps `skills` as a comma-separated string (what SkillsInput edits);
// it's converted to a string[] only when sending to the API.
type ProjectFormValues = Omit<ICreateProjectPayload, "skills"> & { skills: string }

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

const emptyValues: ProjectFormValues = {
  title: "",
  description: "",
  img: { url: "" },
  skills: "",
  category: PROJECT_CATEGORY.FRONTEND,
  live: "",
  github: "",
  isFeatured: false,
  status: PROJECT_STATUS.ACTIVE,
}

function toValues(project: ProjectWithId | null): ProjectFormValues {
  if (!project) return { ...emptyValues }
  return {
    title: project.title,
    description: project.description,
    img: { url: project.img?.url ?? "", id: project.img?.id ?? undefined },
    skills: Array.isArray(project.skills)
      ? project.skills.join(",")
      : (project.skills ?? ""),
    category: project.category,
    live: project.live ?? "",
    github: project.github,
    isFeatured: project.isFeatured,
    status: project.status,
  }
}

// Comma-separated string -> trimmed, de-duped array of skills.
function toSkillsArray(skills: string): string[] {
  const seen = new Set<string>()
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !seen.has(s) && seen.add(s))
}

type UseProjectFormArgs = {
  /** The project being edited, or null to create a new one. */
  project?: ProjectWithId | null
  /** Called after a successful create/update (e.g. refetch + close modal). */
  onSuccess?: () => void
}

export function useProjectForm({ project = null, onSuccess }: UseProjectFormArgs = {}) {
  const isEditing = Boolean(project?._id)

  const [values, setValues] = useState<ProjectFormValues>(() => toValues(project))
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { upload, uploading, error: imageError } = useImageUpload()

  // Re-seed the form whenever the target project changes.
  useEffect(() => {
    setValues(toValues(project))
    setError("")
  }, [project])

  const setField = <K extends keyof ProjectFormValues>(
    key: K,
    value: ProjectFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  // Uploads the picked file to Cloudinary, then stores its url + id on the form.
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const image = await upload(file)
    if (image) setValues((prev) => ({ ...prev, img: image }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url =
        isEditing && project ? `/api/project/${project._id}` : "/api/project"
      const method = isEditing ? "PATCH" : "POST"

      const payload: ICreateProjectPayload = {
        ...values,
        skills: toSkillsArray(values.skills),
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const body: ApiResponse<{ item: ProjectWithId }> = await res
        .json()
        .catch(() => null as unknown as ApiResponse<{ item: ProjectWithId }>)

      if (!res.ok || !body?.success) {
        setError(
          typeof body?.message === "string" ? body.message : "Failed to save project"
        )
        return
      }

      onSuccess?.()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return {
    values,
    setField,
    error,
    loading,
    isEditing,
    handleSubmit,
    handleImageChange,
    uploading,
    imageError,
  }
}
