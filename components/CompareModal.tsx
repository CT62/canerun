'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { calculateTieredPrice } from '@/lib/pricing';
import { formatSpecKey } from '@/lib/format';

type Seed = {
  id: string;
  name: string;
  category: string;
  desc: string;
  bulkPrice50lb: number;
  img?: string;
  specs?: Record<string, unknown>;
} & Record<string, unknown>;

export default function CompareModal({ seeds, onClose }: { seeds: Seed[]; onClose: () => void }) {
  const specKeys = Array.from(new Set(seeds.flatMap((s) => Object.keys(s.specs || {}))));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full shadow-2xl max-h-[88vh] overflow-y-auto p-8 sm:p-10"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm transition-all"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>

        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">Side-by-Side</span>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 mb-6 pr-10">Compare Varieties</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide pb-3 pr-4 w-40">&nbsp;</th>
                {seeds.map((seed) => (
                  <th key={seed.id} className="text-left pb-3 px-3 min-w-[180px]">
                    {seed.img && seed.img !== '/images/black.png' && (
                      <div className="relative h-20 w-full rounded-xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800">
                        <Image src={seed.img} alt={seed.name} fill sizes="200px" className="object-cover" />
                      </div>
                    )}
                    <p className="text-sm font-black text-slate-900 dark:text-white leading-snug">{seed.name}</p>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{seed.category}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100 dark:border-slate-800">
                <td className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-3 pr-4">From</td>
                {seeds.map((seed) => (
                  <td key={seed.id} className="py-3 px-3 text-sm font-black text-slate-900 dark:text-white">
                    ${(calculateTieredPrice(seed.bulkPrice50lb, 5) / 5).toFixed(2)}/lb
                  </td>
                ))}
              </tr>
              {specKeys.map((key) => (
                <tr key={key} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-3 pr-4 align-top">{formatSpecKey(key)}</td>
                  {seeds.map((seed) => (
                    <td key={seed.id} className="py-3 px-3 text-sm font-bold text-slate-900 dark:text-white align-top">
                      {seed.specs?.[key] !== undefined ? String(seed.specs[key]) : <span className="text-slate-300 dark:text-slate-600 font-normal">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-slate-100 dark:border-slate-800">
                <td className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide py-3 pr-4 align-top">Description</td>
                {seeds.map((seed) => (
                  <td key={seed.id} className="py-3 px-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed align-top">{seed.desc}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
