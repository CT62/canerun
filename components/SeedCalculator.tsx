'use client';
import { useMemo, useState } from 'react';
import { useCart } from '@/store/useCart';
import { calculateTieredPrice } from '@/lib/pricing';
import { CALCULABLE_SEEDS, parseRateRange } from '@/lib/seedRates';
import FieldCoverageVisual from '@/components/FieldCoverageVisual';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const RATE_CHOICES = [
  { key: 'low', label: 'Least' },
  { key: 'mid', label: 'Recommended' },
  { key: 'high', label: 'Most' },
] as const;
type RateChoice = (typeof RATE_CHOICES)[number]['key'];

export default function SeedCalculator() {
  const { addToCart } = useCart();
  const [seedId, setSeedId] = useState(CALCULABLE_SEEDS[0]?.id ?? '');
  const [acres, setAcres] = useState('5');
  const [rateChoice, setRateChoice] = useState<RateChoice>('mid');
  const [manualLbs, setManualLbs] = useState('');

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
    return { lowLbs, highLbs, midLbs };
  }, [seed, acresNum]);

  const recommendedLbs = result ? { low: result.lowLbs, mid: result.midLbs, high: result.highLbs }[rateChoice] : 0;
  const manualLbsNum = parseFloat(manualLbs);
  const isManual = manualLbs !== '' && !isNaN(manualLbsNum) && manualLbsNum > 0;
  const selectedLbs = isManual ? manualLbsNum : recommendedLbs;
  const selectedPrice = seed && result ? calculateTieredPrice(seed.bulkPrice50lb, selectedLbs) : 0;

  const handleSeedChange = (id: string) => {
    setSeedId(id);
    setManualLbs('');
  };

  const handleAcresChange = (value: string) => {
    setAcres(value);
    setManualLbs('');
  };

  const handleRateChoice = (key: RateChoice) => {
    setRateChoice(key);
    setManualLbs('');
  };

  const handleAdd = () => {
    if (!seed || !result) return;
    addToCart({ ...seed, quantity: 1, price: selectedPrice, weightOz: Math.round(selectedLbs * 16) });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 sm:p-10 mb-10">
      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <div className="sm:col-span-2">
          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-2">Seed Variety</label>
          <select
            value={seedId}
            onChange={(e) => handleSeedChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          >
            {CALCULABLE_SEEDS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-2">Acreage</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={acres}
            onChange={(e) => handleAcresChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {result && seed ? (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          {result.lowLbs !== result.highLbs && (
            <div className="flex gap-2 mb-5">
              {RATE_CHOICES.map(({ key, label }) => {
                const lbs = { low: result.lowLbs, mid: result.midLbs, high: result.highLbs }[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleRateChoice(key)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold border-2 transition-all ${!isManual && rateChoice === key ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                  >
                    {label}
                    <span className="block text-[10px] font-normal opacity-80">{lbs} lbs</span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1 block">
                {isManual ? 'Custom amount' : result.lowLbs === result.highLbs ? 'Recommended' : RATE_CHOICES.find((c) => c.key === rateChoice)?.label}
              </label>
              <div className="flex items-baseline gap-1.5">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={manualLbs !== '' ? manualLbs : recommendedLbs}
                  onChange={(e) => setManualLbs(e.target.value)}
                  className="w-24 text-2xl font-black text-slate-900 dark:text-white border-b-2 border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 bg-transparent"
                />
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">lbs</span>
                {isManual && (
                  <button
                    onClick={() => setManualLbs('')}
                    className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Estimated total: <span className="font-bold text-emerald-600 dark:text-emerald-400">${selectedPrice.toFixed(2)}</span>
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-500/30 shrink-0"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              Add {selectedLbs} lbs to Batch
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <FieldCoverageVisual acres={acresNum} totalLbs={selectedLbs} />
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">Enter your acreage to see a recommended lbs range and estimated price.</p>
      )}
    </div>
  );
}
