// Bagged seed typically stacks to about 2,000 lb per standard pallet — used only
// for a rough logistics snapshot, not a priced freight quote (ShipEngine handles that).
export const PALLET_LBS = 2000;

export function estimatePallets(totalLbs: number) {
  return Math.max(1, Math.ceil(totalLbs / PALLET_LBS));
}
