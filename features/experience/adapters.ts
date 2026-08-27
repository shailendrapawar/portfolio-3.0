import type { IWorkExperience } from "./model"

// View-model consumed by the timeline UI (ExperienceTimeline). Dates are
// pre-formatted strings and skills is a comma-separated string.
export type IWorkExpirienceItem = {
  order: number
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  pointers?: string[]
  skills: string
  // Google Drive link to this company's credentials, shown when present.
  credentials?: string
  // LinkedIn URL/handle for the company, shown when present.
  linkedin?: string
  isCurrent: boolean
}

// Dates arrive as ISO strings over the API; show them as e.g. "August 2025".
function formatMonthYear(value: string | Date) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

/**
 * Adapts DB work-experience records to the shape the timeline UI expects.
 * The API already returns them sorted by start date descending, so `order`
 * just preserves that order.
 */
export function toTimelineItems(
  experiences: IWorkExperience[]
): IWorkExpirienceItem[] {
  return experiences.map((exp, index) => ({
    order: experiences.length - index,
    company: exp.company,
    position: exp.position,
    startDate: formatMonthYear(exp.startDate),
    endDate: exp.endDate ? formatMonthYear(exp.endDate) : undefined,
    description: exp.description,
    pointers: exp.pointers ?? [],
    skills: Array.isArray(exp.skills) ? exp.skills.join(",") : (exp.skills ?? ""),
    credentials: exp.credentials || undefined,
    linkedin: exp.linkedin || undefined,
    isCurrent: exp.isCurrent,
  }))
}
