import { ProjectService } from "@/features/project/service"
import { createProjectPayload, searchProjectPayload } from "@/features/project/validators"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)

  const parsed = searchProjectPayload.safeParse({
    category: url.searchParams.get("category") || undefined,
    status: url.searchParams.get("status") || undefined,
  })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { count, items } = await ProjectService.search(parsed.data)

  return NextResponse.json({ items, count })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  const parsed = createProjectPayload.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const item = await ProjectService.create(parsed.data)

  return NextResponse.json({ item }, { status: 201 })
}
