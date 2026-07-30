'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import LogoMarquee from '@/components/LogoMarquee';
import IllinoisIcon from '@/components/IllinoisIcon';
import ParallaxBackdrop from '@/components/ParallaxBackdrop';
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  TruckIcon,
  LifebuoyIcon,
  ArrowRightIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const EXPANDABLE_FOUNDER = 'William Caldbeck';

const FEATURES = [
  {
    icon: CurrencyDollarIcon,
    title: 'Bulk Tiered Pricing',
    desc: 'Configure the exact bag weight you need and watch pricing adjust in real time — no quote requests, no waiting.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Full Seed Inventory',
    desc: 'We warehouse seed from clovers and alfalfas to fescues, ryegrasses, and pasture mixes — cleaned and ready to bag or handle in bulk depending on the season.',
  },
  {
    icon: TruckIcon,
    title: 'Nationwide Shipping',
    desc: 'We ship nationwide, with local pickup also available at our Illinois location.',
  },
  {
    icon: LifebuoyIcon,
    title: 'Expert Field Support',
    desc: 'Many years of hands-on seed experience at your disposal, including help navigating CRP program details — give us a call and we\'ll walk you through it.',
  },
];

const FOUNDERS = [
  { name: 'Rebecca Caldbeck', image: '/images/founders/rebecca.jpeg', role: 'Founder' },
  { name: 'William Caldbeck', image: '/images/founders/william.jpeg', role: 'Founder' },
  { name: 'Philip Caldbeck', image: '/images/founders/philip.jpeg', role: 'Founder' },
  { name: 'Sarah Caldbeck', image: '/images/founders/sarah.jpeg', role: 'Founder' },
  { name: 'Ben Caldbeck', image: '/images/founders/ben.png', role: 'Founder' },
];

const SEED_CATEGORIES = [
  'Clovers', 'Alfalfas', 'Lespedeza', 'Fescues', 'Timothy', 'Orchardgrass',
  'Pasture Mixes', 'Annual & Perennial Ryegrasses', 'Redtop', 'Spring & Fall Oats',
  'Hybrid Sorghum Sudangrass', 'Chicory', 'Chufa', 'Egyptian Wheat', 'Millets',
  'Peas', 'Sunflowers', 'Turnips', "Wild Buck's Seed Mixture", 'And Many More',
];

const STATS = [
  { value: '30+', label: 'Seed Varieties' },
  { value: '75+', label: 'Years of History' },
  { value: '24/7', label: 'Order Access' },
];

const STEPS = [
  {
    icon: ClipboardDocumentListIcon,
    title: 'Configure Your Order',
    desc: 'Choose your seed and enter the exact amount you need using our convenient calculator.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'See Live Pricing',
    desc: 'Tiered pricing updates automatically as your quantity changes — no quote requests needed.',
  },
  {
    icon: CubeIcon,
    title: 'We Prep & Ship',
    desc: 'Choose convenient shipping, or pick up your order direct from our store.',
  },
  {
    icon: TruckIcon,
    title: 'Order Delivered',
    desc: 'We aim to provide reliable service and timely delivery for every customer.',
  },
];

const FAQS = [
  {
    q: 'What regions do you ship to?',
    a: 'We ship nationwide.',
  },
  {
    q: 'What is the minimum order size?',
    a: 'Our minimum order size is 5 lbs.',
  },
  {
    q: 'How much should I order?',
    a: 'The amount of seed needed depends on the crop, planting rate, acreage, and intended use. For help determining the right amount for your operation, please refer to the built-in calculator.',
  },
  {
    q: 'Do you offer bulk / wholesale pricing?',
    a: 'Yes — we offer tiered rates based on quantity.',
  },
  {
    q: 'How do returns or damaged shipments work?',
    a: "If your order arrives damaged or there is an issue with your shipment, please contact us as soon as possible. We'll work with you to resolve the issue and determine the best solution. Because seed is a perishable agricultural product, returns may not be accepted once an order has been delivered. If you have questions about your order, don't hesitate to reach out — we're happy to help.",
  },
];

export default function HomePage() {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-x-0 top-0 w-full h-[26rem] sm:h-[34rem] [mask-image:linear-gradient(to_bottom,black,black_25%,transparent_78%)] [-webkit-mask-image:linear-gradient(to_bottom,black,black_25%,transparent_78%)]">
          <Image
            src="/images/site_images/whole_view.png"
            alt="Cane Run Enterprises facility"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="hidden sm:block absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.18),_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 pt-64 sm:pt-80 pb-24 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-700 dark:text-emerald-400 mb-5">
              Cane Run Enterprises
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-3xl leading-[1.05]">
              Family-owned custom seed processing and seed supplier
            </h1>
            <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg mt-6 max-w-xl leading-relaxed">
              Cane Run Enterprises is a family-owned seed processing and seed supply company based in
              West Salem, Illinois, in America&apos;s Grain Belt. We provide custom seed cleaning, treating,
              and bagging services, along with quality seed for growers and agricultural businesses. Our
              focus is on efficient processing, consistent quality, and dependable service — whether you
              need custom seed processing or quality seed, we&apos;re here to provide reliable solutions you
              can count on. From our family to yours, thank you for supporting us.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <IllinoisIcon className="w-3 h-6 text-emerald-700 dark:text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                Proudly Based in Illinois
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/store"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all"
              >
                Shop the Store
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#partners"
                className="px-8 py-4 rounded-xl bg-slate-900/5 dark:bg-white/10 hover:bg-slate-900/10 dark:hover:bg-white/20 text-slate-900 dark:text-white text-sm font-bold border border-slate-900/10 dark:border-white/10 transition-all"
              >
                Who We Work With
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-3 gap-6 mt-20 pt-10 border-t border-slate-900/10 dark:border-white/10"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Logo marquee */}
      <section id="partners" className="py-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-8">
          Trusted by operations across the region
        </p>
        <LogoMarquee />
      </section>

      {/* Illinois roots — fixed parallax backdrop */}
      <section
        className="relative border-b border-slate-200 dark:border-slate-800 sm:bg-cover sm:bg-center sm:bg-fixed sm:bg-[url('/images/site_images/grain_bins.jpg')]"
        style={{ clipPath: 'inset(0)' }}
      >
        <ParallaxBackdrop src="/images/site_images/grain_bins.jpg" />
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 flex flex-col sm:flex-row items-center gap-10 sm:gap-16">
          <IllinoisIcon className="w-16 h-32 sm:w-20 sm:h-40 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400">Illinois Based</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              Proudly based in Illinois.
            </h2>
            <p className="text-slate-200 text-sm mt-4 max-w-xl leading-relaxed">
              Cane Run Enterprises calls West Salem, Illinois home.
            </p>
          </div>
        </div>
      </section>

      {/* About / Family owned */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Family opened.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-6 leading-relaxed">
              Cane Run Enterprises was founded in 2022 by the Caldbeck family.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 leading-relaxed">
              We warehouse seed of all kinds — from pasture and hay mixes to specialty cover crops — and we
              can clean and either bag or handle bulk seed depending on the season and our current cleaner
              setup. Working on a CRP project? Give us a call — we can help you with the details.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">What We Warehouse</p>
            <div className="flex flex-wrap gap-2">
              {SEED_CATEGORIES.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl mb-14">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">Meet the Family</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              The founders of Cane Run Enterprises.
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {FOUNDERS.map((founder) => {
              const isExpandable = founder.name === EXPANDABLE_FOUNDER && !!founder.image;
              return (
                <div key={founder.name} className="flex flex-col items-center text-center">
                  <div
                    onClick={isExpandable ? () => setExpandedImage(founder.image!) : undefined}
                    className={`w-full aspect-square rounded-2xl overflow-hidden bg-emerald-50 dark:bg-emerald-500/10 border border-slate-200 dark:border-slate-800 shadow-sm mb-4 ${isExpandable ? 'cursor-zoom-in hover:opacity-90 transition-opacity' : ''}`}
                  >
                    {founder.image ? (
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl sm:text-3xl font-black">
                        {founder.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{founder.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">{founder.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">Why Cane Run</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            Everything you need to stock the season.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works — fixed parallax backdrop */}
      <section
        className="relative border-b border-slate-200 dark:border-slate-800 sm:bg-cover sm:bg-center sm:bg-fixed sm:bg-[url('/images/site_images/bulk_bags.jpg')]"
        style={{ clipPath: 'inset(0)' }}
      >
        <ParallaxBackdrop src="/images/site_images/bulk_bags.jpg" />
        <div className="absolute inset-0 bg-slate-900/75" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl mb-14">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
              From order to farm in a few steps.
            </h2>
            <p className="text-slate-200 text-sm mt-4 leading-relaxed">
              Four simple steps from your first click to seed on the farm.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/15"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Step {i + 1}
                </span>
                <h3 className="text-base font-black text-white mt-1 mb-2">{step.title}</h3>
                {step.desc && <p className="text-slate-300 text-xs leading-relaxed">{step.desc}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="mb-14 text-center">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Common questions.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 leading-relaxed">
              A few things customers ask us most often.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gray-200 dark:bg-slate-800 px-8 py-16 sm:px-16 sm:py-20 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.2),_transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Ready to see live pricing on your next order?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm mt-4 max-w-xl mx-auto leading-relaxed">
              Browse the full catalog, configure exact bag weights, and check out in minutes.
            </p>
            <Link
              href="/store"
              className="group inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all"
            >
              Browse our catalog
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={expandedImage}
              alt=""
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setExpandedImage(null)}
              aria-label="Close"
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
