import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AuthUser {
  _id: string
  name: string
  email: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  // Store the auth state after a successful login.
  login: (user: AuthUser) => void
  // Clear the auth state on logout.
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-store",
    }
  )
)
