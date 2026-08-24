import { z } from "zod"

export const createProjectPayload = z.object({
  title: z.string(),
  description: z.string(),
  img: z.string(),
  skills: z.string(),
  category: z.string(),
  live: z.string().optional(),
  github: z.string(),
  isFeatured: z.boolean(),
  status: z.enum(["active", "inactive"]),
})
export type ICreateProjectPayload = z.infer<typeof createProjectPayload>

export const searchProjectPayload = z.object({
  category: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
})
export type ISearchProjectPayload = z.infer<typeof searchProjectPayload>

export const updateProjectPayload = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  img: z.string().optional(),
  skills: z.string().optional(),
  category: z.string().optional(),
  live: z.string().optional(),
  github: z.string().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["active", "inactive"]).optional(),
})
export type IUpdateProjectPayload = z.infer<typeof updateProjectPayload>
