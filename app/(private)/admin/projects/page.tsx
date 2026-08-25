import ProtectRoute from "@/components/ProtectRoute"
import ProjectManager from "@/features/project/components/ProjectManager"

export default function AdminProjectsPage() {
  return (
    <ProtectRoute>
      <ProjectManager />
    </ProtectRoute>
  )
}
