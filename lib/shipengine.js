// Shared ShipStation helpers used by the shipping-rate endpoint and the post-checkout
// fulfillment webhook, so both sides agree on how rates are quoted and labels are purchased.

import { bagPackagedDimensionsIn, totalOuncesForBagLines } from './bagSizes';

// Matches the largest bag we sell (the "large" bag's reference capacity) — used as the
// threshold above which it's worth also quoting a single-package freight rate alongside
// the real per-bag parcel quote.
const BOX_MAX_OUNCES = 50 * 16;

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

function packagesForOunces(totalOunces) {
  return [{ weight: { value: Math.max(totalOunces, 1), unit: 'ounce' } }];
}

// Builds one real ShipEngine package per physical bag, each carrying that bag size's actual
// dimensions — this is what lets carriers rate on real (or dimensional) weight per bag
// instead of treating the whole order as one undifferentiated block of weight.
function packagesForBags(bagLines) {
  return bagLines.map((line) => {
    const dims = bagPackagedDimensionsIn(line.bagId);
    return {
      weight: { value: Math.max(line.weightLb * 16, 1), unit: 'ounce' },
      dimensions: { length: dims.length, width: dims.width, height: dims.height, unit: 'inch' },
    };
  });
}

async function quoteRates(shipengine, { shipTo, shipFrom, packages, carrierIds }) {
  const result = await shipengine.getRatesWithShipmentDetails({
    shipment: { shipTo, shipFrom, packages },
    rateOptions: { carrierIds },
  });
  return (result.rateResponse?.rates || []).filter(
    (rate) => rate.validationStatus !== 'invalid' && (rate.errorMessages || []).length === 0
  );
}

// Quotes every connected carrier and returns the cheapest valid rate — comparing the real,
// dimensioned per-bag packages (small/medium/large, whatever mix the order actually needs)
// against a single lumped-weight package for heavy orders, since FedEx Freight (or another
// carrier's freight-class service) can beat pricing many individual parcel packages once an
// order is big enough.
export async function getCheapestRate({ shipTo, bagLines }) {
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
  // "_walleted" codes are the carrier account ShipStation provides by default (no linked account needed).
  // USPS shows up under ShipEngine as "stamps_com".
  const SUPPORTED_CARRIER_CODES = ['fedex', 'fedex_walleted', 'ups', 'ups_walleted', 'stamps_com', 'usps_walleted'];
  const carrierIds = carriers
    .filter((carrier) => SUPPORTED_CARRIER_CODES.includes(carrier.carrierCode))
    .map((carrier) => carrier.carrierId);
  if (carrierIds.length === 0) {
    throw new Error('No FedEx, UPS, or USPS account is connected in ShipStation.');
  }

  const candidates = [];

  // Option A: the real bags this order actually needs — each package carries the correct
  // small/medium/large dimensions for the seed and weight it holds.
  const bagPackages = packagesForBags(bagLines);
  const bagRates = await quoteRates(shipengine, { shipTo, shipFrom, packages: bagPackages, carrierIds });
  if (bagRates.length > 0) {
    const bestBagRate = bagRates.reduce((best, rate) => (rateTotal(rate) < rateTotal(best) ? rate : best));
    candidates.push({ rate: bestBagRate, packages: bagPackages });
  }

  // Option B: one lumped-weight package — only worth quoting once the order is heavy
  // enough that a freight-class service might beat shipping each bag as its own parcel.
  if (ounces > BOX_MAX_OUNCES) {
    const singlePackages = packagesForOunces(ounces);
    const singleRates = await quoteRates(shipengine, { shipTo, shipFrom, packages: singlePackages, carrierIds });
    if (singleRates.length > 0) {
      const bestSingle = singleRates.reduce((best, rate) => (rateTotal(rate) < rateTotal(best) ? rate : best));
      candidates.push({ rate: bestSingle, packages: singlePackages });
    }
  }

  if (candidates.length === 0) {
    throw new Error('No shipping rates are available for this address.');
  }

  const cheapest = candidates.reduce((best, c) => (rateTotal(c.rate) < rateTotal(best.rate) ? c : best));

  return {
    rateId: cheapest.rate.rateId,
    carrierId: cheapest.rate.carrierId,
    amount: Math.round(rateTotal(cheapest.rate) * 100) / 100,
    currency: cheapest.rate.shippingAmount?.currency || 'usd',
    carrierFriendlyName: cheapest.rate.carrierFriendlyName,
    serviceType: cheapest.rate.serviceType,
    serviceCode: cheapest.rate.serviceCode,
    deliveryDays: cheapest.rate.deliveryDays,
    packages: cheapest.packages,
    warning:
      ounces > WEIGHT_INQUIRY_OUNCES
        ? `Shipments over ${WEIGHT_INQUIRY_LBS} lbs may not be quoted accurately through our online checkout. Call us at ${shipFrom.phone} or email us at ${ENQUIRY_EMAIL} to confirm shipping for this order and discuss custom rates.`
        : null,
  };
}

// Purchases the label for a completed order. Prefers the exact rate that was quoted
// (and charged to the customer) at checkout time; falls back to a fresh cheapest-rate
// quote if that rate has since expired.
export async function purchaseLabelForOrder({ rateId, shipTo, bagLines }) {
  const shipengine = await getClient();

  if (rateId) {
    try {
      return await shipengine.createLabelFromRate({ rateId });
    } catch (err) {
      console.error('Stored shipping rate is no longer usable, re-quoting:', err.message);
    }
  }

  const shipFrom = getShipFromAddress();
  const fresh = await getCheapestRate({ shipTo, bagLines });

  return shipengine.createLabelFromShipmentDetails({
    shipment: {
      carrierId: fresh.carrierId,
      serviceCode: fresh.serviceCode,
      shipDate: new Date().toISOString(),
      shipTo,
      shipFrom,
      packages: fresh.packages,
    },
  });
}
