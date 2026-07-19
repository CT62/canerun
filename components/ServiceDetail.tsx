'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ServiceEntry } from '@/app/data/servicesCatalog';
import {
  ArrowsPointingOutIcon,
  CheckBadgeIcon,
  SparklesIcon,
  BeakerIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const ICONS: Record<string, typeof ArrowsPointingOutIcon> = {
  multiplication: ArrowsPointingOutIcon,
  certification: CheckBadgeIcon,
  cleaning: SparklesIcon,
  treating: BeakerIcon,
};

const ENQUIRY_EMAIL = 'admin@canerunenterprises.com';

export default function ServiceDetail({ service }: { service: ServiceEntry }) {
  const Icon = ICONS[service.icon];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.22),_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 pt-14 pb-20">
          <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-all mb-10">
            <ArrowLeftIcon className="w-4 h-4" />
            All Services
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-900/5 border border-slate-900/10 text-emerald-700 flex items-center justify-center mb-6">
              <Icon className="w-7 h-7" />
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/5 border border-slate-900/10 text-slate-700 text-[10px] font-bold uppercase tracking-wide">Toll Service</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-600/20 text-emerald-800 text-[10px] font-bold uppercase tracking-wide">Please Enquire</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{service.name}</h1>
            <p className="text-slate-700 text-sm sm:text-base mt-4 max-w-xl leading-relaxed">{service.tagline}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 -mt-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">About This Service</p>
            <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">{service.description}</p>
          </div>

          <div className="bg-slate-50 border-t border-slate-200 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-black text-slate-900">Pricing: Please Enquire</p>
              <p className="text-xs text-slate-500 mt-1">Every job is quoted individually — reach out with your seed lot and quantity.</p>
            </div>
            <a
              href={`mailto:${ENQUIRY_EMAIL}`}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 transition-all shrink-0"
            >
              <EnvelopeIcon className="w-4 h-4" />
              Enquire About This Service
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
