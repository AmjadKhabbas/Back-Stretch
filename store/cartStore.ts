import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color?: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    getCartTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            itemCount: 0,

            addItem: (item) => set((state) => {
                const existing = state.items.find((i) => i.id === item.id);
                const newItems = existing
                    ? state.items.map((i) =>
                        i.id === item.id
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    )
                    : [...state.items, item];

                return {
                    items: newItems,
                    itemCount: newItems.reduce((acc, i) => acc + i.quantity, 0)
                };
            }),

            removeItem: (id) => set((state) => {
                const newItems = state.items.filter((i) => i.id !== id);
                return {
                    items: newItems,
                    itemCount: newItems.reduce((acc, i) => acc + i.quantity, 0)
                };
            }),

            updateQuantity: (id, quantity) => set((state) => {
                if (quantity < 1) return state;
                const newItems = state.items.map((i) =>
                    i.id === id ? { ...i, quantity } : i
                );
                return {
                    items: newItems,
                    itemCount: newItems.reduce((acc, i) => acc + i.quantity, 0)
                };
            }),

            clearCart: () => set({ items: [], itemCount: 0 }),

            getCartTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.price * item.quantity, 0);
            }
        }),
        { name: 'flexcore-cart' }
    )
);
