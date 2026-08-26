import { useState } from "react"

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
    experiences: experiences as ExperienceWithId[],
    isLoading,
    error,
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
