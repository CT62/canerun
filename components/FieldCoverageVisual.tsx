'use client';
import { ShoppingBagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const BAG_LBS = 50;
const MAX_BAG_ICONS = 24;

function fieldSizePx(acres: number) {
  // Purely illustrative scale (not literal square-footage) so a 0.5-acre plot and a
  // 500-acre field both render as a sensibly sized box rather than 0px or off-screen.
  const px = 64 + Math.log10(acres + 1) * 44;
  return Math.min(180, Math.max(64, px));
}

export default function FieldCoverageVisual({ acres, totalLbs }: { acres: number; totalLbs: number }) {
  if (!acres || acres <= 0 || !totalLbs || totalLbs <= 0) return null;

  const bagsNeeded = Math.max(1, Math.ceil(totalLbs / BAG_LBS));
  const boxSize = fieldSizePx(acres);
  const shownBags = Math.min(bagsNeeded, MAX_BAG_ICONS);
  const overflowBags = bagsNeeded - shownBags;

  return (
    <div>
      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-4">Your Field, Covered</p>
      <div className="flex items-center justify-center gap-6 flex-wrap">
        <div className="flex flex-col items-center gap-2">
          <div
            className="rounded-lg border-2 border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center transition-all duration-300"
            style={{
              width: boxSize,
              height: boxSize * 0.7,
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(4,120,87,0.14) 0, rgba(4,120,87,0.14) 2px, transparent 2px, transparent 22px)',
            }}
          >
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded">{acres} ac</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">Your field</p>
        </div>

        <ArrowRightIcon className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />

        <div className="flex flex-col items-center gap-2 max-w-[220px]">
          <div className="flex flex-wrap gap-1.5 justify-center items-center min-h-[64px]">
            {Array.from({ length: shownBags }).map((_, i) => (
              <ShoppingBagIcon key={i} className="w-5 h-5 text-emerald-600 dark:text-emerald-400" title="1 bag (50 lb)" />
            ))}
            {overflowBags > 0 && (
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 ml-1">+{overflowBags}</span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white text-center">
            {bagsNeeded} × {BAG_LBS} lb bag{bagsNeeded === 1 ? '' : 's'}
          </p>
        </div>
      </div>
    </div>
  );
}
