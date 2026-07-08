import Link from 'next/link';
import { CheckCircleIcon, ArrowRightIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ fulfillment?: string }>;
}) {
  const { fulfillment } = await searchParams;
  const isPickup = fulfillment === 'pickup';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          {isPickup ? <BuildingStorefrontIcon className="w-9 h-9" /> : <CheckCircleIcon className="w-9 h-9" />}
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600">Order Confirmed</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2 mb-3">
          {isPickup ? 'Your batch is reserved!' : 'Thank you for your order!'}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          {isPickup
            ? "We'll email you as soon as your batch is ready for pickup at our Illinois location. Placeholder hours — Mon–Fri, 8am–5pm. [ADD TEXT HERE]"
            : 'Your seed purchase is being batched for weekly fulfillment. A confirmation email with your order details is on its way.'}
        </p>
        <Link
          href="/store"
          className="group inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all"
        >
          Continue Shopping
          <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </main>
  );
}
