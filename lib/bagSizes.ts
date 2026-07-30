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

// Conservative combined-package limits used when consolidating multiple bags into fewer
// shipping boxes — matches USPS Priority Mail's limits, the tightest of our supported
// carriers, so a consolidated box stays valid no matter which carrier ends up quoting it.
const MAX_PACKAGE_WEIGHT_LB = 70;
const MAX_COMBINED_SIZE_IN = 108; // length + girth, girth = 2 * (width + height)

export type ShippingPackage = { weightLb: number; length: number; width: number; height: number };

function packageForStack(dims: { length: number; width: number; height: number }, stack: { weightLb: number; count: number }): ShippingPackage {
  return { weightLb: stack.weightLb, length: dims.length, width: dims.width, height: dims.height * stack.count };
}

// Stacks same-size bags into as few physical shipping boxes as possible — e.g. several small
// bags in one order can ride in a single box instead of each shipping (and being priced)
// separately — while keeping every resulting box under USPS's weight/size limit. Bags of
// different sizes are never combined with each other since their footprints don't stack.
export function consolidateBagLinesForShipping(lines: BagLine[]): ShippingPackage[] {
  const packages: ShippingPackage[] = [];

  for (const bagId of Object.keys(BAG_BY_ID) as BagSizeId[]) {
    const group = lines.filter((line) => line.bagId === bagId);
    if (group.length === 0) continue;

    const dims = bagPackagedDimensionsIn(bagId);
    let current: { weightLb: number; count: number } | null = null;

    for (const line of group) {
      const candidate: { weightLb: number; count: number } = {
        weightLb: (current?.weightLb ?? 0) + line.weightLb,
        count: (current?.count ?? 0) + 1,
      };
      const combinedSize = dims.length + 2 * (dims.width + dims.height * candidate.count);
      const fits = current !== null && candidate.weightLb <= MAX_PACKAGE_WEIGHT_LB && combinedSize <= MAX_COMBINED_SIZE_IN;

      if (fits) {
        current = candidate;
      } else {
        if (current) packages.push(packageForStack(dims, current));
        current = { weightLb: line.weightLb, count: 1 };
      }
    }
    if (current) packages.push(packageForStack(dims, current));
  }

  return packages;
}
