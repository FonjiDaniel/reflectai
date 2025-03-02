import { create } from 'zustand';
import { persist, PersistStorage, StorageValue } from 'zustand/middleware';

interface AuthState {
  currentUser: { name: string; email: string; token: string } | null;
  isLoggedIn: boolean;
  login: (name: string, email: string, token: string) => void;
  logout: () => void;
}

// Custom sessionStorage wrapper for Zustand
const sessionStorageProvider: PersistStorage<AuthState> = {
  getItem: (name) => {
    const value = sessionStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name, value: StorageValue<AuthState>) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isLoggedIn: false,
      login: (name, email, token) =>
        set({ currentUser: { name, email, token }, isLoggedIn: true }),
      logout: () => set({ currentUser: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: sessionStorageProvider, // Corrected storage implementation
    }
  )
);
