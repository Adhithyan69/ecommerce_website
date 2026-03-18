import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,         // { uid, email, displayName, photoURL, role }
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (user) => set({ user, isAuthenticated: true }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'ag-auth-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
