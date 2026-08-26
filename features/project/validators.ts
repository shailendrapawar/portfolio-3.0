import { z } from "zod"

export const projectImagePayload = z.object({
  url: z.string(),
  id: z.string().optional(),
})
export type IProjectImagePayload = z.infer<typeof projectImagePayload>

export const createProjectPayload = z.object({
  title: z.string(),
  description: z.string(),
  img: projectImagePayload,
  skills: z.array(z.string()),
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
  isFeatured: z.boolean().optional(),
})
export type ISearchProjectPayload = z.infer<typeof searchProjectPayload>

export const updateProjectPayload = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  img: projectImagePayload.optional(),
  skills: z.array(z.string()).optional(),
  category: z.string().optional(),
  live: z.string().optional(),
  github: z.string().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["active", "inactive"]).optional(),
})
export type IUpdateProjectPayload = z.infer<typeof updateProjectPayload>
