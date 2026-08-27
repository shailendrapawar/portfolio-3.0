import { z } from "zod"

export const loginPayload = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
export type ILoginPayload = z.infer<typeof loginPayload>

// Partial profile update from the admin dashboard. Any subset may be sent:
// text fields, and/or a profile picture (uploaded via /api/upload first, then
// persisted here as its Cloudinary { url, id }).
export const updateProfilePayload = z.object({
  name: z.string().min(1).max(80).optional(),
  designation: z.string().max(120).optional(),
  bio: z.string().max(1000).optional(),
  profilePicture: z
    .object({ url: z.string().url(), id: z.string().min(1) })
    .optional(),
})
export type IUpdateProfilePayload = z.infer<typeof updateProfilePayload>
