import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, AuthStore } from '@/types/auth';

interface ExtendedAuthStore extends AuthStore {
  hasHydrated: boolean;
  setHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<ExtendedAuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      setUser: (user: AuthUser) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      setHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
