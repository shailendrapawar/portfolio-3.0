"use client"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { PROJECT_CATEGORY, PROJECT_STATUS } from "../constant"
import { useProjectForm, type ProjectWithId } from "../hooks/useProjectForm"
import SkillsInput from "./SkillsInput"

type ProjectFormProps = {
  project?: ProjectWithId | null
  onSuccess?: () => void
}

const labelClass = "text-xs"
const inputClass = "h-7 text-xs"
const selectTriggerClass = "h-7 w-full text-xs"

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const {
    values,
    setField,
    error,
    loading,
    isEditing,
    handleSubmit,
    handleImageChange,
    uploading,
    imageError,
  } = useProjectForm({ project, onSuccess })

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <Label htmlFor="title" className={labelClass}>
          Title
        </Label>
        <Input
          id="title"
          required
          disabled={loading}
          className={inputClass}
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description" className={labelClass}>
          Description
        </Label>
        <Input
          id="description"
          required
          disabled={loading}
          className={inputClass}
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="img" className={labelClass}>
          Image
        </Label>
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
            {values.img.url && (
              <Image
                src={values.img.url}
                alt="preview"
                fill
                sizes="48px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <input
            id="img"
            type="file"
            accept="image/*"
            disabled={loading || uploading}
            onChange={handleImageChange}
            className="min-w-0 flex-1 text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium file:text-foreground disabled:opacity-50"
          />
        </div>
        {uploading && (
          <span className="text-[11px] text-muted-foreground">Uploading…</span>
        )}
        {imageError && <span className="text-[11px] text-destructive">{imageError}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="skills" className={labelClass}>
          Skills
        </Label>
        <SkillsInput
          id="skills"
          disabled={loading}
          value={values.skills}
          onChange={(v) => setField("skills", v)}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Label htmlFor="category" className={labelClass}>
            Category
          </Label>
          <Select
            value={values.category}
            onValueChange={(v) => setField("category", v as string)}
            disabled={loading}
          >
            <SelectTrigger id="category" size="sm" className={selectTriggerClass}>
              <SelectValue className="capitalize" placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PROJECT_CATEGORY).map((c) => (
                <SelectItem key={c} value={c} className="text-xs capitalize">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Label htmlFor="status" className={labelClass}>
            Status
          </Label>
          <Select
            value={values.status}
            onValueChange={(v) => setField("status", v as typeof values.status)}
            disabled={loading}
          >
            <SelectTrigger id="status" size="sm" className={selectTriggerClass}>
              <SelectValue className="capitalize" placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PROJECT_STATUS).map((s) => (
                <SelectItem key={s} value={s} className="text-xs capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Label htmlFor="github" className={labelClass}>
            GitHub URL
          </Label>
          <Input
            id="github"
            required
            disabled={loading}
            className={inputClass}
            value={values.github}
            onChange={(e) => setField("github", e.target.value)}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Label htmlFor="live" className={labelClass}>
            Live URL (optional)
          </Label>
          <Input
            id="live"
            disabled={loading}
            className={inputClass}
            value={values.live ?? ""}
            onChange={(e) => setField("live", e.target.value)}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          className={cn("size-3.5 rounded border-input")}
          disabled={loading}
          checked={values.isFeatured}
          onChange={(e) => setField("isFeatured", e.target.checked)}
        />
        Featured project
      </label>

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="sm"
        className="mt-1 w-full"
        disabled={loading || uploading}
      >
        {loading ? "Saving…" : isEditing ? "Update project" : "Create project"}
      </Button>
    </form>
  )
}
