import { useEffect, useState } from "react"

import type { ICreateWorkExperiencePayload } from "../validators"
import type { IWorkExperience } from "../model"

export type ExperienceWithId = IWorkExperience & { _id: string }

// The form keeps `skills` as a comma-separated string (SkillsInput) and
// `pointers` as a newline-separated string (a textarea); both are converted to
// string[] only when sending to the API. Dates are held as `Date | undefined`
// (undefined until picked) and serialized to ISO strings on submit.
type ExperienceFormValues = Omit<
  ICreateWorkExperiencePayload,
  "skills" | "pointers" | "startDate" | "endDate"
> & {
  skills: string
  pointers: string
  startDate?: Date
  endDate?: Date
}

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

const emptyValues: ExperienceFormValues = {
  company: "",
  position: "",
  startDate: undefined,
  endDate: undefined,
  description: "",
  pointers: "",
  skills: "",
  isCurrent: false,
}

function toValues(experience: ExperienceWithId | null): ExperienceFormValues {
  if (!experience) return { ...emptyValues }
  return {
    company: experience.company,
    position: experience.position,
    // Dates arrive as ISO strings over the API; normalize to Date objects.
    startDate: experience.startDate ? new Date(experience.startDate) : undefined,
    endDate: experience.endDate ? new Date(experience.endDate) : undefined,
    description: experience.description,
    pointers: Array.isArray(experience.pointers)
      ? experience.pointers.join("\n")
      : (experience.pointers ?? ""),
    skills: Array.isArray(experience.skills)
      ? experience.skills.join(",")
      : (experience.skills ?? ""),
    isCurrent: experience.isCurrent,
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

// Newline-separated string -> trimmed array of pointers (blank lines dropped).
function toPointersArray(pointers: string): string[] {
  return pointers
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

type UseExperienceFormArgs = {
  /** The experience being edited, or null to create a new one. */
  experience?: ExperienceWithId | null
  /** Called after a successful create/update (e.g. refetch + close modal). */
  onSuccess?: () => void
}

export function useExperienceForm({
  experience = null,
  onSuccess,
}: UseExperienceFormArgs = {}) {
  const isEditing = Boolean(experience?._id)

  const [values, setValues] = useState<ExperienceFormValues>(() =>
    toValues(experience)
  )
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Re-seed the form whenever the target experience changes.
  useEffect(() => {
    setValues(toValues(experience))
    setError("")
  }, [experience])

  const setField = <K extends keyof ExperienceFormValues>(
    key: K,
    value: ExperienceFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const startDate = values.startDate
    if (!startDate) {
      setError("Start date is required")
      return
    }

    setLoading(true)

    try {
      const url =
        isEditing && experience
          ? `/api/work-experience/${experience._id}`
          : "/api/work-experience"
      const method = isEditing ? "PATCH" : "POST"

      const payload: ICreateWorkExperiencePayload = {
        ...values,
        startDate,
        // A current role has no end date.
        endDate: values.isCurrent ? undefined : values.endDate,
        skills: toSkillsArray(values.skills),
        pointers: toPointersArray(values.pointers),
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const body: ApiResponse<{ item: ExperienceWithId }> = await res
        .json()
        .catch(() => null as unknown as ApiResponse<{ item: ExperienceWithId }>)

      if (!res.ok || !body?.success) {
        setError(
          typeof body?.message === "string"
            ? body.message
            : "Failed to save work experience"
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
  }
}
