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

    // Forgot-password abuse guard. `otpRequestCount` counts reset-code requests;
    // once the cap is exceeded the account is `locked` and the OTP flow is
    // refused until the owner signs in normally (which clears both).
    otpRequestCount: {
      type: Number,
      default: 0,
    },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema)
export type IUser = mongoose.InferSchemaType<typeof userSchema>