import { Suspense } from "react"

import LoginForm from "./components/LoginForm"

export default function Auth() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
