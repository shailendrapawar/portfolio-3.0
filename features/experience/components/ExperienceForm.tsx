"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"

import SkillsInput from "@/features/project/components/SkillsInput"
import PointersInput from "./PointersInput"
import { useExperienceForm, type ExperienceWithId } from "../hooks/useExperienceForm"

type ExperienceFormProps = {
  experience?: ExperienceWithId | null
  onSuccess?: () => void
}

const labelClass = "text-xs"
const inputClass = "h-7 text-xs"

const steps = [
  { title: "Role & timeline", hint: "Where and when you worked." },
  { title: "Details", hint: "What you did in the role." },
  { title: "Skills & links", hint: "Tech used and proof/links." },
]

export default function ExperienceForm({ experience, onSuccess }: ExperienceFormProps) {
  const {
    values,
    setField,
    error,
    loading,
    isEditing,
    handleSubmit,
    step,
    totalSteps,
    isFirstStep,
    isLastStep,
    next,
    back,
  } = useExperienceForm({ experience, onSuccess })

  // On non-final steps, Enter / submit advances instead of saving.
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isLastStep) {
      e.preventDefault()
      next()
      return
    }
    handleSubmit(e)
  }

  return (
    <form onSubmit={onFormSubmit} className="flex flex-col gap-3">
      {/* Step header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-foreground">
            {steps[step].title}
          </h3>
          <p className="text-[11px] text-muted-foreground">{steps[step].hint}</p>
        </div>
        <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
          Step {step + 1} of {totalSteps}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= step ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Step 1 — Role & timeline */}
      {step === 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Label htmlFor="company" className={labelClass}>
                Company
              </Label>
              <Input
                id="company"
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
        </div>
      )}

      {/* Step 2 — Details */}
      {step === 1 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1">
            <Label htmlFor="description" className={labelClass}>
              Description
            </Label>
            <Textarea
              id="description"
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
            <PointersInput
              id="pointers"
              disabled={loading}
              value={values.pointers}
              onChange={(v) => setField("pointers", v)}
            />
          </div>
        </div>
      )}

      {/* Step 3 — Skills & links */}
      {step === 2 && (
        <div className="flex flex-col gap-2.5">
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

          <div className="flex flex-col gap-1">
            <Label htmlFor="credentials" className={labelClass}>
              Credentials (Google Drive link)
            </Label>
            <Input
              id="credentials"
              type="url"
              disabled={loading}
              placeholder="https://drive.google.com/…"
              className={inputClass}
              value={values.credentials ?? ""}
              onChange={(e) => setField("credentials", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="linkedin" className={labelClass}>
              LinkedIn (optional)
            </Label>
            <Input
              id="linkedin"
              type="url"
              disabled={loading}
              placeholder="https://www.linkedin.com/company/…"
              className={inputClass}
              value={values.linkedin ?? ""}
              onChange={(e) => setField("linkedin", e.target.value)}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-1 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={back}
          disabled={loading || isFirstStep}
          className="flex-1"
        >
          Back
        </Button>

        {isLastStep ? (
          <Button type="submit" size="sm" className="flex-1" disabled={loading}>
            {loading ? "Saving…" : isEditing ? "Update experience" : "Create experience"}
          </Button>
        ) : (
          <Button type="submit" size="sm" className="flex-1" disabled={loading}>
            Next
          </Button>
        )}
      </div>
    </form>
  )
}
