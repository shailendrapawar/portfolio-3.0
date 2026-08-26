import { useMemo, useState } from "react"

import { usePagination } from "@/hooks/usePagination"
import { useDebounce } from "@/hooks/useDebounce"
import { useSearchMessages, type MessageWithId } from "./useSearchMessages"
import { useUpdateMessageStatus } from "./useUpdateMessageStatus"
import { useDeleteMessage } from "./useDeleteMessage"

/**
 * Owns the messages screen: the filter bar (email search, status, date range)
 * built into an API query string, client-side pagination over the results, the
 * read/detail modal (opening an unread message marks it read), and the
 * delete-confirm flow.
 */
export function useMessageManager() {
  // Filter bar state. `status`: "all" | "unread" | "read".
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string>("all")
  const [from, setFrom] = useState<Date | undefined>(undefined)
  const [to, setTo] = useState<Date | undefined>(undefined)

  // Debounce the email search so typing doesn't refetch on every keystroke;
  // status and date changes still apply immediately.
  const debouncedSearch = useDebounce(search, 2000)

  // Assemble the server query string from the active filters.
  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (status !== "all") params.set("status", status)
    const email = debouncedSearch.trim()
    if (email) params.set("email", email)
    if (from) params.set("from", from.toISOString())
    if (to) params.set("to", to.toISOString())
    return params.toString()
  }, [status, debouncedSearch, from, to])

  const { messages, unread, isLoading, error, searchMessages } =
    useSearchMessages(query)

  const { pageItems, ...pagination } = usePagination(messages, 5)

  // The message shown in the detail modal.
  const [selected, setSelected] = useState<MessageWithId | null>(null)

  const { updateStatus } = useUpdateMessageStatus(() => searchMessages())

  const openMessage = (message: MessageWithId) => {
    setSelected(message)
    // Opening an unread message marks it read.
    if (message.status === "unread") updateStatus(message._id, "read")
  }
  const closeMessage = () => setSelected(null)

  const toggleRead = async (message: MessageWithId) => {
    await updateStatus(
      message._id,
      message.status === "unread" ? "read" : "unread"
    )
  }

  // The message pending permanent deletion (drives the confirm modal).
  const [deleteTarget, setDeleteTarget] = useState<MessageWithId | null>(null)

  const {
    deleteMessage,
    deleting,
    error: deleteError,
  } = useDeleteMessage(() => {
    setDeleteTarget(null)
    searchMessages()
  })

  const requestDelete = (message: MessageWithId) => setDeleteTarget(message)
  const cancelDelete = () => setDeleteTarget(null)
  const confirmDelete = async () => {
    if (deleteTarget?._id) await deleteMessage(deleteTarget._id)
  }

  const hasFilters = status !== "all" || Boolean(search.trim() || from || to)

  return {
    messages: pageItems,
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
  }
}
