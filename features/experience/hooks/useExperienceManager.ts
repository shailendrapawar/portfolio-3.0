import { useMemo, useState } from "react"

import { usePagination } from "@/hooks/usePagination"
import { useDebounce } from "@/hooks/useDebounce"
import { useSearchExperience } from "./useSearchExperience"
import { useDeleteExperience } from "./useDeleteExperience"
import type { ExperienceWithId } from "./useExperienceForm"

/**
 * Owns the manage-experience screen state: the full list plus the create/edit
 * modal (which entry is being edited and whether it's open) and the
 * delete-confirm flow.
 */
export function useExperienceManager() {
  const { experiences, isLoading, error, searchExperiences } = useSearchExperience()

  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<ExperienceWithId | null>(null)

  // Filter bar state. `status`: "all" | "current" | "past". Search matches
  // company, position, description, skills, or pointers (case-insensitive).
  // Filtering is client-side over the already-loaded list.
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")

  // Debounce so the list isn't re-filtered on every keystroke; the input stays
  // bound to the live `search` value.
  const debouncedSearch = useDebounce(search)

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    return (experiences as ExperienceWithId[]).filter((experience) => {
      const matchesStatus =
        status === "all" ||
        (status === "current" ? experience.isCurrent : !experience.isCurrent)
      if (!matchesStatus) return false
      if (!q) return true
      const haystack = [
        experience.company,
        experience.position,
        experience.description,
        ...(Array.isArray(experience.skills) ? experience.skills : []),
        ...(Array.isArray(experience.pointers) ? experience.pointers : []),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [experiences, debouncedSearch, status])

  const { pageItems, ...pagination } = usePagination(filtered, 5)

  // The entry pending permanent deletion (drives the confirm modal).
  const [deleteTarget, setDeleteTarget] = useState<ExperienceWithId | null>(null)

  const {
    deleteExperience,
    deleting,
    error: deleteError,
  } = useDeleteExperience(() => {
    setDeleteTarget(null)
    searchExperiences()
  })

  const openCreate = () => {
    setEditing(null)
    setIsOpen(true)
  }

  const openEdit = (experience: ExperienceWithId) => {
    setEditing(experience)
    setIsOpen(true)
  }

  const handleSuccess = () => {
    setIsOpen(false)
    setEditing(null)
    searchExperiences()
  }

  const requestDelete = (experience: ExperienceWithId) => setDeleteTarget(experience)
  const cancelDelete = () => setDeleteTarget(null)
  const confirmDelete = async () => {
    if (deleteTarget?._id) await deleteExperience(deleteTarget._id)
  }

  return {
    experiences: pageItems,
    pagination,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
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
