"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PaginationControls } from "@/hooks/usePagination"

const LIMITS = [5, 10, 20, 50]

export default function Pagination({
  page,
  pageCount,
  total,
  limit,
  setLimit,
  next,
  prev,
  canNext,
  canPrev,
}: PaginationControls) {
  if (total === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Rows</span>
        <Select
          value={String(limit)}
          onValueChange={(v) => setLimit(Number(v ?? LIMITS[0]))}
        >
          <SelectTrigger size="sm" className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LIMITS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Page {page} of {pageCount} · {total} total
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={prev}
          disabled={!canPrev}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={next}
          disabled={!canNext}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
