import Projects from "@/features/project"
import { ProjectService } from "@/features/project/service"
import type { IProject } from "@/features/project/model"

// ISR: statically cache the all-projects page and regenerate at most once per minute.
export const revalidate = 60

export default async function ProjectsPage() {
  // Fetched server-side so the page is statically cached and loads instantly.
  const { items } = await ProjectService.search({})
  // Mongoose docs aren't serializable across the server→client boundary.
  const projects = JSON.parse(JSON.stringify(items)) as IProject[]

  return <Projects projects={projects} />
}
