'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';
import { SERVICES_CATALOG } from '@/app/data/servicesCatalog';
import { ShoppingCartIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { cart } = useCart();
  const [servicesOpen, setServicesOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalLbs = Math.round(cart.reduce((sum, item) => sum + (item.weightOz || 0) * item.quantity, 0) / 16);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-emerald-600">Cane Run</span>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">Enterprises</h1>
        </Link>
        <div className="flex items-center gap-2 sm:gap-6">
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-all">Home</Link>
            <Link href="/store" className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-all">Store</Link>
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                href="/services"
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-all"
              >
                Services
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </Link>
              {servicesOpen && (
                <div className="absolute top-full left-0 pt-3 w-64">
                  <div className="rounded-2xl bg-white border border-slate-200 shadow-xl py-2">
                    {SERVICES_CATALOG.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="block px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-all"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
          {totalLbs > 0 && (
            <span className="hidden sm:inline text-[10px] font-bold text-slate-400 uppercase tracking-wide">{totalLbs.toLocaleString()} lbs</span>
          )}
          <Link href="/cart" className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 transition-all text-xs font-bold shadow-lg shadow-emerald-500/20">
            <ShoppingCartIcon className="w-4 h-4" />
            <span>My Batch</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">{totalItems}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
