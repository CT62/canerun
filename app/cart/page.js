'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }), // Send the whole multi-item array over
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout error');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
          <Link href="/" className="text-sm text-green-600 hover:underline">← Back to Catalog</Link>
        </div>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Your cart is completely empty.</p>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 flex justify-between items-center mb-8">
              <span className="text-lg font-medium text-gray-600">Subtotal:</span>
              <span className="text-3xl font-extrabold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-sm"
            >
              {loading ? 'Processing Backend Parameters...' : 'Proceed to Secure Checkout'}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
