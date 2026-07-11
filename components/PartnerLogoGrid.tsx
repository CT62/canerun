'use client';
import { useEffect, useState } from 'react';

const PARTNERS = [
  { name: 'Rubisco Seeds', logo: '/images/partners/rubisco-seeds.jpg' },
  { name: 'Photosyntech', logo: '/images/partners/photosyntech.jpg' },
  { name: 'BCD Agriculture', logo: '/images/partners/bcd-agriculture.png' },
  { name: 'Illinois Crop Improvement Association', logo: '/images/partners/illinois-crop-improvement.png' },
  { name: 'Total Seed Production', logo: '/images/partners/total-seed-production.png' },
];

function PartnerCard({ name, logo }: { name: string; logo: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const preload = new window.Image();
    preload.onload = () => { if (!cancelled) setLoaded(true); };
    preload.onerror = () => { if (!cancelled) setLoaded(false); };
    preload.src = logo;
    return () => { cancelled = true; };
  }, [logo]);

  return (
    <div className="flex items-center justify-center h-24 rounded-2xl bg-slate-50 border border-slate-100 p-5 transition-all hover:border-slate-200 hover:shadow-sm">
      {loaded ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={name} className="max-h-full max-w-full object-contain" />
      ) : (
        <span className="text-sm font-black text-slate-500 text-center tracking-tight">{name}</span>
      )}
    </div>
  );
}

export default function PartnerLogoGrid() {
  return (
    <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {PARTNERS.map((partner) => (
        <PartnerCard key={partner.name} name={partner.name} logo={partner.logo} />
      ))}
    </div>
  );
}
