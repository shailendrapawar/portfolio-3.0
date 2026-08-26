"use client"

import { Mail, MailOpen, Search, Trash2 } from "lucide-react"

import Modal from "@/components/Modal"
import Pagination from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { useMessageManager } from "../hooks/useMessageManager"

// Submissions arrive with ISO createdAt strings; show a compact date-time.
function formatDateTime(value?: string | Date | null) {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function MessageManager() {
  const {
    messages,
    unread,
    pagination,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    from,
    setFrom,
    to,
    setTo,
    hasFilters,
    selected,
    openMessage,
    closeMessage,
    toggleRead,
    deleteTarget,
    deleting,
    deleteError,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useMessageManager()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
        <span className="text-sm text-muted-foreground">
          {unread} unread
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-40 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by email…"
            className="h-7 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
          <SelectTrigger size="sm" className="w-24 shrink-0 text-xs">
            <SelectValue className="capitalize" placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="capitalize">
              All
            </SelectItem>
            <SelectItem value="unread" className="capitalize">
              Unread
            </SelectItem>
            <SelectItem value="read" className="capitalize">
              Read
            </SelectItem>
          </SelectContent>
        </Select>

        <DatePicker
          value={from}
          onChange={setFrom}
          placeholder="From"
          className="w-28 shrink-0"
        />
        <DatePicker
          value={to}
          onChange={setTo}
          placeholder="To"
          className="w-28 shrink-0"
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && messages.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {hasFilters
            ? "No messages match your filters."
            : "No messages yet."}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {messages.map((message) => (
          <li
            key={message._id}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border bg-card p-2 sm:p-3",
              message.status === "unread" && "border-primary/40 bg-primary/5"
            )}
          >
            <button
              type="button"
              onClick={() => openMessage(message)}
              className="flex min-w-0 flex-1 flex-col items-start text-left"
            >
              <span className="flex w-full items-center gap-2">
                {message.status === "unread" && (
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "truncate text-sm text-foreground sm:text-base",
                    message.status === "unread" ? "font-semibold" : "font-medium"
                  )}
                >
                  {message.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {message.email}
                </span>
              </span>
              <span className="mt-0.5 flex w-full items-center gap-1.5">
                <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {message.purpose}
                </span>
                <span className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  {message.message}
                </span>
              </span>
            </button>

            <span className="hidden shrink-0 text-[11px] text-muted-foreground sm:block">
              {formatDateTime(message.createdAt)}
            </span>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => toggleRead(message)}
                aria-label={
                  message.status === "unread"
                    ? `Mark message from ${message.name} as read`
                    : `Mark message from ${message.name} as unread`
                }
              >
                {message.status === "unread" ? (
                  <Mail className="size-4" />
                ) : (
                  <MailOpen className="size-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive"
                onClick={() => requestDelete(message)}
                aria-label={`Delete message from ${message.name}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {!isLoading && !error && <Pagination {...pagination} />}

      {/* Detail modal */}
      <Modal
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) closeMessage()
        }}
        title={selected?.purpose}
        description={
          selected
            ? `${selected.name} · ${selected.email} · ${formatDateTime(selected.createdAt)}`
            : undefined
        }
      >
        <p className="text-sm whitespace-pre-wrap text-foreground">
          {selected?.message}
        </p>

        <div className="mt-1 flex justify-end">
          {selected && (
            <a
              href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(
                selected.purpose
              )}`}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              )}
            >
              <Mail className="size-4" />
              Reply
            </a>
          )}
        </div>
      </Modal>

      {/* Delete-confirm modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) cancelDelete()
        }}
        title="Delete message"
        description="This permanently deletes the message. This can't be undone."
      >
        <p className="text-sm text-foreground">
          Delete the message from{" "}
          <span className="font-medium">{deleteTarget?.name}</span>?
        </p>

        {deleteError && (
          <p className="text-sm text-destructive" role="alert">
            {deleteError}
          </p>
        )}

        <div className="mt-1 flex justify-end gap-2">
          <Button variant="ghost" onClick={cancelDelete} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
