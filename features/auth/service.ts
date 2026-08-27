import bcrypt from "bcrypt"

import { connectDB } from "@/lib/db/db"
import { DBRepository } from "@/lib/db/db.repository"
import { ApiError } from "@/lib/api/error"
import { cloudinaryService } from "@/lib/providers/cloudinary"
import { UploadService } from "@/features/upload/service"
import { ILoginPayload, IUpdateProfilePayload } from "./validators"
import { UserModel } from "./model"

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

  //3: public profile for the landing + About Me sections (single-admin portfolio)
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
