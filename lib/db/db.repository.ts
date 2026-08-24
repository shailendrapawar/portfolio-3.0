import { connectDB } from "./db"

export abstract class DBRepository {
  protected async connect() {
    await connectDB()
  }
}
