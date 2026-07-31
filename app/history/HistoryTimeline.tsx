'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TIMELINE = [
  {
    era: '1878',
    title: "Frederick Luther's Mill",
    desc: 'Frederick Luther established a steam-powered flour mill and sawmill on the site, marking the start of the property\'s role in West Salem\'s agricultural economy.',
  },
  {
    era: 'Turn of the Century',
    title: 'Mallison Brothers',
    desc: 'As West Salem grew into a regional agricultural center, the property continued to serve the local grain economy, becoming associated with the Mallison Brothers, who operated a flour mill and grain elevator on the site.',
  },
  {
    era: '1927',
    title: 'Geo. Couch & Son',
    desc: "By 1927 the elevator was operated by Geo. Couch & Son, reflecting another chapter in the property's evolution as a grain-handling facility.",
  },
  {
    era: '1940',
    title: 'Campbell Seedhouse',
    desc: "Following a major fire, the site transitioned from grain storage and milling into the seed business with Campbell Seedhouse, continuing West Salem's long tradition of agricultural commerce.",
  },
  {
    era: '1981',
    title: 'Baker Seed',
    desc: 'The property became home to Baker Seed, founded in 1981, continuing to serve growers in the region for decades.',
  },
  {
    era: '2022',
    title: 'Cane Run Enterprises',
    desc: "The property became part of Cane Run Enterprises, preserving a site that has supported local farmers and agricultural trade for nearly 150 years.",
    img: '/images/site_images/front_enterance_v2.jpg',
  },
];

export default function HistoryTimeline() {
  return (
    <div className="flex flex-col">
      {TIMELINE.map((item, i) => (
        <div key={item.title} className="flex gap-6">
          <div className="w-11 flex flex-col items-center shrink-0">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.1, type: 'spring', bounce: 0.5 }}
              className="w-4 h-4 mt-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 z-10"
            />
            {i < TIMELINE.length - 1 && (
              <div className="w-px flex-1 my-2 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: i * 0.1 + 0.2, ease: 'easeInOut' }}
                  style={{ transformOrigin: 'top' }}
                  className="absolute inset-0 bg-emerald-500"
                />
              </div>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex-1 mb-10 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {item.era}
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 mb-2">{item.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            {item.img && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mt-5 bg-slate-100 dark:bg-slate-800">
                <Image
                  src={item.img}
                  alt={`${item.title} — front entrance`}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover"
                />
              </div>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
