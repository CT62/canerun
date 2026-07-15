'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SERVICES_CATALOG } from '../data/servicesCatalog';
import {
  ArrowsPointingOutIcon,
  CheckBadgeIcon,
  SparklesIcon,
  BeakerIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const ICONS: Record<string, typeof ArrowsPointingOutIcon> = {
  multiplication: ArrowsPointingOutIcon,
  certification: CheckBadgeIcon,
  cleaning: SparklesIcon,
  treating: BeakerIcon,
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.22),_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-400 mb-5">
              Toll Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Services</h1>
            <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
              Beyond our seed catalog, we offer toll services on your own seed lots. Every service below is
              priced per job — please enquire and we&apos;ll put a quote together for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-8 pb-24">
        <div className="grid sm:grid-cols-2 gap-6">
          {SERVICES_CATALOG.map((service, i) => {
            const Icon = ICONS[service.icon];
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex flex-col h-full p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide">Toll Service</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">Please Enquire</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mb-2">{service.name}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{service.summary}</p>
                  <span className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-emerald-600">
                    Learn more
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
