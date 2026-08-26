"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

type PointersInputProps = {
  /** The list of bullet points. */
  value: string[]
  onChange: (value: string[]) => void
  id?: string
  disabled?: boolean
  placeholder?: string
}

/**
 * Todo-style editor for the `pointers` string[]. Enter on a row inserts a new
 * row below and focuses it; Backspace on an empty row removes it and focuses
 * the previous one. The list scrolls (thin scrollbar) past ~3 rows so the form
 * stays compact.
 */
export default function PointersInput({
  value,
  onChange,
  id,
  disabled,
  placeholder = "Add a point, press Enter",
}: PointersInputProps) {
  // Always render at least one row to type into.
  const rows = value.length ? value : [""]

  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [focusIndex, setFocusIndex] = useState<number | null>(null)

  useEffect(() => {
    if (focusIndex === null) return
    inputsRef.current[focusIndex]?.focus()
    setFocusIndex(null)
  }, [focusIndex])

  const update = (index: number, text: string) => {
    const next = [...rows]
    next[index] = text
    onChange(next)
  }

  const addAfter = (index: number) => {
    const next = [...rows]
    next.splice(index + 1, 0, "")
    onChange(next)
    setFocusIndex(index + 1)
  }

  const removeAt = (index: number) => {
    const next = rows.filter((_, i) => i !== index)
    onChange(next)
    setFocusIndex(Math.max(0, index - 1))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addAfter(index)
    } else if (e.key === "Backspace" && !rows[index] && rows.length > 1) {
      e.preventDefault()
      removeAt(index)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          // ~3 rows tall (each row h-7 + gap-1), then scrolls with a thin bar.
          "scrollbar-thin flex max-h-[6.25rem] flex-col gap-1 overflow-y-auto rounded-lg border border-input bg-transparent p-1 dark:bg-input/30",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="ml-1 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
            <input
              id={i === 0 ? id : undefined}
              ref={(el) => {
                inputsRef.current[i] = el
              }}
              type="text"
              disabled={disabled}
              value={row}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="h-6 min-w-0 flex-1 bg-transparent px-1 text-xs outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              aria-label="Remove point"
              disabled={disabled || rows.length === 1}
              onClick={() => removeAt(i)}
              className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
