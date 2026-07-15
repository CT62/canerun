export const SERVICES_CATALOG = [
  {
    slug: 'seed-multiplication',
    name: 'Seed Multiplication',
    tagline: '[ADD TEXT HERE]',
    summary: '[ADD TEXT HERE]',
    description: '[ADD TEXT HERE]',
    icon: 'multiplication',
  },
  {
    slug: 'seed-certification',
    name: 'Seed Certification',
    tagline: '[ADD TEXT HERE]',
    summary: '[ADD TEXT HERE]',
    description: '[ADD TEXT HERE]',
    icon: 'certification',
  },
  {
    slug: 'seed-cleaning',
    name: 'Seed Cleaning',
    tagline: '[ADD TEXT HERE]',
    summary: '[ADD TEXT HERE]',
    description: '[ADD TEXT HERE]',
    icon: 'cleaning',
  },
  {
    slug: 'seed-treating',
    name: 'Seed Treating',
    tagline: '[ADD TEXT HERE]',
    summary: '[ADD TEXT HERE]',
    description: '[ADD TEXT HERE]',
    icon: 'treating',
  },
] as const;

export type ServiceEntry = (typeof SERVICES_CATALOG)[number];
