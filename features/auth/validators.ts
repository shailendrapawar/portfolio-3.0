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

// Reset the signed-in user's password from the profile section. The current
// password is intentionally NOT required — the httpOnly session already proves
// identity. `confirmPassword` must match to guard against typos.
export const resetPasswordPayload = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type IResetPasswordPayload = z.infer<typeof resetPasswordPayload>

// Forgot-password flow (public, OTP-based). The code is always sent to the
// single admin's email (SEED_ADMIN_EMAIL) server-side, so no email is accepted
// from the client — the flow starts straight at the code step.

const otpField = z.string().regex(/^\d{6}$/, "Enter the 6-digit code")

// Step 1: verify the emailed code.
export const verifyOtpPayload = z.object({
  otp: otpField,
})
export type IVerifyOtpPayload = z.infer<typeof verifyOtpPayload>

// Step 2: set a new password, re-checking the same code.
export const resetPasswordWithOtpPayload = z
  .object({
    otp: otpField,
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export type IResetPasswordWithOtpPayload = z.infer<
  typeof resetPasswordWithOtpPayload
>
