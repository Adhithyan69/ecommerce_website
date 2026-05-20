import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,         // { uid, email, displayName, photoURL, role, token }
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (user) => set({ user, isAuthenticated: true }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Computed helpers
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin' || user?.role === 'superadmin';
      },
      isSuperAdmin: () => get().user?.role === 'superadmin',
    }),
    {
      name: 'ag-auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
