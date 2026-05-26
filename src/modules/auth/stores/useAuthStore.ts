import { create } from "zustand";
import type { GetProfileResponse } from "../services/useAuthService";

type AuthState = {
  user: GetProfileResponse | null;
  setUser: (user: GetProfileResponse) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
