import { z } from "zod"
import { MESSAGE_STATUS } from "./model"

export const createMessagePayload = z.object({
  name: z.string().min(1),
  email: z.email(),
  purpose: z.string().min(1),
  message: z.string().min(1),
})
export type ICreateMessagePayload = z.infer<typeof createMessagePayload>

export const searchMessagePayload = z.object({
  status: z.enum(MESSAGE_STATUS).optional(),
  // Partial, case-insensitive email match.
  email: z.string().min(1).optional(),
  // Inclusive createdAt range; accepts a Date or an ISO string.
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
})
export type ISearchMessagePayload = z.infer<typeof searchMessagePayload>

export const updateMessagePayload = z.object({
  status: z.enum(MESSAGE_STATUS),
})
export type IUpdateMessagePayload = z.infer<typeof updateMessagePayload>
