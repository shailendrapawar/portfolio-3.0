import { useEffect, useState } from "react"

import { PROJECT_CATEGORY, PROJECT_STATUS } from "../constant"
import type { ICreateProjectPayload } from "../validators"
import type { IProject } from "../model"

export type ProjectWithId = IProject & { _id: string }

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

const emptyValues: ICreateProjectPayload = {
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

function toValues(project: ProjectWithId | null): ICreateProjectPayload {
  if (!project) return { ...emptyValues }
  return {
    title: project.title,
    description: project.description,
    img: { url: project.img?.url ?? "", id: project.img?.id ?? undefined },
    skills: project.skills,
    category: project.category,
    live: project.live ?? "",
    github: project.github,
    isFeatured: project.isFeatured,
    status: project.status,
  }
}

type UseProjectFormArgs = {
  /** The project being edited, or null to create a new one. */
  project?: ProjectWithId | null
  /** Called after a successful create/update (e.g. refetch + close modal). */
  onSuccess?: () => void
}

export function useProjectForm({ project = null, onSuccess }: UseProjectFormArgs = {}) {
  const isEditing = Boolean(project?._id)

  const [values, setValues] = useState<ICreateProjectPayload>(() => toValues(project))
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Re-seed the form whenever the target project changes.
  useEffect(() => {
    setValues(toValues(project))
    setError("")
  }, [project])

  const setField = <K extends keyof ICreateProjectPayload>(
    key: K,
    value: ICreateProjectPayload[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url =
        isEditing && project ? `/api/project/${project._id}` : "/api/project"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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

  return { values, setField, error, loading, isEditing, handleSubmit }
}
