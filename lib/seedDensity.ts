// Bulk densities used to figure out how much of a given seed actually fits inside each bag
// size — bag capacity is a volume limit, not a flat weight rating, so a light, chaffy seed
// fills a bag to far less weight than a heavy, dense one.
//
// Values are derived from standard published bushel test weights (a bushel = 1.2445 ft³),
// which is public agronomic reference data used across the seed industry for grading and
// legal sale purposes. The one exception is noted below.
const FT3_PER_BUSHEL = 1.2445;

const TEST_WEIGHT_LB_PER_BUSHEL: Record<string, number> = {
  easy_beauty: 24, // turf-type tall fescue blend
  emerald_excellence: 24, // perennial ryegrass
  shady_lawn: 20, // fine fescue / bluegrass / ryegrass blend — blended estimate
  vista_fescue: 24,
  ky31_fescue: 24,
  creeping_red_fescue: 14,
  kentucky_bluegrass_kenblue: 14,
  alfalfa_vernal: 60,
  clover_alsike: 60,
  clover_crimson: 60,
  clover_ladino_comm: 60,
  clover_medium_red: 60,
  clover_white_dutch: 60,
  lespedeza_korean: 25,
  orchardgrass_potomac: 14,
  orchardgrass_warrior: 14,
  timothy_baseline: 45,
  oats_spring: 32,
  oats_winter: 32,
  winter_wheat_grain: 60,
  ryegrain_winter: 56,
  enduro_pasture_mix: 30, // grass/legume blend — blended estimate
  green_valley_mix: 30, // grass/legume blend — blended estimate
  sorghum_sudangrass_hygain: 50,
  japanese_millet: 35,
  austrian_winter_peas: 60,
  buckwheat_wildlife: 48,
  chicory_wildlife: 25,
  egyptian_wheat: 50,
  radish_daikon: 50,
  rapeseed_winter: 50,
  turnip_purple_top: 50,
  cre_wildlife_mix: 35, // wildlife blend — blended estimate
};

// Redtop's published legal test weight (14 lb/bu) badly understates its real bulk density —
// that figure is a certification/purity standard for chaffy seed, not a measurement of how
// it actually packs into a bag. From real bag counts (60 lb of redtop fills the same bag as
// 125 lb of sand, and dry sand runs ~100 lb/ft³), redtop's real bulk density works out to
// about 48 lb/ft³ — roughly 4x what the test weight alone would suggest.
const DENSITY_OVERRIDE_LB_PER_FT3: Record<string, number> = {
  redtop: 48,
};

// Fallback for any seed not in the table above (e.g. newly added catalog items).
const DEFAULT_TEST_WEIGHT_LB_PER_BUSHEL = 30;

export function getSeedDensityLbPerFt3(seedId: string): number {
  if (seedId in DENSITY_OVERRIDE_LB_PER_FT3) return DENSITY_OVERRIDE_LB_PER_FT3[seedId];
  const testWeight = TEST_WEIGHT_LB_PER_BUSHEL[seedId] ?? DEFAULT_TEST_WEIGHT_LB_PER_BUSHEL;
  return testWeight / FT3_PER_BUSHEL;
}
