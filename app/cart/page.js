'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';
import { ArrowLeftIcon, TrashIcon, CreditCardIcon, ShoppingCartIcon, TruckIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [fulfillment, setFulfillment] = useState('ship');

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, fulfillment }), // Send the whole multi-item array over
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
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600">Checkout</span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">My Batch</h1>
          </div>
          <Link href="/store" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-all">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Catalog
          </Link>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mb-5">
                <ShoppingCartIcon className="w-8 h-8" />
              </div>
              <p className="text-slate-500 text-sm mb-6">Your batch is completely empty.</p>
              <Link href="/store" className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all">
                Browse the Catalog
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-8">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.weightOz}`} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <div>
                      <h3 className="font-black text-sm text-slate-900">{item.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-6 mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-3">Fulfillment</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFulfillment('ship')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border-2 transition-all ${fulfillment === 'ship' ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'}`}
                  >
                    <TruckIcon className="w-4 h-4" />
                    Ship to Me
                  </button>
                  <button
                    onClick={() => setFulfillment('pickup')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border-2 transition-all ${fulfillment === 'pickup' ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'}`}
                  >
                    <BuildingStorefrontIcon className="w-4 h-4" />
                    Pick Up
                  </button>
                </div>

                {fulfillment === 'pickup' && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed">
                    <p className="font-bold text-slate-900 mb-1">Pickup Location</p>
                    <p>Placeholder address — Cane Run Enterprises, Illinois [ADD TEXT HERE]</p>
                    <p className="mt-1">Placeholder hours — Mon–Fri, 8am–5pm. We&apos;ll email you when your batch is ready. [ADD TEXT HERE]</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Subtotal</span>
                <span className="text-3xl font-black text-slate-900">${totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
              >
                {fulfillment === 'pickup' ? <BuildingStorefrontIcon className="w-4 h-4" /> : <CreditCardIcon className="w-4 h-4" />}
                {loading ? 'Processing...' : fulfillment === 'pickup' ? 'Reserve for Pickup' : 'Proceed to Secure Checkout'}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
