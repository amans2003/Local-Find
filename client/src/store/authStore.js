import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      provider: null,
      accessToken: null,
      role: null,
      hasHydrated: false,

      setUser: (user, token) => set({ user, accessToken: token, role: 'user', provider: null }),
      setProvider: (provider, token) => set({ provider, accessToken: token, role: 'provider', user: null }),
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => set({ user: null, provider: null, accessToken: null, role: null }),
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: 'localfind-auth',
      partialize: (state) => ({ user: state.user, provider: state.provider, role: state.role }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuthStore;
