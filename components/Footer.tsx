import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between gap-10">
        <div>
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">Cane Run</span>
          <p className="text-sm font-black text-slate-900 dark:text-white">Enterprises</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">© {new Date().getFullYear()} Cane Run Enterprises.</p>
        </div>
        <div className="flex flex-col gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            610 Seminary St, West Salem, IL 62476
          </span>
          <span className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <a href="tel:+16184568851" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">(618) 456-8851</a>
          </span>
          <span className="flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <a href="mailto:admin@canerunenterprises.com" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">admin@canerunenterprises.com</a>
          </span>
          <span className="flex items-start gap-2">
            <ClockIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Monday–Friday: 8 AM–4:30 PM CT
              <br />
              Saturday–Sunday: Closed
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
