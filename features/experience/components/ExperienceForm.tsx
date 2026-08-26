"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"

import SkillsInput from "@/features/project/components/SkillsInput"
import { useExperienceForm, type ExperienceWithId } from "../hooks/useExperienceForm"

type ExperienceFormProps = {
  experience?: ExperienceWithId | null
  onSuccess?: () => void
}

const labelClass = "text-xs"
const inputClass = "h-7 text-xs"

export default function ExperienceForm({ experience, onSuccess }: ExperienceFormProps) {
  const { values, setField, error, loading, isEditing, handleSubmit } =
    useExperienceForm({ experience, onSuccess })

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <div className="flex gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Label htmlFor="company" className={labelClass}>
            Company
          </Label>
          <Input
            id="company"
            required
            disabled={loading}
            className={inputClass}
            value={values.company}
            onChange={(e) => setField("company", e.target.value)}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Label htmlFor="position" className={labelClass}>
            Position
          </Label>
          <Input
            id="position"
            required
            disabled={loading}
            className={inputClass}
            value={values.position}
            onChange={(e) => setField("position", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Label htmlFor="startDate" className={labelClass}>
            Start date
          </Label>
          <DatePicker
            id="startDate"
            disabled={loading}
            placeholder="Pick start date"
            value={values.startDate}
            onChange={(date) => setField("startDate", date)}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Label htmlFor="endDate" className={labelClass}>
            End date
          </Label>
          <DatePicker
            id="endDate"
            disabled={loading || values.isCurrent}
            placeholder={values.isCurrent ? "Present" : "Pick end date"}
            value={values.isCurrent ? undefined : values.endDate}
            onChange={(date) => setField("endDate", date)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="description" className={labelClass}>
          Description
        </Label>
        <Textarea
          id="description"
          required
          disabled={loading}
          className="min-h-14 text-xs"
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="pointers" className={labelClass}>
          Pointers
        </Label>
        <Textarea
          id="pointers"
          disabled={loading}
          placeholder="One bullet per line"
          className="min-h-20 text-xs"
          value={values.pointers}
          onChange={(e) => setField("pointers", e.target.value)}
        />
        <span className="text-[11px] text-muted-foreground">
          One bullet point per line.
        </span>
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

      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          className={cn("size-3.5 rounded border-input")}
          disabled={loading}
          checked={values.isCurrent}
          onChange={(e) => setField("isCurrent", e.target.checked)}
        />
        Current role
      </label>

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="sm" className="mt-1 w-full" disabled={loading}>
        {loading ? "Saving…" : isEditing ? "Update experience" : "Create experience"}
      </Button>
    </form>
  )
}
