import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileResponse } from "../types/auth.types";

interface AuthState {
  token: string | null;
  user: ProfileResponse | null;
  setAuth: (token: string, user: ProfileResponse) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "tid-auth-storage", // localStorage key
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);