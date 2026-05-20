import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);
        
        if (!existingItem) {
          set({ items: [...items, product] });
        }
      },
      
      removeFromWishlist: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
      
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      }
    }),
    {
      name: 'wishlist-storage', // saves to localStorage
    }
  )
);

export default useWishlistStore;
