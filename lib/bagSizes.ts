// The three sandbag-style seed bags we stock, with their real flat (empty) dimensions and
// an estimated filled height, used to give shipping a real package size instead of a single
// weight-only box.
export type BagSizeId = 'small' | 'medium' | 'large';

export type BagSize = {
  id: BagSizeId;
  label: string;
  sku: string;
  flatDimensionsIn: { length: number; width: number };
  filledHeightIn: number;
  minLb: number;
  maxLb: number | null; // null = no upper bound
};

export const BAG_SIZES: BagSize[] = [
  {
    id: 'small',
    label: 'Small Bag',
    sku: 'S-15518G',
    flatDimensionsIn: { length: 14, width: 10 },
    filledHeightIn: 4,
    minLb: 5,
    maxLb: 10,
  },
  {
    id: 'medium',
    label: 'Medium Bag',
    sku: 'S-14490G',
    flatDimensionsIn: { length: 24, width: 18 },
    filledHeightIn: 6,
    minLb: 11,
    maxLb: 24,
  },
  {
    id: 'large',
    label: 'Large Bag',
    sku: 'S-16504G',
    flatDimensionsIn: { length: 40, width: 24 },
    filledHeightIn: 8,
    minLb: 25,
    maxLb: null,
  },
];

const BAG_BY_ID: Record<BagSizeId, BagSize> = Object.fromEntries(BAG_SIZES.map((bag) => [bag.id, bag])) as Record<
  BagSizeId,
  BagSize
>;

// Which bag size a given per-bag weight ships in: 5-10 lb -> small, 11-24 lb -> medium, 25 lb+ -> large.
export function bagSizeForWeightLb(weightLb: number): BagSizeId {
  if (weightLb <= 10) return 'small';
  if (weightLb <= 24) return 'medium';
  return 'large';
}

// Real package dimensions for a given bag size — used to quote shipping on the actual box
// size instead of a single lumped weight.
export function bagPackagedDimensionsIn(bagId: BagSizeId): { length: number; width: number; height: number } {
  const bag = BAG_BY_ID[bagId];
  return { length: bag.flatDimensionsIn.length, width: bag.flatDimensionsIn.width, height: bag.filledHeightIn };
}

export type BagLine = { seedId: string; bagId: BagSizeId; weightLb: number };

export type CartLineForPacking = { id: string; weightOz: number; quantity: number };

// Every cart line is a customer-configured "bag" (a chosen per-bag weight × how many of that
// bag they want) — one physical bag per unit of quantity, sized by that per-bag weight.
export function packItemsIntoBags(items: CartLineForPacking[]): BagLine[] {
  return items.flatMap((item) => {
    const weightLb = (item.weightOz || 0) / 16;
    const bagId = bagSizeForWeightLb(weightLb);
    const quantity = item.quantity || 0;
    return Array.from({ length: quantity }, () => ({ seedId: item.id, bagId, weightLb }));
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
