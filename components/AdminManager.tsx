"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import ProjectManager from "@/features/project/components/ProjectManager"
import ExperienceManager from "@/features/experience/components/ExperienceManager"

type Tab = "projects" | "experience"

const tabs: { label: string; value: Tab }[] = [
  { label: "Projects", value: "projects" },
  { label: "Work experience", value: "experience" },
]

export default function AdminManager() {
  const params = useSearchParams()
  const initial: Tab = params.get("tab") === "experience" ? "experience" : "projects"

  const [active, setActive] = useState<Tab>(initial)

  return (
    <div className="flex flex-col gap-2">
      <div className="mx-auto flex w-full max-w-3xl px-6 pt-6">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to site
        </Link>
      </div>

      <nav className="mx-auto mt-4 flex gap-1 rounded-full border border-border bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActive(tab.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm",
              active === tab.value
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {active === "projects" ? <ProjectManager /> : <ExperienceManager />}
    </div>
  )
}
