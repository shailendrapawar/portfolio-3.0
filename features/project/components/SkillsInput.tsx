"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type SkillsInputProps = {
  /** Comma-separated skills string (matches the model shape). */
  value: string
  onChange: (value: string) => void
  id?: string
  disabled?: boolean
  placeholder?: string
}

/**
 * Tag/pillbox input for the comma-separated `skills` string. Type a skill and
 * press Enter (or comma) to add it as a pill; Backspace on an empty field
 * removes the last one.
 */
export default function SkillsInput({
  value,
  onChange,
  id,
  disabled,
  placeholder = "Type a skill, press Enter",
}: SkillsInputProps) {
  const [draft, setDraft] = useState("")

  const tags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)

  const commit = (raw: string) => {
    const tag = raw.trim().toLowerCase()
    setDraft("")
    if (!tag || tags.includes(tag)) return
    onChange([...tags, tag].join(","))
  }

  const removeAt = (index: number) => {
    onChange(tags.filter((_, i) => i !== index).join(","))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      commit(draft)
    } else if (e.key === "Backspace" && !draft && tags.length) {
      removeAt(tags.length - 1)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent p-1 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {tags.map((tag, i) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-primary/10 py-0.5 pr-1 pl-2 text-xs font-medium text-primary"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => removeAt(i)}
            className="rounded-sm p-0.5 text-primary/70 transition-colors hover:bg-primary/20 hover:text-primary"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      <input
        id={id}
        type="text"
        disabled={disabled}
        value={draft}
        placeholder={tags.length ? "" : placeholder}
        onChange={(e) => setDraft(e.target.value.toLowerCase())}
        onKeyDown={onKeyDown}
        onBlur={() => commit(draft)}
        className="h-6 min-w-24 flex-1 bg-transparent px-1 text-xs outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
