'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

// Bump this if the terms change in a way that should re-prompt everyone, even people who
// already accepted an older version.
const TERMS_VERSION = 'v1';
const STORAGE_KEY = `canerun-terms-accepted-${TERMS_VERSION}`;

export default function TermsGate() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
              Before You Continue
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-2 mb-3">
              We use Terms & Conditions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              By using this website or placing an order, you agree to our{' '}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-bold underline"
              >
                Terms & Conditions
              </Link>
              , including our shipping, returns, and product policies.
            </p>
            <button
              onClick={accept}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all"
            >
              I Agree
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
