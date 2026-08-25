"use client"

import { Pencil, Plus } from "lucide-react"

import Modal from "@/components/Modal"
import { Button } from "@/components/ui/button"

import { useProjectManager } from "../hooks/useProjectManager"
import ProjectForm from "./ProjectForm"

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
            className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
          >
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{project.title}</span>
              <span className="text-xs text-muted-foreground">
                {project.category} · {project.status}
                {project.isFeatured ? " · featured" : ""}
              </span>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(project)}>
              <Pencil className="size-4" />
            </Button>
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
    </div>
  )
}
