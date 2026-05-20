import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSellerStore = create(
  persist(
    (set, get) => ({
      store: null,           // { name, logo, banner, description, gst, currency }
      products: [],          // seller's imported/added products
      notifications: [],
      unreadCount: 0,

      setStore: (store) => set({ store }),
      setProducts: (products) => set({ products }),
      addProduct: (product) => set(s => ({ products: [product, ...s.products] })),
      updateProduct: (id, updates) => set(s => ({
        products: s.products.map(p => p.id === id ? { ...p, ...updates } : p),
      })),
      removeProduct: (id) => set(s => ({ products: s.products.filter(p => p.id !== id) })),
      setNotifications: (notifications) => set({ notifications, unreadCount: notifications.filter(n => !n.read).length }),
    }),
    {
      name: 'ag-seller-storage',
      partialize: (state) => ({ store: state.store }),
    }
  )
);

export default useSellerStore;
