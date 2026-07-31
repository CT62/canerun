// Shared ShipStation helpers used by the shipping-rate endpoint and the post-checkout
// fulfillment webhook, so both sides agree on how rates are quoted and labels are purchased.

import { totalOuncesForBagLines, consolidateBagLinesForShipping } from './bagSizes';
import { normalizeShipTo } from './address';

// Above this weight, the quoted rate comes back with a warning to confirm shipping by phone/email
// rather than trusting the online rate as final — but checkout is still allowed to proceed.
const WEIGHT_INQUIRY_LBS = 300;
const WEIGHT_INQUIRY_OUNCES = WEIGHT_INQUIRY_LBS * 16;
const ENQUIRY_EMAIL = 'admin@canerunenterprises.com';

async function getClient() {
  if (!process.env.SHIPENGINE_API_KEY) {
    throw new Error('Shipping is not configured (missing SHIPENGINE_API_KEY).');
  }
  const { default: ShipEngine } = await import('shipengine');
  return new ShipEngine(process.env.SHIPENGINE_API_KEY);
}

export function getShipFromAddress() {
  if (!process.env.SHIP_FROM_ADDRESS_JSON) return null;
  return JSON.parse(process.env.SHIP_FROM_ADDRESS_JSON);
}

function rateTotal(rate) {
  return (
    (rate.shippingAmount?.amount || 0) +
    (rate.otherAmount?.amount || 0) +
    (rate.confirmationAmount?.amount || 0)
  );
}

// Stacks same-size bags into as few real boxes as possible (see consolidateBagLinesForShipping)
// and turns each resulting box into a ShipEngine package with its actual combined dimensions —
// this is what lets several small bags ride, and get priced, as one box instead of many.
function packagesForBags(bagLines) {
  return consolidateBagLinesForShipping(bagLines).map((pkg) => ({
    weight: { value: Math.max(pkg.weightLb * 16, 1), unit: 'ounce' },
    dimensions: { length: pkg.length, width: pkg.width, height: pkg.height, unit: 'inch' },
  }));
}

// USPS content-restricted service classes that don't apply to what we ship (seed, not media/
// print matter) — excluded even when cheaper, since using them for the wrong contents risks
// the package being intercepted and re-billed by USPS.
const DISALLOWED_SERVICE_CODES = ['usps_media_mail', 'usps_library_mail', 'usps_bound_printed_matter'];

async function quoteRates(shipengine, { shipTo, shipFrom, packages, carrierIds }) {
  const result = await shipengine.getRatesWithShipmentDetails({
    shipment: { shipTo, shipFrom, packages },
    rateOptions: { carrierIds },
  });
  return (result.rateResponse?.rates || []).filter(
    (rate) =>
      rate.validationStatus !== 'invalid' &&
      (rate.errorMessages || []).length === 0 &&
      !DISALLOWED_SERVICE_CODES.includes(rate.serviceCode)
  );
}

// Picks, for each carrier, the cheapest valid service for a single package.
function bestRatePerCarrier(rates) {
  const byCarrier = new Map();
  for (const rate of rates) {
    const existing = byCarrier.get(rate.carrierId);
    if (!existing || rateTotal(rate) < rateTotal(existing)) byCarrier.set(rate.carrierId, rate);
  }
  return byCarrier;
}

// Quotes every connected carrier and returns the cheapest valid option — while still shipping
// the whole order under one carrier, not mixing carriers within a single order.
//
// Two ways an order can be priced, both quoted and compared:
//  - Bundled: one multi-package shipment quote, for carriers that support shipping several
//    boxes together (FedEx, UPS).
//  - Summed: each box quoted and priced separately, then summed per carrier. This is required
//    for USPS, which has no concept of a multi-package shipment — every USPS parcel gets its
//    own independent rate and label — so without this, USPS can never win a multi-box order
//    even when it would genuinely be cheaper to ship each box through it individually.
// Whichever total comes out cheapest, across both strategies and every carrier, wins.
export async function getCheapestRate({ shipTo, bagLines }) {
  shipTo = normalizeShipTo(shipTo);
  const shipFrom = getShipFromAddress();
  if (!shipFrom) {
    throw new Error('Shipping is not configured (missing SHIP_FROM_ADDRESS_JSON).');
  }
  if (!bagLines || bagLines.length === 0) {
    throw new Error('No bags to ship — the cart is empty.');
  }

  const ounces = Math.max(totalOuncesForBagLines(bagLines), 1);

  const shipengine = await getClient();
  const carriers = await shipengine.listCarriers();
  // "_walleted" codes are the carrier account ShipStation provides by default (no linked account
  // needed). USPS shows up under different carrier codes depending on the ShipEngine account —
  // "usps" on this production account, "stamps_com" on the sandbox we tested against — so both
  // are listed to be safe.
  const SUPPORTED_CARRIER_CODES = ['fedex', 'fedex_walleted', 'ups', 'ups_walleted', 'usps', 'stamps_com', 'usps_walleted'];
  const carrierIds = carriers
    .filter((carrier) => SUPPORTED_CARRIER_CODES.includes(carrier.carrierCode))
    .map((carrier) => carrier.carrierId);
  if (carrierIds.length === 0) {
    throw new Error('No FedEx, UPS, or USPS account is connected in ShipStation.');
  }

  const bagPackages = packagesForBags(bagLines);
  const candidates = [];

  // Fire the bundled quote and every per-box quote at once instead of one network round-trip
  // after another — with N boxes that's N+1 ShipEngine calls, and doing them sequentially is
  // what made this take several seconds per box.
  const [bundleRates, perPackageRateLists] = await Promise.all([
    quoteRates(shipengine, { shipTo, shipFrom, packages: bagPackages, carrierIds }),
    bagPackages.length > 1
      ? Promise.all(bagPackages.map((pkg) => quoteRates(shipengine, { shipTo, shipFrom, packages: [pkg], carrierIds })))
      : Promise.resolve([]),
  ]);

  // Bundled: every box quoted together as one shipment.
  if (bundleRates.length > 0) {
    const best = bundleRates.reduce((a, b) => (rateTotal(a) < rateTotal(b) ? a : b));
    candidates.push({
      amount: rateTotal(best),
      rate: best,
      legs: [{ rateId: best.rateId, carrierId: best.carrierId, serviceCode: best.serviceCode, packages: bagPackages }],
    });
  }

  // Summed: each box quoted on its own, then totaled per carrier — only meaningful once
  // there's more than one box to compare against the bundled option above.
  if (perPackageRateLists.length > 1) {
    const perCarrierRates = new Map(); // carrierId -> rate[], index-aligned with bagPackages
    for (const rates of perPackageRateLists) {
      for (const [carrierId, rate] of bestRatePerCarrier(rates)) {
        if (!perCarrierRates.has(carrierId)) perCarrierRates.set(carrierId, []);
        perCarrierRates.get(carrierId).push(rate);
      }
    }
    for (const [, rates] of perCarrierRates) {
      // Skip carriers that couldn't quote every box — a partial total isn't a real option.
      if (rates.length !== bagPackages.length) continue;
      candidates.push({
        amount: rates.reduce((sum, rate) => sum + rateTotal(rate), 0),
        rate: rates[0],
        legs: rates.map((rate, i) => ({
          rateId: rate.rateId,
          carrierId: rate.carrierId,
          serviceCode: rate.serviceCode,
          packages: [bagPackages[i]],
        })),
      });
    }
  }

  if (candidates.length === 0) {
    throw new Error('No shipping rates are available for this address.');
  }

  const cheapest = candidates.reduce((best, c) => (c.amount < best.amount ? c : best));

  return {
    amount: Math.round(cheapest.amount * 100) / 100,
    currency: cheapest.rate.shippingAmount?.currency || 'usd',
    carrierFriendlyName: cheapest.rate.carrierFriendlyName,
    serviceType: cheapest.legs.length > 1 ? `${cheapest.rate.serviceType} (${cheapest.legs.length} boxes)` : cheapest.rate.serviceType,
    serviceCode: cheapest.rate.serviceCode,
    deliveryDays: cheapest.rate.deliveryDays,
    legs: cheapest.legs,
    warning:
      ounces > WEIGHT_INQUIRY_OUNCES
        ? `Shipments over ${WEIGHT_INQUIRY_LBS} lbs may not be quoted accurately through our online checkout. Call us at ${shipFrom.phone} or email us at ${ENQUIRY_EMAIL} to confirm shipping for this order and discuss custom rates.`
        : null,
  };
}

// One order can now produce more than one label purchase — e.g. a bundled multi-package
// FedEx shipment is a single label call, but a "summed" USPS total needs one label per box,
// since USPS has no multi-package concept. This merges however many label calls that took
// into the single tracking shape the rest of the app expects.
function mergeLabels(labels) {
  // Each label call has its own PDF — carry it onto every package it covers, so a multi-box
  // order (e.g. several separate USPS labels) doesn't lose all but the first one's link.
  const packages = labels.flatMap((label) => {
    const labelUrl = label.labelDownload?.pdf || label.labelDownload?.href || null;
    const labelPackages = label.packages?.length > 0 ? label.packages : [{ trackingNumber: label.trackingNumber }];
    return labelPackages.map((pkg) => ({ ...pkg, labelUrl, carrierCode: label.carrierCode }));
  });
  return {
    trackingNumber: packages[0]?.trackingNumber,
    carrierCode: labels[0]?.carrierCode,
    labelDownload: labels[0]?.labelDownload,
    packages,
  };
}

// Purchases the label(s) for a completed order — one per leg (see getCheapestRate). Prefers
// the exact rates quoted (and charged to the customer) at checkout time; falls back to a
// fresh cheapest-rate quote if any of those have since expired.
export async function purchaseLabelForOrder({ legs, shipTo, bagLines }) {
  shipTo = normalizeShipTo(shipTo);
  const shipengine = await getClient();
  const shipFrom = getShipFromAddress();

  const buyLeg = (leg) =>
    leg.rateId
      ? shipengine.createLabelFromRate({ rateId: leg.rateId })
      : shipengine.createLabelFromShipmentDetails({
          shipment: {
            carrierId: leg.carrierId,
            serviceCode: leg.serviceCode,
            shipDate: new Date().toISOString(),
            shipTo,
            shipFrom,
            packages: leg.packages,
          },
        });

  if (legs && legs.length > 0) {
    try {
      const labels = await Promise.all(legs.map(buyLeg));
      return mergeLabels(labels);
    } catch (err) {
      console.error('Stored shipping rate(s) no longer usable, re-quoting:', err.message);
    }
  }

  const fresh = await getCheapestRate({ shipTo, bagLines });
  const labels = await Promise.all(fresh.legs.map(buyLeg));
  return mergeLabels(labels);
}
