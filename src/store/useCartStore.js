import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // Array of { id, name, price, quantity, size, color, image }
      total: 0,
      
      // Actions
      addItem: (newItem) => {
        const { items } = get();
        // Check if item already exists with same variants
        const existingItemIndex = items.findIndex(
          (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
        );

        let updatedItems = [];

        if (existingItemIndex >= 0) {
          // Increase quantity
          updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
        } else {
          // Add new item
          updatedItems = [...items, { ...newItem, quantity: newItem.quantity || 1 }];
        }

        // Calculate generic total
        const newTotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        set({ items: updatedItems, total: newTotal });
      },

      removeItem: (id, size, color) => {
        const { items } = get();
        const updatedItems = items.filter(
          (item) => !(item.id === id && item.size === size && item.color === color)
        );
        const newTotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        set({ items: updatedItems, total: newTotal });
      },

      updateQuantity: (id, size, color, newQuantity) => {
        if (newQuantity <= 0) return get().removeItem(id, size, color);

        const { items } = get();
        const updatedItems = items.map((item) => {
          if (item.id === id && item.size === size && item.color === color) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        
        const newTotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        set({ items: updatedItems, total: newTotal });
      },

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'ag-cart-storage',
    }
  )
);

export default useCartStore;
