'use client';

const TIERS = [
  { label: '1–9 lb', min: 1, multiplier: 1.65 },
  { label: '10–24 lb', min: 10, multiplier: 1.35 },
  { label: '25–49 lb', min: 25, multiplier: 1.15 },
  { label: '50+ lb', min: 50, multiplier: 1.0 },
] as const;

function activeTierIndex(pounds: number) {
  if (pounds < 10) return 0;
  if (pounds < 25) return 1;
  if (pounds < 50) return 2;
  return 3;
}

export default function PriceTierChart({ bulkPrice50lb, pounds }: { bulkPrice50lb: number; pounds: number }) {
  const baseRate = bulkPrice50lb / 50;
  const rates = TIERS.map((t) => baseRate * t.multiplier);
  const maxRate = Math.max(...rates);
  const activeIndex = activeTierIndex(pounds);

  return (
    <div>
      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Price per lb by order size</p>
      <div className="flex items-end gap-2 h-24" role="img" aria-label="Price per pound decreases at each larger order-size tier">
        {TIERS.map((tier, i) => {
          const heightPct = Math.max(18, (rates[i] / maxRate) * 100);
          const isActive = i === activeIndex;
          return (
            <div key={tier.label} className="flex-1 flex flex-col items-center justify-end h-full" title={`${tier.label}: $${rates[i].toFixed(2)}/lb`}>
              <span className={`text-[10px] font-black mb-1 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                ${rates[i].toFixed(2)}
              </span>
              <div
                className={`w-full max-w-6 rounded-t-[4px] transition-all ${isActive ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                style={{ height: `${heightPct}%` }}
              />
              <span className={`text-[9px] font-bold uppercase tracking-wide mt-2 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {tier.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
