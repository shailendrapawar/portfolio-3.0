import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AuthUser {
  _id: string
  name: string
  email: string
  designation?: string
  bio?: string
  profilePicture?: { url: string; id?: string }
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  // Store the auth state after a successful login.
  login: (user: AuthUser) => void
  // Clear the auth state on logout.
  logout: () => void
  // Update just the profile picture (after a successful upload+save).
  setProfilePicture: (picture: { url: string; id: string }) => void
  // Update the text profile fields (after a successful save).
  setProfileInfo: (info: {
    name: string
    designation: string
    bio: string
  }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setProfilePicture: (picture) =>
        set((state) =>
          state.user
            ? { user: { ...state.user, profilePicture: picture } }
            : state
        ),
      setProfileInfo: (info) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...info } } : state
        ),
    }),
    {
      name: "auth-store",
    }
  )
)
