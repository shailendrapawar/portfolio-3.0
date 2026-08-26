import { z } from "zod"

export const createWorkExperiencePayload = z.object({
  company: z.string(),
  position: z.string(),
  // Accepts a Date or an ISO string (JSON serializes Dates to strings).
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  description: z.string(),
  pointers: z.array(z.string()),
  skills: z.array(z.string()),
  credentials: z.string().optional(),
  linkedin: z.string().optional(),
  isCurrent: z.boolean(),
})
export type ICreateWorkExperiencePayload = z.infer<typeof createWorkExperiencePayload>

export const searchWorkExperiencePayload = z.object({
  isCurrent: z.boolean().optional(),
})
export type ISearchWorkExperiencePayload = z.infer<typeof searchWorkExperiencePayload>

export const updateWorkExperiencePayload = z.object({
  company: z.string().optional(),
  position: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  description: z.string().optional(),
  pointers: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  credentials: z.string().optional(),
  linkedin: z.string().optional(),
  isCurrent: z.boolean().optional(),
})
export type IUpdateWorkExperiencePayload = z.infer<typeof updateWorkExperiencePayload>
