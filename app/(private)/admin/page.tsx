import ProtectRoute from "@/components/ProtectRoute"

export default function Admin() {
  return (
    <ProtectRoute>
      <div>
        <h1>Admin</h1>
      </div>
    </ProtectRoute>
  )
}
