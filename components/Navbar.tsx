'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/useCart';
import { SERVICES_CATALOG } from '@/app/data/servicesCatalog';
import { ShoppingCartIcon, ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const { cart } = useCart();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalLbs = Math.round(cart.reduce((sum, item) => sum + (item.weightOz || 0) * item.quantity, 0) / 16);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/images/site_images/logo.png" alt="Cane Run Enterprises" width={1241} height={491} className="h-8 sm:h-9 w-auto rounded-md dark:invert dark:hue-rotate-180" priority />
        </Link>
        <div className="flex items-center gap-2 sm:gap-6">
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">Home</Link>
            <Link href="/store" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">Store</Link>
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                href="/services"
                className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
              >
                Services
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </Link>
              {servicesOpen && (
                <div className="absolute top-full left-0 pt-3 w-64">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl py-2">
                    {SERVICES_CATALOG.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="block px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
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
            <span className="hidden sm:inline text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{totalLbs.toLocaleString()} lbs</span>
          )}
          {totalItems > 0 && (
            <Link href="/cart" className="flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-bold">
              <ShoppingCartIcon className="w-4 h-4" />
              <span>My Batch</span>
              <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-0.5 rounded-md text-[10px]">{totalItems}</span>
            </Link>
          )}
          <ThemeToggle className="hidden sm:flex" />
          <button
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500 transition-all"
          >
            {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">Home</Link>
              <Link href="/store" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">Store</Link>
              <div>
                <button
                  onClick={() => setMobileServicesOpen((open) => !open)}
                  aria-expanded={mobileServicesOpen}
                  className="w-full flex items-center justify-between py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                >
                  Services
                  <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="pl-4 flex flex-col gap-1 overflow-hidden"
                    >
                      <Link href="/services" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">All Services</Link>
                      {SERVICES_CATALOG.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="pt-2 flex items-center justify-between">
                {totalLbs > 0 ? (
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{totalLbs.toLocaleString()} lbs in batch</span>
                ) : <span />}
                <ThemeToggle />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
