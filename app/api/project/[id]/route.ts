import { ProjectService } from "@/features/project/service"
import { updateProjectPayload } from "@/features/project/validators"
import { NextResponse } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params

  const item = await ProjectService.get(id)
  if (!item) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  return NextResponse.json({ item })
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json().catch(() => null)

  const parsed = updateProjectPayload.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const item = await ProjectService.update(id, parsed.data)
    return NextResponse.json({ item })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 404 })
  }
}
