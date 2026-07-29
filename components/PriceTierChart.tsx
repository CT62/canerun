'use client';

const TIERS = [
  { min: 1, multiplier: 1.65 },
  { min: 10, multiplier: 1.35 },
  { min: 25, multiplier: 1.15 },
  { min: 50, multiplier: 1.0 },
] as const;

function activeTierIndex(pounds: number) {
  if (pounds < 10) return 0;
  if (pounds < 25) return 1;
  if (pounds < 50) return 2;
  return 3;
}

export default function PriceTierChart({ bulkPrice50lb, pounds }: { bulkPrice50lb: number; pounds: number }) {
  const baseRate = bulkPrice50lb / 50;
  const rate = baseRate * TIERS[activeTierIndex(pounds)].multiplier;

  return (
    <div className="flex items-baseline justify-between">
      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Price per lb</p>
      <p aria-live="polite" className="text-lg font-black text-emerald-600 dark:text-emerald-400">
        ${rate.toFixed(2)}<span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">/lb</span>
      </p>
    </div>
  );
}
