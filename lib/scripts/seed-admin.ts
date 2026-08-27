// src/scripts/seed-admin.ts
// Manual admin seed — run with `npm run seed:admin`.

import bcrypt from "bcrypt"
import { UserModel } from "@/features/auth/model"
import { connectDB } from "../db/db"
import { ENV } from "../env"

async function seedAdmin() {
  await connectDB()

  const email = ENV.auth.seedAdmin.email
  const password = ENV.auth.seedAdmin.password
  const name = ENV.auth.seedAdmin.name

  if (!email || !password || !name) {
    throw new Error("Admin seed credentials are missing")
  }

  const existingUser = await UserModel.findOne({ email })

  if (existingUser) {
    // Backfill fields added to the schema after this user was created.
    // Mongoose defaults never write into already-saved documents, so set them
    // explicitly here. Only fills what's missing — won't overwrite your edits.
    let changed = false

    if (existingUser.designation === undefined) {
      existingUser.designation = "Full Stack Developer"
      changed = true
    }
    if (existingUser.bio === undefined) {
      existingUser.bio =
        "MERN stack wizard , with a knack for real-time features, and seemless user experience"
      changed = true
    }
    if (!existingUser.profilePicture?.url) {
      existingUser.profilePicture = {
        url: "https://res.cloudinary.com/soty762i/image/upload/v1787480000/test.png",
      }
      changed = true
    }

    if (changed) {
      await existingUser.save()
      console.log("Admin already exists — backfilled missing profile fields")
    } else {
      console.log("Admin already exists — nothing to backfill")
    }
    return
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await UserModel.create({
    name,
    email,
    password: hashedPassword,
  })

  console.log("Admin user created successfully")
}

seedAdmin()
  .catch((error) => {
    console.error("Failed to seed admin:", error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
