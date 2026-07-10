'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

type Seed = { id: string; name: string } & Record<string, unknown>;

export default function CompareBar({
  seeds,
  onRemove,
  onClear,
  onCompare,
}: {
  seeds: Seed[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}) {
  return (
    <AnimatePresence>
      {seeds.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-2xl"
        >
          <div className="flex items-center gap-4 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-900/30 px-5 py-4">
            <div className="flex items-center gap-2 text-emerald-400 shrink-0">
              <ArrowsRightLeftIcon className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wide">Compare ({seeds.length}/3)</span>
            </div>
            <div className="flex-1 flex flex-wrap gap-2 min-w-0">
              {seeds.map((seed) => (
                <span key={seed.id} className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg bg-white/10 text-xs font-bold truncate">
                  {seed.name}
                  <button onClick={() => onRemove(seed.id)} aria-label={`Remove ${seed.name}`} className="hover:text-red-400 transition-all">
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={onClear} className="px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all">
                Clear
              </button>
              <button
                onClick={onCompare}
                disabled={seeds.length < 2}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-xs font-bold transition-all"
              >
                Compare
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
