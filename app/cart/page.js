'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';
import { ArrowLeftIcon, TrashIcon, CreditCardIcon, ShoppingCartIcon, TruckIcon, BuildingStorefrontIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { estimatePallets } from '@/lib/freight';

const EMPTY_ADDRESS = {
  name: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  cityLocality: '',
  stateProvince: '',
  postalCode: '',
  countryCode: 'US',
};
const REQUIRED_ADDRESS_FIELDS = ['name', 'phone', 'addressLine1', 'cityLocality', 'stateProvince', 'postalCode', 'countryCode'];

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [fulfillment, setFulfillment] = useState('ship');
  const [shipTo, setShipTo] = useState(EMPTY_ADDRESS);
  const [shippingLoading, setShippingLoading] = useState(false);
  // Keyed by the address/weight it was fetched for, so a stale response never gets
  // shown against a since-edited address without needing to reset state in an effect.
  const [rateResult, setRateResult] = useState(null);

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalOunces = cart.reduce((sum, item) => sum + (item.weightOz || 0) * item.quantity, 0);
  const totalLbs = totalOunces / 16;
  const bagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const palletEstimate = estimatePallets(totalLbs);

  const addressComplete = REQUIRED_ADDRESS_FIELDS.every((field) => shipTo[field]?.trim());
  const rateKey = fulfillment === 'ship' && cart.length > 0 && addressComplete
    ? `${totalOunces}|${JSON.stringify(shipTo)}`
    : null;

  const shippingRate = rateResult?.key === rateKey ? rateResult.rate : null;
  const shippingError = rateResult?.key === rateKey ? rateResult.error : null;
  const shippingPending = Boolean(rateKey) && shippingLoading && rateResult?.key !== rateKey;
  const grandTotal = totalPrice + (fulfillment === 'ship' && shippingRate ? shippingRate.amount : 0);

  // Quote a live shipping rate from ShipEngine once the address is complete, debounced
  // so we're not firing a request on every keystroke.
  useEffect(() => {
    if (!rateKey) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setShippingLoading(true);
      try {
        const res = await fetch('/api/shipping/rate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shipTo, totalOunces }),
        });
        const data = await res.json();
        if (!cancelled) {
          setRateResult({ key: rateKey, rate: data.rate || null, error: data.rate ? null : (data.error || 'Could not calculate shipping for this address.') });
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setRateResult({ key: rateKey, rate: null, error: 'Could not calculate shipping for this address.' });
        }
      } finally {
        if (!cancelled) setShippingLoading(false);
      }
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [rateKey, shipTo, totalOunces]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (fulfillment === 'ship' && !shippingRate) return;
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          fulfillment,
          ...(fulfillment === 'ship' ? { shipTo } : {}),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Checkout error');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateAddress = (field) => (e) => setShipTo((prev) => ({ ...prev, [field]: e.target.value }));

  const inputClass = 'w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500';

  const checkoutDisabled = loading || (fulfillment === 'ship' && (!shippingRate || shippingPending));

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

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <ScaleIcon className="w-4 h-4 text-emerald-600 mb-2" />
                  <p className="text-lg font-black text-slate-900">{totalLbs.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Total Lbs</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-lg font-black text-slate-900">{bagCount}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Bags in Batch</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-lg font-black text-slate-900">~{palletEstimate}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Est. Pallet{palletEstimate === 1 ? '' : 's'}</p>
                </div>
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

                {fulfillment === 'ship' && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 space-y-3">
                    <p className="font-bold text-slate-900 text-xs mb-1">Shipping Address</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input className={inputClass} placeholder="Full name" value={shipTo.name} onChange={updateAddress('name')} />
                      <input className={inputClass} placeholder="Phone" value={shipTo.phone} onChange={updateAddress('phone')} />
                    </div>
                    <input className={inputClass} placeholder="Address line 1" value={shipTo.addressLine1} onChange={updateAddress('addressLine1')} />
                    <input className={inputClass} placeholder="Address line 2 (optional)" value={shipTo.addressLine2} onChange={updateAddress('addressLine2')} />
                    <div className="grid grid-cols-3 gap-2">
                      <input className={inputClass} placeholder="City" value={shipTo.cityLocality} onChange={updateAddress('cityLocality')} />
                      <input className={inputClass} placeholder="State" value={shipTo.stateProvince} onChange={updateAddress('stateProvince')} />
                      <input className={inputClass} placeholder="ZIP" value={shipTo.postalCode} onChange={updateAddress('postalCode')} />
                    </div>
                    <select className={inputClass} value={shipTo.countryCode} onChange={updateAddress('countryCode')}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>

                    <div className="pt-1 text-xs">
                      {shippingPending && <span className="text-slate-500">Calculating shipping…</span>}
                      {!shippingPending && shippingError && <span className="text-red-500 font-bold">{shippingError}</span>}
                      {!shippingPending && !shippingError && shippingRate && (
                        <span className="text-emerald-600 font-bold">
                          {shippingRate.carrierFriendlyName} {shippingRate.serviceType} — ${shippingRate.amount.toFixed(2)}
                        </span>
                      )}
                      {!shippingPending && !shippingError && !shippingRate && (
                        <span className="text-slate-400">Enter your address above to calculate shipping.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Subtotal</span>
                  <span className="text-sm font-bold text-slate-700">${totalPrice.toFixed(2)}</span>
                </div>
                {fulfillment === 'ship' && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Shipping</span>
                    <span className="text-sm font-bold text-slate-700">{shippingRate ? `$${shippingRate.amount.toFixed(2)}` : '—'}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total</span>
                  <span className="text-3xl font-black text-slate-900">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutDisabled}
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
