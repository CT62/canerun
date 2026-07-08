'use client';
import { useEffect, useState } from 'react';

const PARTNERS: { name: string; logo?: string }[] = [
  { name: 'Ridgeline Farms' },
  { name: 'Meadowbrook Ag' },
  { name: 'Silo Works Co-op' },
  { name: 'Bluegrass Cooperative' },
  { name: 'Ironwood Grain' },
  { name: 'Prairie Holdings' },
  { name: 'Cedar Fork Ag' },
  { name: 'Harrow & Co' },
  { name: 'Rubiscoo Seeds', logo: '/images/partners/rubiscoo-seeds.png' },
  { name: 'Photosyntech', logo: '/images/partners/photosyntech.png' },
  { name: 'BCD Agriculture', logo: '/images/partners/bcd-agriculture.png' },
];

function AbstractMark({ mark }: { mark: number }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className="shrink-0">
      {mark === 0 && <rect x="3" y="3" width="22" height="22" rx="6" className="fill-slate-400" />}
      {mark === 1 && <circle cx="14" cy="14" r="11" className="fill-emerald-500" />}
      {mark === 2 && <polygon points="14,2 26,24 2,24" className="fill-slate-500" />}
      {mark === 3 && <rect x="2" y="8" width="24" height="12" rx="3" className="fill-emerald-600" />}
      {mark === 4 && (
        <>
          <circle cx="10" cy="14" r="8" className="fill-slate-300" />
          <circle cx="18" cy="14" r="8" className="fill-slate-500" />
        </>
      )}
      {mark === 5 && <polygon points="14,3 25,10 21,25 7,25 3,10" className="fill-emerald-500" />}
      {mark === 6 && <rect x="4" y="4" width="20" height="20" rx="10" className="fill-slate-400" />}
      {mark === 7 && (
        <>
          <rect x="3" y="14" width="8" height="11" className="fill-slate-400" />
          <rect x="13" y="7" width="8" height="18" className="fill-emerald-500" />
        </>
      )}
    </svg>
  );
}

function PartnerLogo({ name, logo, mark }: { name: string; logo?: string; mark: number }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!logo) return;
    let cancelled = false;
    const preload = new window.Image();
    preload.onload = () => { if (!cancelled) setLoaded(true); };
    preload.onerror = () => { if (!cancelled) setLoaded(false); };
    preload.src = logo;
    return () => { cancelled = true; };
  }, [logo]);

  return (
    <div className="flex items-center gap-2.5 shrink-0 px-8 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
      {logo && loaded ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={name} className="h-7 w-7 object-contain shrink-0" />
      ) : (
        <AbstractMark mark={mark} />
      )}
      <span className="text-sm font-black text-slate-500 whitespace-nowrap tracking-tight">{name}</span>
    </div>
  );
}

export default function LogoMarquee() {
  const track = [...PARTNERS, ...PARTNERS];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee">
        {track.map((partner, i) => (
          <PartnerLogo key={`${partner.name}-${i}`} name={partner.name} logo={partner.logo} mark={i % 8} />
        ))}
      </div>
    </div>
  );
}
