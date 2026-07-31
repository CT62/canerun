import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import HistoryTimeline from './HistoryTimeline';

export const metadata = {
  title: 'Our History | Cane Run Enterprises',
  description:
    'Nearly 150 years of agricultural history in West Salem, Illinois — from Frederick Luther\'s 1878 mill to Cane Run Enterprises today.',
};

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-600 dark:text-emerald-400">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Nearly 150 years of Illinois agriculture
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-6 max-w-2xl mx-auto leading-relaxed">
            The agricultural history of West Salem traces its roots to the late 19th century, beginning with
            Frederick Luther, who established a steam-powered flour mill and sawmill on the site in 1878. As
            West Salem grew into a regional agricultural center, the property continued to serve the local
            grain economy for generations, evolving from milling and grain handling into today&apos;s seed
            business. Cane Run Enterprises carries forward that tradition, providing dependable seed
            processing, cleaning, treating, storage, and sales services for today&apos;s growers.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
            A Site With History
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            From Frederick Luther&apos;s mill to Cane Run
          </h2>
        </div>

        <HistoryTimeline />
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Let&apos;s build a great partnership
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Whether you&apos;re looking to place an order, inquire about new products, or simply connect,
            we&apos;d love to hear from you. Please feel free to reach out with any questions — we&apos;re here
            to help and excited to build a great partnership with you moving forward.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <a
              href="tel:+16184568851"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <PhoneIcon className="w-4 h-4" />
              (618) 456-8851
            </a>
            <a
              href="mailto:admin@canerunenterprises.com"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all"
            >
              <EnvelopeIcon className="w-4 h-4" />
              admin@canerunenterprises.com
            </a>
            <Link
              href="/store"
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all"
            >
              Shop the Store
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
