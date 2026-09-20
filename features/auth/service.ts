import bcrypt from "bcrypt"

import { connectDB } from "@/lib/db/db"
import { DBRepository } from "@/lib/db/db.repository"
import { ApiError } from "@/lib/api/error"
import { ENV } from "@/lib/env"
import { cloudinaryService } from "@/lib/providers/cloudinary"
import { mailer } from "@/lib/providers/mailer"
import { PASSWORD_RESET_OTP_TEMPLATE_KEY } from "@/lib/templates/email"
import {
  generateOtp,
  setOtp,
  checkOtp,
  clearOtp,
  msUntilResend,
  type OtpFailureReason,
} from "@/lib/auth/otp-store"
import { UploadService } from "@/features/upload/service"
import {
  ILoginPayload,
  IResetPasswordPayload,
  IResetPasswordWithOtpPayload,
  IUpdateProfilePayload,
  IVerifyOtpPayload,
} from "./validators"
import { UserModel } from "./model"

// How long an emailed reset code stays valid.
const OTP_TTL_MINUTES = 10
const OTP_TTL_MS = OTP_TTL_MINUTES * 60_000

// Max reset-code requests before the account locks. A normal sign-in clears it.
const MAX_OTP_REQUESTS = 3

// A new code can only be issued once per this window (resend cooldown).
const OTP_RESEND_COOLDOWN_MS = 5 * 60_000

// 423 Locked — shown when the reset flow is refused due to the request cap.
const LOCKED_MESSAGE =
  "Too many reset requests. For security, sign in with your password to re-enable password reset."

// Human-friendly "wait N minutes/seconds" from a remaining-seconds count.
function formatWait(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.ceil(seconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""}`
  }
  return `${seconds} second${seconds !== 1 ? "s" : ""}`
}

// The forgot-password flow always targets the single admin. Its email is the
// seeded admin address; we never take it from the client.
function adminEmail(): string {
  const email = ENV.auth.seedAdmin.email
  if (!email) {
    throw new ApiError(500, "Password reset is not configured")
  }
  return email.toLowerCase()
}

// Maps an OTP check failure to a user-facing message.
function otpErrorMessage(reason: OtpFailureReason): string {
  switch (reason) {
    case "expired":
      return "This code has expired. Please request a new one."
    case "too_many_attempts":
      return "Too many incorrect attempts. Please request a new code."
    case "missing":
      return "No active code. Please request a new one."
    default:
      return "Incorrect code. Please try again."
  }
}

export class AuthService extends DBRepository {
  //1: login
  static async login(payload: ILoginPayload) {
    await connectDB()

    const user = await UserModel.findOne({ email: payload.email })
    if (!user) {
      throw new ApiError(401, "Invalid email or password")
    }

    const isValid = await bcrypt.compare(payload.password, user.password)
    if (!isValid) {
      throw new ApiError(401, "Invalid email or password")
    }

    // A successful sign-in clears any forgot-password lock and request count.
    if (user.locked || user.otpRequestCount) {
      user.locked = false
      user.otpRequestCount = 0
      await user.save()
    }

    // Never return the password hash to the caller.
    const { password, ...safeUser } = user.toObject()
    return safeUser
  }

  //2: update the authenticated user's profile (any subset of fields)
  static async updateProfile(userId: string, payload: IUpdateProfilePayload) {
    await connectDB()

    const user = await UserModel.findById(userId)
    if (!user) {
      throw new ApiError(404, "User not found")
    }

    if (payload.profilePicture) {
      const previousId = user.profilePicture?.id
      if (previousId && previousId !== payload.profilePicture.id) {
        // Remove the previous Cloudinary asset (best-effort) and its tracking
        // record so orphaned images don't pile up. Skip if it's the same asset.
        await cloudinaryService.delete(previousId).catch((error) => {
          console.error("Failed to delete previous profile picture:", error)
        })
        await UploadService.removeByPublicId(previousId)
      }

      user.profilePicture = payload.profilePicture

      // Claim the new asset: flip its Upload record "pending" -> "active" so the
      // cleanup cron (purgePending) doesn't delete it as an orphan.
      await UploadService.activate(payload.profilePicture.id)
    }

    if (payload.name !== undefined) user.name = payload.name
    if (payload.designation !== undefined) user.designation = payload.designation
    if (payload.bio !== undefined) user.bio = payload.bio

    await user.save()

    const { password, ...safeUser } = user.toObject()
    return safeUser
  }

  //3: reset the authenticated user's password (no current password required —
  // identity is already proven by the httpOnly session)
  static async resetPassword(
    userId: string,
    payload: IResetPasswordPayload
  ) {
    await connectDB()

    const user = await UserModel.findById(userId)
    if (!user) {
      throw new ApiError(404, "User not found")
    }

    user.password = await bcrypt.hash(payload.newPassword, 10)
    await user.save()

    return { success: true }
  }

  //4: request a password-reset OTP. A code is generated, cached, and emailed to
  // the admin address (SEED_ADMIN_EMAIL). No-op if that admin user doesn't
  // exist. Locks the account (refusing further resets) once the request cap is
  // exceeded; only a normal sign-in clears the lock.
  static async requestPasswordReset() {
    await connectDB()

    const email = adminEmail()
    const user = await UserModel.findOne({ email })

    // Admin not found → silently no-op (nothing to reset).
    if (!user) return

    // Already locked, or this request would exceed the cap → lock and refuse.
    if (user.locked || user.otpRequestCount >= MAX_OTP_REQUESTS) {
      if (!user.locked) {
        user.locked = true
        await user.save()
      }
      throw new ApiError(423, LOCKED_MESSAGE)
    }

    // Enforce the resend cooldown: a new code only after the window elapses.
    const waitMs = msUntilResend(email, OTP_RESEND_COOLDOWN_MS)
    if (waitMs > 0) {
      throw new ApiError(
        429,
        `A code was already sent. Please wait ${formatWait(
          Math.ceil(waitMs / 1000)
        )} before requesting a new one.`
      )
    }

    user.otpRequestCount += 1
    await user.save()

    const code = generateOtp()
    setOtp(email, code, OTP_TTL_MS)

    await mailer.send({
      to: user.email as string,
      type: "auto",
      templateKey: PASSWORD_RESET_OTP_TEMPLATE_KEY,
      data: {
        name: user.name as string | undefined,
        otp: code,
        expiresInMinutes: OTP_TTL_MINUTES,
      },
    })
  }

  //5: verify a reset OTP without consuming it (drives step-by-step UX). Throws
  // an ApiError with a clear message when the code is wrong/expired, or 423 when
  // the account is locked.
  static async verifyResetOtp(payload: IVerifyOtpPayload) {
    await connectDB()

    const email = adminEmail()
    await AuthService.assertNotLocked(email)

    const result = checkOtp(email, payload.otp)
    if (!result.ok) {
      throw new ApiError(400, otpErrorMessage(result.reason))
    }
    return { success: true }
  }

  //6: reset the password using a valid OTP, then invalidate it. Refused while
  // the account is locked.
  static async resetPasswordWithOtp(payload: IResetPasswordWithOtpPayload) {
    await connectDB()

    const email = adminEmail()
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new ApiError(400, "Invalid or expired code")
    }
    if (user.locked) {
      throw new ApiError(423, LOCKED_MESSAGE)
    }

    const result = checkOtp(email, payload.otp)
    if (!result.ok) {
      throw new ApiError(400, otpErrorMessage(result.reason))
    }

    user.password = await bcrypt.hash(payload.newPassword, 10)
    // A completed reset also clears the request count.
    user.otpRequestCount = 0
    await user.save()

    clearOtp(email)
    return { success: true }
  }

  // Throws 423 if the admin account is currently locked out of the reset flow.
  private static async assertNotLocked(email: string) {
    const user = await UserModel.findOne({ email }).select("locked").lean()
    if (user && (user as { locked?: boolean }).locked) {
      throw new ApiError(423, LOCKED_MESSAGE)
    }
  }

  //7: public profile for the landing + About Me sections (single-admin portfolio)
  static async getPublicProfile() {
    await connectDB()

    const user = await UserModel.findOne()
      .select("name designation bio profilePicture")
      .lean()

    if (!user) return null

    return {
      name: user.name as string,
      designation: user.designation as string | undefined,
      bio: user.bio as string | undefined,
      profilePicture: user.profilePicture as
        | { url: string; id?: string }
        | undefined,
    }
  }
}
