import { SignJWT, jwtVerify, type JWTPayload } from "jose"
import { ENV } from "../env"

if (!ENV.auth.secret) {
  throw new Error("AUTH_SECRET is not defined")
}

const secret = new TextEncoder().encode(ENV.auth.secret)
const ALG = "HS256"

export type AuthTokenPayload = {
  sub: string // user id
  email: string
}

export async function signToken(
  payload: AuthTokenPayload,
  expiresIn: string = "7d"
): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
}

export async function verifyToken(
  token: string
): Promise<(AuthTokenPayload & JWTPayload) | null> {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: [ALG] })
    return payload as AuthTokenPayload & JWTPayload
  } catch {
    return null
  }
}
