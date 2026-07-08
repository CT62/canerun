'use client';
import { CartProvider } from '@/store/useCart';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
