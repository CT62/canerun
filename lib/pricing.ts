export function calculateTieredPrice(bulkPrice50lb: number, pounds: number) {
  const baseRatePerLb = bulkPrice50lb / 50;
  const multiplier = pounds < 10 ? 1.65 : pounds < 25 ? 1.35 : pounds < 50 ? 1.15 : 1.0;
  return Math.round((pounds * (baseRatePerLb * multiplier)) * 100) / 100;
}
