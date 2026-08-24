import { NextResponse } from "next/server"
import { ApiError } from "./error"

export type ApiResponseBody<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

/**
 * Generic response sender. `success` is derived from the status code, and
 * `data` is only included when provided.
 */
export function sendResponse<T>(
  statusCode: number,
  message: string,
  data?: T
): NextResponse {
  const body: ApiResponseBody<T> = {
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    message,
  }

  if (data !== undefined) {
    body.data = data
  }

  return NextResponse.json(body, { status: statusCode })
}

/**
 * Maps a thrown error to a response: known `ApiError`s keep their status code,
 * anything else becomes a 500 (and is logged for debugging).
 */
export function handleError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return sendResponse(error.statusCode, error.message)
  }

  console.error("Unhandled API error:", error)
  return sendResponse(500, "Internal server error")
}
