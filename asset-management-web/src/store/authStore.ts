import { create } from "zustand";

// 🗄️ Central Auth Store: Holds current token/user state.
// Updated via useInitializeAuth on load or axios interceptor on 401.
import type { ProfileResponse } from "../types/auth.types";

interface AuthState {
  token: string | null;
  user: ProfileResponse | null;
  setAuth: (token: string, user: ProfileResponse) => void;
  setUser: (user: ProfileResponse) => void; // for cookie-based session restore (no token returned)
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  setUser: (user) => set({ token: "cookie", user }), // "cookie" signals an active session via httpOnly cookie
  clearAuth: () => set({ token: null, user: null }),
}));