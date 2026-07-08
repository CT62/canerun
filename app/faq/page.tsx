import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import FaqAccordion from '@/components/FaqAccordion';

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <QuestionMarkCircleIcon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600">Support</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">Frequently Asked Questions</h1>
          <p className="text-slate-600 text-sm mt-3 max-w-2xl leading-relaxed">[ADD TEXT HERE]</p>
        </div>

        <FaqAccordion />
      </div>
    </main>
  );
}
