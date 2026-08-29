import Experience from "@/features/experience"
import { WorkExperienceService } from "@/features/experience/service"
import type { IWorkExperience } from "@/features/experience/model"

// ISR: statically cache the experience page and regenerate at most once per minute.
export const revalidate = 60

export default async function ExperiencePage() {
  // Fetched server-side so the page is statically cached and loads instantly.
  const { items } = await WorkExperienceService.search()
  // Mongoose docs aren't serializable across the server→client boundary.
  const experiences = JSON.parse(JSON.stringify(items)) as IWorkExperience[]

  return <Experience experiences={experiences} />
}
