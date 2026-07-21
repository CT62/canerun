'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/store/useCart';
import { SEED_CATALOG } from '../data/seedCatalog';
import { motion, AnimatePresence } from 'framer-motion';
import { ScaleIcon, XMarkIcon, ShoppingCartIcon, MinusIcon, PlusIcon, ArrowsRightLeftIcon, ChevronDownIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { calculateTieredPrice } from '@/lib/pricing';
import { formatSpecKey } from '@/lib/format';
import SeedCalculator from '@/components/SeedCalculator';
import PriceTierChart from '@/components/PriceTierChart';
import CompareBar from '@/components/CompareBar';
import CompareModal from '@/components/CompareModal';

const TABS = ['all', 'turf', 'pasture', 'cover', 'wildlife'];
const WEIGHT_PRESETS = [5, 10, 25, 50];
const MAX_COMPARE = 3;

export default function StorePage() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSeed, setSelectedSeed] = useState<any>(null);
  const [customPounds, setCustomPounds] = useState(50);
  const [bagQuantity, setBagQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const products = activeTab === 'all' ? SEED_CATALOG : SEED_CATALOG.filter(p => p.category === activeTab);
  const compareSeeds = compareIds.map((id) => SEED_CATALOG.find((s: any) => s.id === id)).filter(Boolean) as any[];

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">Product Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">Seed & Forage Inventory</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed">Browse our full lineup of turf, pasture, cover crop, and wildlife seed. Select a variety to configure your bag weight and see live tiered pricing.</p>
        </div>

        <div className="mb-10">
          <button
            onClick={() => setCalculatorOpen((v) => !v)}
            className="w-full flex items-center gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm px-8 py-6 hover:border-emerald-500 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CalculatorIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">Seed Calculator</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">How much do I need?</h2>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform shrink-0 ${calculatorOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence initial={false}>
            {calculatorOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <SeedCalculator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 mb-10 overflow-x-auto">
          {TABS.map(tab => {
            const count = tab === 'all' ? SEED_CATALOG.length : SEED_CATALOG.filter(p => p.category === tab).length;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/10' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'}`}>
                {tab}
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab ? 'bg-white/20 dark:bg-slate-900/10' : 'bg-slate-100 dark:bg-slate-800'}`}>{count}</span>
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
              const hasImage = seed.img && seed.img !== '/images/black.png';
              return (
                <motion.div key={seed.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col overflow-hidden">
                  {hasImage && (
                    <div className="relative h-28 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <Image
                        src={seed.img}
                        alt={seed.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
                      <span className="absolute bottom-2.5 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-emerald-700 text-[9px] font-bold uppercase tracking-widest shadow-sm">{seed.category}</span>
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    {!hasImage && <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{seed.category}</span>}
                    <h3 className={`text-xl font-black text-slate-900 dark:text-white mb-3 ${hasImage ? 'mt-1' : 'mt-2'}`}>{seed.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-5 leading-relaxed">{seed.desc}</p>

                    {(rate || cycle) && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {cycle && <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wide">{cycle}</span>}
                        {rate && <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wide">{rate}</span>}
                      </div>
                    )}

                    <div className="mt-auto">
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">From <span className="text-slate-900 dark:text-white font-bold">${startingPrice.toFixed(2)}</span>/lb</p>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedSeed(seed); setCustomPounds(50); setBagQuantity(1); }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all">
                          <ScaleIcon className="w-4 h-4" />
                          Configure Bag Weight
                        </button>
                        <button
                          onClick={() => toggleCompare(seed.id)}
                          disabled={!compareIds.includes(seed.id) && compareIds.length >= MAX_COMPARE}
                          aria-label={compareIds.includes(seed.id) ? `Remove ${seed.name} from comparison` : `Add ${seed.name} to comparison`}
                          title={compareIds.includes(seed.id) ? 'Remove from comparison' : 'Add to comparison'}
                          className={`w-11 h-11 flex items-center justify-center rounded-xl border-2 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${compareIds.includes(seed.id) ? 'bg-slate-200 dark:bg-slate-700 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-white' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-900 dark:hover:border-slate-100 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                          <ArrowsRightLeftIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full shadow-2xl max-h-[88vh] overflow-y-auto sm:overflow-hidden grid sm:grid-cols-5">
              <button
                onClick={() => setSelectedSeed(null)}
                aria-label="Close"
                className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm transition-all"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>

              {/* Product info */}
              <div className="sm:col-span-3 p-8 sm:p-10 sm:overflow-y-auto sm:max-h-[88vh]">
                {selectedSeed.img && selectedSeed.img !== '/images/black.png' && (
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                    <Image src={selectedSeed.img} alt={selectedSeed.name} fill sizes="(max-width: 640px) 100vw, 60vw" className="object-cover" />
                  </div>
                )}
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{selectedSeed.category}</span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 pr-10">{selectedSeed.name}</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 leading-relaxed">{selectedSeed.desc}</p>

                {selectedSeed.specs && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    {Object.entries(selectedSeed.specs).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-wide">{formatSpecKey(key)}</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSeed.details && (
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">Growing Notes</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selectedSeed.details}</p>
                  </div>
                )}
              </div>

              {/* Weight configurator */}
              <div className="sm:col-span-2 bg-slate-50 dark:bg-slate-800 p-8 sm:p-10 flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-4">Configure Bag Weight</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Weight: <span className="font-bold text-slate-900 dark:text-white">{customPounds} lbs</span></p>
                  <div className="flex gap-2 mb-5">
                    {WEIGHT_PRESETS.map(preset => (
                      <button key={preset} onClick={() => setCustomPounds(preset)} className={`flex-1 py-3 rounded-lg text-sm font-black border-2 transition-all ${customPounds === preset ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'}`}>
                        {preset}
                      </button>
                    ))}
                  </div>
                  <input type="range" min="5" max="50" value={customPounds} onChange={(e) => setCustomPounds(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600" />

                  <div className="mt-6 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <PriceTierChart bulkPrice50lb={selectedSeed.bulkPrice50lb} pounds={customPounds} />
                  </div>

                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mt-6 mb-3">Number of Bags</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setBagQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Fewer bags"
                      className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center text-lg font-black text-slate-900 dark:text-white">{bagQuantity}× {customPounds} lbs</span>
                    <button
                      onClick={() => setBagQuantity((q) => q + 1)}
                      aria-label="More bags"
                      className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-8 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">Total Price</p>
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${(calculateTieredPrice(selectedSeed.bulkPrice50lb, customPounds) * bagQuantity).toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setSelectedSeed(null)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition-all">
                    <XMarkIcon className="w-4 h-4" />
                    Cancel
                  </button>
                  <button onClick={() => { addToCart({ ...selectedSeed, quantity: bagQuantity, price: calculateTieredPrice(selectedSeed.bulkPrice50lb, customPounds), weightOz: customPounds * 16 }); setSelectedSeed(null); }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/30">
                    <ShoppingCartIcon className="w-4 h-4" />
                    Add to Batch
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CompareBar
        seeds={compareSeeds}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
        onCompare={() => setCompareOpen(true)}
      />

      <AnimatePresence>
        {compareOpen && compareSeeds.length > 0 && (
          <CompareModal seeds={compareSeeds} onClose={() => setCompareOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
