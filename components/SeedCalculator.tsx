'use client';
import { useMemo, useState } from 'react';
import { SEED_CATALOG } from '@/app/data/seedCatalog';
import { useCart } from '@/store/useCart';
import { calculateTieredPrice } from '@/lib/pricing';
import { CalculatorIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

type Seed = {
  id: string;
  name: string;
  bulkPrice50lb: number;
  specs?: { lbsAcre?: string };
} & Record<string, unknown>;

const CATALOG = SEED_CATALOG as Seed[];

// Only the "X to Y" / single-number lbsAcre spec format is parsed reliably.
// Free-text wildlife `rate` strings (e.g. "Broadcast 50 lb per acre, cover 1/4 inch deep")
// mix seeding rate and planting depth numbers together, so they're intentionally excluded
// rather than risk recommending the wrong figure.
function parseRateRange(text?: string): [number, number] | null {
  if (!text) return null;
  const rangeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:to|-|–)\s*(\d+(?:\.\d+)?)/i);
  if (rangeMatch) return [parseFloat(rangeMatch[1]), parseFloat(rangeMatch[2])];
  const singleMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    const n = parseFloat(singleMatch[1]);
    return [n, n];
  }
  return null;
}

const CALCULABLE_SEEDS = CATALOG.filter((s) => parseRateRange(s.specs?.lbsAcre));

export default function SeedCalculator() {
  const { addToCart } = useCart();
  const [seedId, setSeedId] = useState(CALCULABLE_SEEDS[0]?.id ?? '');
  const [acres, setAcres] = useState('5');

  const seed = CALCULABLE_SEEDS.find((s) => s.id === seedId);
  const acresNum = parseFloat(acres);

  const result = useMemo(() => {
    if (!seed || !acresNum || acresNum <= 0) return null;
    const rateRange = parseRateRange(seed.specs?.lbsAcre);
    if (!rateRange) return null;
    const [lowRate, highRate] = rateRange;
    const lowLbs = Math.round(lowRate * acresNum);
    const highLbs = Math.round(highRate * acresNum);
    const midLbs = Math.max(1, Math.round((lowLbs + highLbs) / 2));
    const price = calculateTieredPrice(seed.bulkPrice50lb, midLbs);
    return { lowLbs, highLbs, midLbs, price };
  }, [seed, acresNum]);

  const handleAdd = () => {
    if (!seed || !result) return;
    addToCart({ ...seed, quantity: 1, price: result.price, weightOz: result.midLbs * 16 });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CalculatorIcon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600">Seed Calculator</span>
          <h2 className="text-lg font-black text-slate-900">How much do I need?</h2>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-2">
          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block mb-2">Seed Variety</label>
          <select
            value={seedId}
            onChange={(e) => setSeedId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
          >
            {CALCULABLE_SEEDS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block mb-2">Acreage</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={acres}
            onChange={(e) => setAcres(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {result && seed ? (
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Recommended</p>
            <p className="text-2xl font-black text-slate-900">
              {result.lowLbs === result.highLbs ? `${result.lowLbs} lbs` : `${result.lowLbs}–${result.highLbs} lbs`}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Estimated total: <span className="font-bold text-emerald-600">${result.price.toFixed(2)}</span> at {result.midLbs} lbs
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/30 shrink-0"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            Add {result.midLbs} lbs to Batch
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400 mt-5 pt-5 border-t border-slate-100">Enter your acreage to see a recommended lbs range and estimated price.</p>
      )}
    </div>
  );
}
