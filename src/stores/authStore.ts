import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthStore {
  accessToken: string | null;
  expiresAt: string | null;
  setToken: (token: string, expiresAt: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      expiresAt: null,
      setToken: (token, expiresAt) => set({ accessToken: token, expiresAt }),
      logout: () => set({ accessToken: null, expiresAt: null }),
    }),
    {
      name: 'shopify-auth-token',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

