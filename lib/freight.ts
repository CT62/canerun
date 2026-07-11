// A standard pallet holds 60 bags — used only for a rough logistics snapshot,
// not a priced freight quote (ShipStation handles that).
export const BAGS_PER_PALLET = 60;

export function estimatePallets(bagCount: number) {
  return Math.max(1, Math.ceil(bagCount / BAGS_PER_PALLET));
}
