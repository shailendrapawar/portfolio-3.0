// src/scripts/seed-admin.ts

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
    console.log("Admin already exists")
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
