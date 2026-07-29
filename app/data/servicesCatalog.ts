export const SERVICES_CATALOG = [
  {
    slug: 'seed-multiplication',
    name: 'Seed Production',
    tagline: 'Increase your seed supply while maintaining varietal purity and quality.',
    summary: 'We offer seed multiplication services to increase the quantity of seed from an approved source seed lot while maintaining varietal purity and quality.',
    description: 'We offer seed multiplication services to increase the quantity of seed from an approved source seed lot while maintaining varietal purity and quality.',
    icon: 'multiplication',
  },
  {
    slug: 'seed-bagging',
    name: 'Seed Bagging',
    tagline: 'Accurate, efficient packaging for handling, storage, and distribution.',
    summary: 'Accurate and efficient packaging of processed seed for convenient handling, storage, and distribution.',
    description: 'Accurate and efficient packaging of processed seed for convenient handling, storage, and distribution.',
    icon: 'bagging',
  },
  {
    slug: 'seed-cleaning',
    name: 'Seed Cleaning',
    tagline: 'Professional cleaning for a clean, consistent product.',
    summary: 'Professional cleaning to remove unwanted material and improve seed quality, helping ensure a clean, consistent product.',
    description: 'Professional cleaning to remove unwanted material and improve seed quality, helping ensure a clean, consistent product.',
    icon: 'cleaning',
  },
  {
    slug: 'seed-treating',
    name: 'Custom Seed Treating',
    tagline: 'Approved treatments that protect seed and support strong crop establishment.',
    summary: 'Seed treatment services that apply approved products to help protect seed and support strong crop establishment.',
    description: 'Seed treatment services that apply approved products to help protect seed and support strong crop establishment.',
    icon: 'treating',
  },
] as const;

export type ServiceEntry = (typeof SERVICES_CATALOG)[number];
