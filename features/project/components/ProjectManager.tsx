"use client"

import Image from "next/image"
import { Pencil, Plus, Trash2 } from "lucide-react"

import Modal from "@/components/Modal"
import { Button } from "@/components/ui/button"

import { useProjectManager } from "../hooks/useProjectManager"
import ProjectForm from "./ProjectForm"

const DEFAULT_IMG =
  "https://res.cloudinary.com/soty762i/image/upload/v1787680320/defualt-project-img.jpg"

export default function ProjectManager() {
  const {
    projects,
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
  } = useProjectManager()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New project
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <p className="text-sm text-muted-foreground">No projects yet.</p>
      )}

      <ul className="flex flex-col gap-2">
        {projects.map((project) => (
          <li
            key={project._id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 sm:p-3"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:h-14 sm:w-14">
              <Image
                src={project.img?.url || DEFAULT_IMG}
                alt={project.title}
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground sm:text-base">
                {project.title}
              </span>
              <span className="truncate text-[11px] text-muted-foreground sm:text-xs">
                {project.category} · {project.status}
                {project.isFeatured ? " · featured" : ""}
              </span>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => openEdit(project)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive"
                onClick={() => requestDelete(project)}
                aria-label={`Delete ${project.title}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={editing ? "Edit project" : "New project"}
        description={
          editing ? "Update the project details." : "Add a new project to your portfolio."
        }
      >
        <ProjectForm
          // Remount the form per target so it re-seeds cleanly.
          key={editing?._id ?? "new"}
          project={editing}
          onSuccess={handleSuccess}
        />
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) cancelDelete()
        }}
        title="Delete project"
        description="This permanently deletes the project and its image. This can't be undone."
      >
        <p className="text-sm text-foreground">
          Delete <span className="font-medium">{deleteTarget?.title}</span>?
        </p>

        {deleteError && (
          <p className="text-sm text-destructive" role="alert">
            {deleteError}
          </p>
        )}

        <div className="mt-1 flex justify-end gap-2">
          <Button variant="ghost" onClick={cancelDelete} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
