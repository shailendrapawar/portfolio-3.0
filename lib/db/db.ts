import mongoose from "mongoose"
import { ENV } from "../env"

if (!ENV.db.uri) {
  throw new Error("MONGODB_URI is not defined")
}

const cached = globalThis as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

if (!cached.mongoose) {
  cached.mongoose = {
    conn: null,
    promise: null,
  }
}

export async function connectDB() {
  if (cached.mongoose!.conn) {
    return cached.mongoose!.conn
  }

  if (!cached.mongoose!.promise) {
    cached.mongoose!.promise = mongoose.connect(ENV.db.uri)
  }

  cached.mongoose!.conn = await cached.mongoose!.promise

  return cached.mongoose!.conn
}
