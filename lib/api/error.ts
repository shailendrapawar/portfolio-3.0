/**
 * Error carrying an HTTP status code, so route handlers can throw from anywhere
 * (services, guards) and let a single catch block map it to the right response.
 */
export class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
  }
}
