'use client';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQS = [
  { q: 'How does bulk tiered pricing work?', a: '[ADD TEXT HERE]' },
  { q: 'What areas do you ship to?', a: '[ADD TEXT HERE]' },
  { q: 'Can I pick up my order instead of shipping?', a: '[ADD TEXT HERE]' },
  { q: 'What payment methods do you accept?', a: '[ADD TEXT HERE]' },
  { q: 'How do I know how much seed I need for my acreage?', a: '[ADD TEXT HERE]' },
  { q: 'Do you offer wholesale or bulk quotes beyond the calculator?', a: '[ADD TEXT HERE]' },
  { q: 'What if my order arrives damaged or short?', a: '[ADD TEXT HERE]' },
  { q: 'How long does shipping typically take?', a: '[ADD TEXT HERE]' },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQS.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setOpenIndex(open ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
              <span className="text-sm font-bold text-slate-900">{item.q}</span>
              <ChevronDownIcon className={`w-4 h-4 text-emerald-600 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <div className="px-5 pb-5">
                <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
