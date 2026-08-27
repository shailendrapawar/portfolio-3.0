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

    // Shown as the hero subtitle on the landing page.
    designation: {
      type: String,
      default: "Full Stack Developer",
    },

    // Shown as the intro/tagline under the hero on the landing page.
    bio: {
      type: String,
      default:
        "MERN stack wizard , with a knack for real-time features, and seemless user experience",
    },

    // Cloudinary-backed profile photo. `id` (public_id) lets us delete the
    // previous asset when a new one is uploaded. Shown in the About Me section.
    profilePicture: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/soty762i/image/upload/v1787480000/test.png",
      },
      id: { type: String },
    },
  },
  {
    timestamps: true,
  }
)

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema)
export type IUser = mongoose.InferSchemaType<typeof userSchema>