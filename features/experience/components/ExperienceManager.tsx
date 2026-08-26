"use client"

import { Pencil, Plus, Search, Trash2 } from "lucide-react"

import Modal from "@/components/Modal"
import Pagination from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useExperienceManager } from "../hooks/useExperienceManager"
import ExperienceForm from "./ExperienceForm"

// Dates arrive as ISO strings over the API; show a compact "Mon YYYY" label.
function formatDate(value?: string | Date | null) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

export default function ExperienceManager() {
  const {
    experiences,
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
  } = useExperienceManager()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Work experience</h1>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          New experience
        </Button>
      </div>

      <div className="flex flex-row items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search experience…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
          <SelectTrigger className="w-28 shrink-0 sm:w-44">
            <SelectValue className="capitalize" placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="capitalize">
              All
            </SelectItem>
            <SelectItem value="current" className="capitalize">
              Current
            </SelectItem>
            <SelectItem value="past" className="capitalize">
              Past
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && experiences.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {search || status !== "all"
            ? "No work experience matches your filters."
            : "No work experience yet."}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {experiences.map((experience) => (
          <li
            key={experience._id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 sm:p-3"
          >
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground sm:text-base">
                {experience.position} · {experience.company}
              </span>
              <span className="truncate text-[11px] text-muted-foreground sm:text-xs">
                {formatDate(experience.startDate)} –{" "}
                {experience.isCurrent ? "Present" : formatDate(experience.endDate)}
                {experience.isCurrent ? " · current" : ""}
              </span>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => openEdit(experience)}>
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive"
                onClick={() => requestDelete(experience)}
                aria-label={`Delete ${experience.position} at ${experience.company}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {!isLoading && !error && <Pagination {...pagination} />}

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={editing ? "Edit experience" : "New experience"}
        description={
          editing
            ? "Update the work experience details."
            : "Add a new work experience entry."
        }
      >
        <ExperienceForm
          // Remount the form per target so it re-seeds cleanly.
          key={editing?._id ?? "new"}
          experience={editing}
          onSuccess={handleSuccess}
        />
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) cancelDelete()
        }}
        title="Delete experience"
        description="This permanently deletes the work experience entry. This can't be undone."
      >
        <p className="text-sm text-foreground">
          Delete{" "}
          <span className="font-medium">
            {deleteTarget?.position} at {deleteTarget?.company}
          </span>
          ?
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
