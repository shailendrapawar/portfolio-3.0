"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DatePickerProps = {
  value?: Date
  onChange: (date: Date | undefined) => void
  id?: string
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  id,
  disabled,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const label = value
    ? value.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : placeholder

  const currentYear = new Date().getFullYear()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-7 w-full justify-start gap-2 text-xs font-normal",
          !value && "text-muted-foreground",
          className
        )}
      >
        <CalendarIcon className="size-3.5" />
        {label}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
          defaultMonth={value}
          captionLayout="dropdown"
          startMonth={new Date(1990, 0)}
          endMonth={new Date(currentYear + 1, 11)}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
