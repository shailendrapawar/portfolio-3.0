"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { PROJECT_CATEGORY, PROJECT_STATUS } from "../constant"
import { useProjectForm, type ProjectWithId } from "../hooks/useProjectForm"

type ProjectFormProps = {
  project?: ProjectWithId | null
  onSuccess?: () => void
}

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const { values, setField, error, loading, isEditing, handleSubmit } = useProjectForm({
    project,
    onSuccess,
  })

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          required
          disabled={loading}
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          required
          disabled={loading}
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="img">Image URL</Label>
        <Input
          id="img"
          disabled={loading}
          placeholder="Leave blank to use the default image"
          value={values.img.url}
          onChange={(e) => setField("img", { ...values.img, url: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          required
          disabled={loading}
          value={values.skills}
          onChange={(e) => setField("skills", e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className={selectClass}
            disabled={loading}
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
          >
            {Object.values(PROJECT_CATEGORY).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className={selectClass}
            disabled={loading}
            value={values.status}
            onChange={(e) =>
              setField("status", e.target.value as typeof values.status)
            }
          >
            {Object.values(PROJECT_STATUS).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="github">GitHub URL</Label>
        <Input
          id="github"
          required
          disabled={loading}
          value={values.github}
          onChange={(e) => setField("github", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="live">Live URL (optional)</Label>
        <Input
          id="live"
          disabled={loading}
          value={values.live ?? ""}
          onChange={(e) => setField("live", e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className={cn("size-4 rounded border-input")}
          disabled={loading}
          checked={values.isFeatured}
          onChange={(e) => setField("isFeatured", e.target.checked)}
        />
        Featured project
      </label>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="mt-2 w-full" disabled={loading}>
        {loading
          ? "Saving…"
          : isEditing
            ? "Update project"
            : "Create project"}
      </Button>
    </form>
  )
}
