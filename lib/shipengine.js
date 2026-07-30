// Shared ShipStation helpers used by the shipping-rate endpoint and the post-checkout
// fulfillment webhook, so both sides agree on how rates are quoted and labels are purchased.

// Matches the max bag weight sold in the store — used to split a heavy order into
// multiple boxes so it qualifies for standard ground-parcel rates instead of a single
// oversized package.
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

// Splits a heavy order into boxes no larger than BOX_MAX_OUNCES each.
function boxedPackagesForOunces(totalOunces) {
  let remaining = Math.max(totalOunces, 1);
  const packages = [];
  while (remaining > 0) {
    const weight = Math.min(BOX_MAX_OUNCES, remaining);
    packages.push({ weight: { value: weight, unit: 'ounce' } });
    remaining -= weight;
  }
  return packages;
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

// Quotes every connected carrier and returns the cheapest valid rate — comparing shipping
// the whole order as a single package/pallet against splitting it into ~50lb boxes on
// FedEx Ground, since one is often far cheaper than the other depending on total weight.
export async function getCheapestRate({ shipTo, totalOunces }) {
  const shipFrom = getShipFromAddress();
  if (!shipFrom) {
    throw new Error('Shipping is not configured (missing SHIP_FROM_ADDRESS_JSON).');
  }

  const ounces = Math.max(totalOunces, 1);

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

  // Option A: one package/pallet — whatever service the carriers can offer for it,
  // including FedEx Freight for weights that don't fit standard parcel limits.
  const singlePackages = packagesForOunces(ounces);
  const singleRates = await quoteRates(shipengine, { shipTo, shipFrom, packages: singlePackages, carrierIds });
  if (singleRates.length > 0) {
    const bestSingle = singleRates.reduce((best, rate) => (rateTotal(rate) < rateTotal(best) ? rate : best));
    candidates.push({ rate: bestSingle, packages: singlePackages });
  }

  // Option B: split into ~50lb boxes and use FedEx Ground — only worth quoting once the
  // order is heavy enough to actually need more than one box.
  if (ounces > BOX_MAX_OUNCES) {
    const boxedPackages = boxedPackagesForOunces(ounces);
    const boxedRates = await quoteRates(shipengine, { shipTo, shipFrom, packages: boxedPackages, carrierIds });
    const groundRate = boxedRates.find((rate) => rate.carrierCode === 'fedex' && rate.serviceCode === 'fedex_ground');
    if (groundRate) {
      candidates.push({ rate: groundRate, packages: boxedPackages });
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
export async function purchaseLabelForOrder({ rateId, shipTo, totalOunces }) {
  const shipengine = await getClient();

  if (rateId) {
    try {
      return await shipengine.createLabelFromRate({ rateId });
    } catch (err) {
      console.error('Stored shipping rate is no longer usable, re-quoting:', err.message);
    }
  }

  const shipFrom = getShipFromAddress();
  const fresh = await getCheapestRate({ shipTo, totalOunces });

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
