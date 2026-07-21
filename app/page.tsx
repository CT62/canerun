'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

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
    title: 'Regional Fast Shipping',
    desc: 'Placeholder copy — describe your shipping radius, lead times, or delivery/pickup options here. [ADD TEXT HERE]',
  },
  {
    icon: LifebuoyIcon,
    title: 'Expert Field Support',
    desc: 'Many years of hands-on seed experience at your disposal, including help navigating CRP program details — give us a call and we\'ll walk you through it.',
  },
];

const FOUNDERS = [
  { name: 'Rebecca Caldbeck', image: undefined, role: 'Founder' },
  { name: 'William Caldbeck', image: undefined, role: 'Founder' },
  { name: 'Philip Caldbeck', image: undefined, role: 'Founder' },
  { name: 'Sarah Caldbeck', image: undefined, role: 'Founder' },
  { name: 'Ben Caldbeck', image: '/images/founders/ben.png', role: "Jeremy's Assistant" },
];

const SEED_CATEGORIES = [
  'Clovers', 'Alfalfas', 'Lespedeza', 'Fescues', 'Timothy', 'Orchardgrass',
  'Pasture Mixes', 'Annual & Perennial Ryegrasses', 'Redtop', 'Spring & Fall Oats',
  'Hybrid Sorghum Sudangrass', 'Chicory', 'Chufa', 'Egyptian Wheat', 'Millets',
  'Peas', 'Sunflowers', 'Turnips', "Wild Buck's Seed Mixture", 'And Many More',
];

const STATS = [
  { value: '40+', label: 'Seed Varieties' },
  { value: '15+', label: 'Years in Operation' },
  { value: '500+', label: 'Farms Served' },
  { value: '24/7', label: 'Order Access' },
];

const STEPS = [
  {
    icon: ClipboardDocumentListIcon,
    title: 'Configure Your Order',
    desc: 'Placeholder copy — explain how a customer picks products and bag weights in the store. [ADD TEXT HERE]',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'See Live Pricing',
    desc: 'Placeholder copy — explain how tiered pricing updates as quantity changes. [ADD TEXT HERE]',
  },
  {
    icon: CubeIcon,
    title: 'We Prep & Ship',
    desc: 'Placeholder copy — describe fulfillment: pallets, bagging, freight, or pickup process. [ADD TEXT HERE]',
  },
  {
    icon: TruckIcon,
    title: 'It Arrives On the Farm',
    desc: 'Placeholder copy — describe delivery timelines and what customers can expect on arrival. [ADD TEXT HERE]',
  },
];

const TESTIMONIALS = [
  {
    quote: 'Placeholder testimonial — a sentence or two about the experience of ordering from Cane Run Enterprises. [ADD TEXT HERE]',
    name: 'Customer Name [ADD TEXT HERE]',
    role: 'Farm / Title [ADD TEXT HERE]',
  },
  {
    quote: 'Placeholder testimonial — mention pricing, delivery speed, or product quality. [ADD TEXT HERE]',
    name: 'Customer Name [ADD TEXT HERE]',
    role: 'Farm / Title [ADD TEXT HERE]',
  },
  {
    quote: 'Placeholder testimonial — mention repeat ordering or support experience. [ADD TEXT HERE]',
    name: 'Customer Name [ADD TEXT HERE]',
    role: 'Farm / Title [ADD TEXT HERE]',
  },
];

const FAQS = [
  {
    q: 'Placeholder question — e.g. what regions do you ship to? [ADD TEXT HERE]',
    a: 'Placeholder answer copy. [ADD TEXT HERE]',
  },
  {
    q: 'Placeholder question — e.g. what is the minimum order size? [ADD TEXT HERE]',
    a: 'Placeholder answer copy. [ADD TEXT HERE]',
  },
  {
    q: 'Placeholder question — e.g. do you offer bulk / wholesale pricing? [ADD TEXT HERE]',
    a: 'Placeholder answer copy. [ADD TEXT HERE]',
  },
  {
    q: 'Placeholder question — e.g. how do returns or damaged shipments work? [ADD TEXT HERE]',
    a: 'Placeholder answer copy. [ADD TEXT HERE]',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-x-0 top-0 w-full h-[26rem] sm:h-[34rem] [mask-image:linear-gradient(to_bottom,black,black_25%,transparent_78%)] [-webkit-mask-image:linear-gradient(to_bottom,black,black_25%,transparent_78%)]">
          <Image
            src="/images/site_images/whole_view.jpg"
            alt="Cane Run Enterprises facility"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.18),_transparent_60%)]" />
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
              Seed & forage supply, built for working farms.
            </h1>
            <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg mt-6 max-w-xl leading-relaxed">
              Placeholder copy — a short line about what Cane Run Enterprises does, who it serves,
              and why customers order from you instead of anywhere else. [ADD TEXT HERE]
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
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 pt-10 border-t border-slate-900/10 dark:border-white/10"
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
              Placeholder copy — Cane Run Enterprises is based in Illinois, and this is a good spot
              to mention your hometown, how long you&apos;ve processed and shipped seed to Illinois farms,
              and why sitting close to the corn belt supply chain means faster sourcing and shipping. [ADD TEXT HERE]
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
              Family owned and operated.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-6 leading-relaxed">
              Cane Run Enterprises was founded in 2022 by Rebecca Caldbeck, William Caldbeck, Philip
              Caldbeck, Sarah Caldbeck, and Ben Caldbeck, and is family owned and operated.
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
            {FOUNDERS.map((founder) => (
              <div key={founder.name} className="flex flex-col items-center text-center">
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-emerald-50 dark:bg-emerald-500/10 border border-slate-200 dark:border-slate-800 shadow-sm mb-4">
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
            ))}
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
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 leading-relaxed">
            Placeholder copy — replace with a short paragraph on your value proposition. [ADD TEXT HERE]
          </p>
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

      {/* How it works */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl mb-14">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              From order to farm in a few steps.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 leading-relaxed">
              Placeholder copy — a short intro to your ordering/fulfillment process. [ADD TEXT HERE]
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
                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Step {i + 1}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 mb-2">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — fixed parallax backdrop */}
      <section
        className="relative border-b border-slate-200 dark:border-slate-800 sm:bg-cover sm:bg-center sm:bg-fixed sm:bg-[url('/images/site_images/bulk_bags.jpg')]"
        style={{ clipPath: 'inset(0)' }}
      >
        <ParallaxBackdrop src="/images/site_images/bulk_bags.jpg" />
        <div className="absolute inset-0 bg-slate-900/75" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl mb-14">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400">What Farms Say</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
              Trusted by growers across the region.
            </h2>
            <p className="text-slate-200 text-sm mt-4 leading-relaxed">
              Placeholder copy — an intro line about customer trust or repeat business. [ADD TEXT HERE]
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-8 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/15"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-emerald-400 mb-4" />
                <p className="text-slate-100 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-white text-sm font-bold">{t.name}</p>
                <p className="text-slate-300 text-xs">{t.role}</p>
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
              Placeholder copy — a short intro line above the FAQ list. [ADD TEXT HERE]
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
              Browse the Catalog
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
