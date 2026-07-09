import { create } from 'zustand';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weightOz: number;
} & Record<string, unknown>;

type CartState = {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>((set) => ({
  cart: [],
  addToCart: (product) => set((state) => {
    const quantityToAdd = product.quantity ?? 1;
    const existing = state.cart.find((item) => item.id === product.id && item.weightOz === product.weightOz);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantityToAdd } : item
        ),
      };
    }
    return { cart: [...state.cart, { ...product, quantity: quantityToAdd } as CartItem] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== productId),
  })),
  clearCart: () => set({ cart: [] }),
}));
