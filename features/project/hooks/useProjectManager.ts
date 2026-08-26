import { useMemo, useState } from "react"

import { usePagination } from "@/hooks/usePagination"
import { useSearchProjects } from "./useSearchProjects"
import { useDeleteProject } from "./useDeleteProject"
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

  // Filter bar state. "all" => no category filter; search matches title,
  // description, or skills (case-insensitive). Filtering is client-side over
  // the already-loaded list.
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (projects as ProjectWithId[]).filter((project) => {
      const matchesCategory = category === "all" || project.category === category
      if (!matchesCategory) return false
      if (!q) return true
      const haystack = [
        project.title,
        project.description,
        ...(Array.isArray(project.skills) ? project.skills : []),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [projects, search, category])

  const { pageItems, ...pagination } = usePagination(filtered, 5)

  // The project pending permanent deletion (drives the confirm modal).
  const [deleteTarget, setDeleteTarget] = useState<ProjectWithId | null>(null)

  const {
    deleteProject,
    deleting,
    error: deleteError,
  } = useDeleteProject(() => {
    setDeleteTarget(null)
    searchProjects()
  })

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

  const requestDelete = (project: ProjectWithId) => setDeleteTarget(project)
  const cancelDelete = () => setDeleteTarget(null)
  const confirmDelete = async () => {
    if (deleteTarget?._id) await deleteProject(deleteTarget._id)
  }

  return {
    projects: pageItems,
    pagination,
    isLoading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    isOpen,
    setIsOpen,
    editing,
    openCreate,
    openEdit,
    handleSuccess,
    deleteTarget,
    deleting,
    deleteError,
    requestDelete,
    cancelDelete,
    confirmDelete,
  }
}
