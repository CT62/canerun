'use client';
import { useEffect } from 'react';
import { useCart } from '@/store/useCart';

// Reaching /success means Stripe confirmed payment — wipe the cart so a refresh
// or "back" navigation doesn't leave a paid-for order sitting in the cart.
export default function ClearCartOnSuccess() {
  const clearCart = useCart((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
