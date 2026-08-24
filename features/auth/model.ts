// features/auth/user.model.ts

import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema)
export type IUser = mongoose.InferSchemaType<typeof userSchema>