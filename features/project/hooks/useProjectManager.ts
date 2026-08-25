import { useState } from "react"

import { useSearchProjects } from "./useSearchProjects"
import type { ProjectWithId } from "./useProjectForm"

/**
 * Owns the manage-projects screen state: the full project list plus the
 * create/edit modal (which project is being edited and whether it's open).
 */
export function useProjectManager() {
  // Empty query => the API returns all projects (no category/status filter).
  const { projects, isLoading, error, searchProjects } = useSearchProjects("")

  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<ProjectWithId | null>(null)

  const openCreate = () => {
    setEditing(null)
    setIsOpen(true)
  }

  const openEdit = (project: ProjectWithId) => {
    setEditing(project)
    setIsOpen(true)
  }

  const handleSuccess = () => {
    setIsOpen(false)
    setEditing(null)
    searchProjects()
  }

  return {
    projects: projects as ProjectWithId[],
    isLoading,
    error,
    isOpen,
    setIsOpen,
    editing,
    openCreate,
    openEdit,
    handleSuccess,
  }
}
