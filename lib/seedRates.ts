import { SEED_CATALOG } from '@/app/data/seedCatalog';

export type RateSeed = {
  id: string;
  name: string;
  bulkPrice50lb: number;
  specs?: { lbsAcre?: string };
} & Record<string, unknown>;

export const CATALOG = SEED_CATALOG as RateSeed[];

// Only the "X to Y" / single-number lbsAcre spec format is parsed reliably.
// Free-text wildlife `rate` strings (e.g. "Broadcast 50 lb per acre, cover 1/4 inch deep")
// mix seeding rate and planting depth numbers together, so they're intentionally excluded
// rather than risk recommending the wrong figure.
export function parseRateRange(text?: string): [number, number] | null {
  if (!text) return null;
  const rangeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:to|-|–)\s*(\d+(?:\.\d+)?)/i);
  if (rangeMatch) return [parseFloat(rangeMatch[1]), parseFloat(rangeMatch[2])];
  const singleMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    const n = parseFloat(singleMatch[1]);
    return [n, n];
  }
  return null;
}

export const CALCULABLE_SEEDS = CATALOG.filter((s) => parseRateRange(s.specs?.lbsAcre));
