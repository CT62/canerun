import { create } from 'zustand';

export const useCart = create((set) => ({
  cart: [],
  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id && item.weightOz === product.weightOz);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== productId),
  })),
  clearCart: () => set({ cart: [] }),
}));
