"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2, LogOut, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import ProjectManager from "@/features/project/components/ProjectManager"
import ExperienceManager from "@/features/experience/components/ExperienceManager"
import MessageManager from "@/features/message/components/MessageManager"
import ProfileInfoForm from "@/features/auth/components/ProfileInfoForm"
import ProfilePictureForm from "@/features/auth/components/ProfilePictureForm"
import ResetPasswordButton from "@/features/auth/components/ResetPasswordButton"
import LoadingOverlay from "@/components/LoadingOverlay"
import { useUnreadMessagesCount } from "@/features/message/hooks/useUnreadMessagesCount"
import { useLogout } from "@/features/auth/hooks/useLogout"

type Tab = "projects" | "experience" | "messages" | "profile"

const tabs: { label: string; value: Tab }[] = [
  { label: "Projects", value: "projects" },
  { label: "Work experience", value: "experience" },
  { label: "Profile", value: "profile" },
]

export default function AdminManager() {
  const params = useSearchParams()
  const tabParam = params.get("tab")
  const initial: Tab =
    tabParam === "experience"
      ? "experience"
      : tabParam === "messages"
        ? "messages"
        : tabParam === "profile"
          ? "profile"
          : "projects"

  const [active, setActive] = useState<Tab>(initial)
  const { unread, refresh } = useUnreadMessagesCount()
  const { handleLogout, loading: loggingOut } = useLogout()

  // Keep the badge in sync when returning from the messages view (items there
  // may have been read/deleted).
  useEffect(() => {
    if (active !== "messages") refresh()
  }, [active])

  return (
    <div className="flex flex-col gap-2">
      <LoadingOverlay show={loggingOut} label="Signing out…" />

      <div className="mx-auto flex w-full max-w-3xl gap-2 px-6 pt-6">
        <Link
          href="/"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to site
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive transition-all hover:bg-destructive/20 disabled:pointer-events-none disabled:opacity-70 min-[450px]:px-4"
        >
          {loggingOut ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          <span className="hidden min-[450px]:inline">
            {loggingOut ? "Logging out…" : "Logout"}
          </span>
        </button>
      </div>

      <div className="mx-auto mt-4 flex w-full max-w-3xl items-center justify-center gap-2 px-4 sm:px-6">
        <nav className="flex gap-1 rounded-full border border-border bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActive(tab.value)}
              className={cn(
                "rounded-full px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm",
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
            "relative flex size-9 shrink-0 items-center justify-center rounded-full border border-border transition-colors",
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
      {active === "profile" && (
        <div className="w-full px-4 pb-6 sm:px-6">
          <ProfilePictureForm />
          <ProfileInfoForm />
          <ResetPasswordButton />
        </div>
      )}
    </div>
  )
}
