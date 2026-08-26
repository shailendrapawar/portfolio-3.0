import ProtectRoute from "@/components/ProtectRoute"
import ExperienceManager from "@/features/experience/components/ExperienceManager"

export default function AdminWorkExperiencePage() {
  return (
    <ProtectRoute>
      <ExperienceManager />
    </ProtectRoute>
  )
}
