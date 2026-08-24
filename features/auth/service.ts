import bcrypt from "bcrypt"

import { connectDB } from "@/lib/db/db"
import { DBRepository } from "@/lib/db/db.repository"
import { ApiError } from "@/lib/api/error"
import { ILoginPayload } from "./validators"
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
}
