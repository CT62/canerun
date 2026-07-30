import { getSeedDensityLbPerFt3 } from './seedDensity';

// The three sandbag-style seed bags we stock. SKUs and flat (empty) dimensions match what
// we order from the supplier; the 5-10 / 11-25 / 26-50 lb capacity ranges printed on the
// product listing are calibrated to REFERENCE_DENSITY_LB_PER_FT3 below, not a fixed weight —
// a denser seed fills a given bag to more than its listed max, a fluffier one to less.
export type BagSizeId = 'small' | 'medium' | 'large';

export type BagSize = {
  id: BagSizeId;
  label: string;
  sku: string;
  flatDimensionsIn: { length: number; width: number };
  referenceMinLb: number;
  referenceMaxLb: number;
};

export const BAG_SIZES: BagSize[] = [
  {
    id: 'small',
    label: 'Small Bag',
    sku: 'S-15518G',
    flatDimensionsIn: { length: 14, width: 10 },
    referenceMinLb: 5,
    referenceMaxLb: 10,
  },
  {
    id: 'medium',
    label: 'Medium Bag',
    sku: 'S-14490G',
    flatDimensionsIn: { length: 24, width: 18 },
    referenceMinLb: 11,
    referenceMaxLb: 25,
  },
  {
    id: 'large',
    label: 'Large Bag',
    sku: 'S-16504G',
    flatDimensionsIn: { length: 40, width: 24 },
    referenceMinLb: 26,
    referenceMaxLb: 50,
  },
];

const BAG_BY_ID: Record<BagSizeId, BagSize> = Object.fromEntries(BAG_SIZES.map((bag) => [bag.id, bag])) as Record<
  BagSizeId,
  BagSize
>;

// The printed capacities are calibrated to a mid-density seed around this bulk density —
// used to back out each bag's usable fill volume, which is the real, seed-independent limit.
const REFERENCE_DENSITY_LB_PER_FT3 = 45;

function bagVolumeFt3(bag: BagSize): number {
  return bag.referenceMaxLb / REFERENCE_DENSITY_LB_PER_FT3;
}

// Filled height, back-solved from the bag's flat footprint and its fill volume — gives
// shipping a real box height per bag size instead of treating every bag as flat.
export function bagPackagedDimensionsIn(bagId: BagSizeId): { length: number; width: number; height: number } {
  const bag = BAG_BY_ID[bagId];
  const volumeIn3 = bagVolumeFt3(bag) * 1728;
  const area = bag.flatDimensionsIn.length * bag.flatDimensionsIn.width;
  const height = Math.round((volumeIn3 / area) * 10) / 10;
  return { length: bag.flatDimensionsIn.length, width: bag.flatDimensionsIn.width, height: Math.max(1, height) };
}

// Max weight of a specific seed that actually fits in this bag, given that seed's bulk density.
export function bagCapacityLb(bagId: BagSizeId, densityLbPerFt3: number): number {
  return Math.round(bagVolumeFt3(BAG_BY_ID[bagId]) * densityLbPerFt3 * 100) / 100;
}

export type BagLine = { seedId: string; bagId: BagSizeId; weightLb: number };

// Packs a given weight of one seed into the fewest real bags: fills as many bags at the
// largest size as fit completely, then drops whatever's left into the smallest bag size
// that can still hold it (so a light remainder doesn't get shipped in an oversized box).
export function packSeedIntoBags(seedId: string, totalLb: number): BagLine[] {
  if (totalLb <= 0) return [];

  const density = getSeedDensityLbPerFt3(seedId);
  const sizesByCapacity = BAG_SIZES.map((bag) => ({ bag, capacity: bagCapacityLb(bag.id, density) })).sort(
    (a, b) => a.capacity - b.capacity
  );
  const largest = sizesByCapacity[sizesByCapacity.length - 1];

  const lines: BagLine[] = [];
  const fullLargeBags = Math.floor(totalLb / largest.capacity);
  for (let i = 0; i < fullLargeBags; i++) {
    lines.push({ seedId, bagId: largest.bag.id, weightLb: largest.capacity });
  }

  const remaining = Math.round((totalLb - fullLargeBags * largest.capacity) * 100) / 100;
  if (remaining > 0) {
    const fit = sizesByCapacity.find((s) => s.capacity >= remaining) ?? largest;
    lines.push({ seedId, bagId: fit.bag.id, weightLb: remaining });
  }

  return lines;
}

export type CartLineForPacking = { id: string; weightOz: number; quantity: number };

// Packs every line in a cart/order into real bags. Each cart line already represents a
// customer-configured "bag" (a chosen per-bag weight × how many of that bag they want) —
// this re-derives how many actual small/medium/large bags that weight of THAT seed needs,
// since the same weight fits very differently depending on the seed's density.
export function packItemsIntoBags(items: CartLineForPacking[]): BagLine[] {
  return items.flatMap((item) => {
    const totalLb = ((item.weightOz || 0) * (item.quantity || 0)) / 16;
    return packSeedIntoBags(item.id, totalLb);
  });
}

export function summarizeBagCounts(lines: BagLine[]): Record<BagSizeId, number> {
  const counts: Record<BagSizeId, number> = { small: 0, medium: 0, large: 0 };
  for (const line of lines) counts[line.bagId] += 1;
  return counts;
}

export function totalOuncesForBagLines(lines: BagLine[]): number {
  return lines.reduce((sum, line) => sum + line.weightLb * 16, 0);
}
