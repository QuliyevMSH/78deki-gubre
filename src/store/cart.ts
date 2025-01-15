import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateItems: (items: CartItem[]) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: Product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.products.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.products.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: product.id,
            quantity,
            products: product
          };
          set({ items: [...items, newItem] });
        }
      },
      removeItem: (productId: number) => {
        set({ items: get().items.filter((item) => item.products.id !== productId) });
      },
      updateQuantity: (productId: number, quantity: number) => {
        set({
          items: get().items.map((item) =>
            item.products.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      updateItems: (items: CartItem[]) => {
        set({ items });
      },
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce(
          (total, item) => total + item.products.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);