import { Suspense } from "react"

import ProtectRoute from "@/components/ProtectRoute"
import AdminManager from "@/components/AdminManager"

export default function Admin() {
  return (
    <ProtectRoute>
      <Suspense>
        <AdminManager />
      </Suspense>
    </ProtectRoute>
  )
}
