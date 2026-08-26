"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import ProjectManager from "@/features/project/components/ProjectManager"
import ExperienceManager from "@/features/experience/components/ExperienceManager"
import MessageManager from "@/features/message/components/MessageManager"
import { useUnreadMessagesCount } from "@/features/message/hooks/useUnreadMessagesCount"

type Tab = "projects" | "experience" | "messages"

const tabs: { label: string; value: Tab }[] = [
  { label: "Projects", value: "projects" },
  { label: "Work experience", value: "experience" },
]

export default function AdminManager() {
  const params = useSearchParams()
  const initial: Tab =
    params.get("tab") === "experience"
      ? "experience"
      : params.get("tab") === "messages"
        ? "messages"
        : "projects"

  const [active, setActive] = useState<Tab>(initial)
  const { unread, refresh } = useUnreadMessagesCount()

  // Keep the badge in sync when returning from the messages view (items there
  // may have been read/deleted).
  useEffect(() => {
    if (active !== "messages") refresh()
  }, [active])

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

      <div className="mx-auto mt-4 flex items-center gap-2">
        <nav className="flex gap-1 rounded-full border border-border bg-muted p-1">
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

        {/* Messages shortcut, adjacent to the tab bar, with an unread badge. */}
        <button
          type="button"
          onClick={() => setActive("messages")}
          aria-label={`Messages${unread ? ` (${unread} unread)` : ""}`}
          className={cn(
            "relative flex size-9 items-center justify-center rounded-full border border-border transition-colors",
            active === "messages"
              ? "bg-primary text-white shadow-sm"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <Mail className="size-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-4 font-semibold text-white">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      </div>

      {active === "projects" && <ProjectManager />}
      {active === "experience" && <ExperienceManager />}
      {active === "messages" && <MessageManager />}
    </div>
  )
}
