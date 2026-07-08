'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/store/useCart';
import { SEED_CATALOG } from '../data/seedCatalog';
import { motion, AnimatePresence } from 'framer-motion';
import { ScaleIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { calculateTieredPrice } from '@/lib/pricing';
import SeedCalculator from '@/components/SeedCalculator';

const TABS = ['all', 'turf', 'pasture', 'cover', 'wildlife'];
const WEIGHT_PRESETS = [5, 10, 25, 50];

function formatSpecKey(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

export default function StorePage() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSeed, setSelectedSeed] = useState<any>(null);
  const [customPounds, setCustomPounds] = useState(50);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const products = activeTab === 'all' ? SEED_CATALOG : SEED_CATALOG.filter(p => p.category === activeTab);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600">Product Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">Seed & Forage Inventory</h1>
          <p className="text-slate-600 text-sm mt-3 max-w-2xl leading-relaxed">Browse our full lineup of turf, pasture, cover crop, and wildlife seed. Select a variety to configure your bag weight and see live tiered pricing.</p>
        </div>

        <SeedCalculator />

        <div className="flex gap-2 mb-10 overflow-x-auto">
          {TABS.map(tab => {
            const count = tab === 'all' ? SEED_CATALOG.length : SEED_CATALOG.filter(p => p.category === tab).length;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'}`}>
                {tab}
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab ? 'bg-white/20' : 'bg-slate-100'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {products.map((seed: any) => {
              const startingPrice = calculateTieredPrice(seed.bulkPrice50lb, 5) / 5;
              const rate = seed.specs?.lbsAcre ? `${seed.specs.lbsAcre} lbs/acre` : seed.specs?.rate;
              const cycle = seed.specs?.cycle || seed.specs?.type;
              return (
                <motion.div key={seed.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-emerald-500 transition-all shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{seed.category}</span>
                  <h3 className="text-xl font-black text-slate-900 mt-2 mb-3">{seed.name}</h3>
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed">{seed.desc}</p>

                  {(rate || cycle) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {cycle && <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide">{cycle}</span>}
                      {rate && <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide">{rate}</span>}
                    </div>
                  )}

                  <div className="mt-auto">
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-3">From <span className="text-slate-900 font-bold">${startingPrice.toFixed(2)}</span>/lb</p>
                    <button onClick={() => { setSelectedSeed(seed); setCustomPounds(50); }} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white border-2 border-slate-900 hover:bg-emerald-600 hover:border-emerald-600 rounded-xl text-xs font-bold transition-all shadow-sm">
                      <ScaleIcon className="w-4 h-4" />
                      Configure Bag Weight
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedSeed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl max-h-[88vh] overflow-hidden grid sm:grid-cols-5">
              <button
                onClick={() => setSelectedSeed(null)}
                aria-label="Close"
                className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-white/90 hover:bg-slate-100 text-slate-600 shadow-sm transition-all"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>

              {/* Product info */}
              <div className="sm:col-span-3 p-8 sm:p-10 overflow-y-auto max-h-[88vh]">
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{selectedSeed.category}</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1 pr-10">{selectedSeed.name}</h2>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">{selectedSeed.desc}</p>

                {selectedSeed.specs && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-6 pt-6 border-t border-slate-100">
                    {Object.entries(selectedSeed.specs).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-[10px] text-slate-600 uppercase tracking-wide">{formatSpecKey(key)}</p>
                        <p className="text-sm font-bold text-slate-900">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSeed.details && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">Growing Notes</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedSeed.details}</p>
                  </div>
                )}
              </div>

              {/* Weight configurator */}
              <div className="sm:col-span-2 bg-slate-50 p-8 sm:p-10 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-4">Configure Bag Weight</p>
                  <p className="text-sm text-slate-600 mb-4">Weight: <span className="font-bold text-slate-900">{customPounds} lbs</span></p>
                  <div className="flex gap-2 mb-5">
                    {WEIGHT_PRESETS.map(preset => (
                      <button key={preset} onClick={() => setCustomPounds(preset)} className={`flex-1 py-3 rounded-lg text-sm font-black border-2 transition-all ${customPounds === preset ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-white border-slate-300 text-slate-900 hover:border-emerald-500 hover:text-emerald-600'}`}>
                        {preset}
                      </button>
                    ))}
                  </div>
                  <input type="range" min="5" max="50" value={customPounds} onChange={(e) => setCustomPounds(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />

                  <div className="mt-8 p-5 rounded-2xl bg-white border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Total Price</p>
                    <div className="text-3xl font-black text-emerald-600">${calculateTieredPrice(selectedSeed.bulkPrice50lb, customPounds).toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setSelectedSeed(null)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all">
                    <XMarkIcon className="w-4 h-4" />
                    Cancel
                  </button>
                  <button onClick={() => { addToCart({ ...selectedSeed, quantity: 1, price: calculateTieredPrice(selectedSeed.bulkPrice50lb, customPounds), weightOz: customPounds * 16 }); setSelectedSeed(null); }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/30">
                    <ShoppingCartIcon className="w-4 h-4" />
                    Add to Batch
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
