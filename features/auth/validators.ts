import { z } from "zod"

export const loginPayload = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
export type ILoginPayload = z.infer<typeof loginPayload>
