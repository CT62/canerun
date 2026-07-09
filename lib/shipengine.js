// Shared ShipEngine helpers used by the shipping-rate endpoint and the post-checkout
// fulfillment webhook, so both sides agree on how rates are quoted and labels are purchased.

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

// Quotes every connected carrier and returns the single cheapest valid rate.
export async function getCheapestRate({ shipTo, totalOunces }) {
  const shipFrom = getShipFromAddress();
  if (!shipFrom) {
    throw new Error('Shipping is not configured (missing SHIP_FROM_ADDRESS_JSON).');
  }

  const shipengine = await getClient();
  const carriers = await shipengine.listCarriers();
  const carrierIds = carriers.filter((carrier) => carrier.carrierCode === 'fedex').map((carrier) => carrier.carrierId);
  if (carrierIds.length === 0) {
    throw new Error('No FedEx account is connected in ShipEngine.');
  }

  const result = await shipengine.getRatesWithShipmentDetails({
    shipment: {
      shipTo,
      shipFrom,
      packages: [{ weight: { value: Math.max(totalOunces, 1), unit: 'ounce' } }],
    },
    rateOptions: { carrierIds },
  });

  const rates = (result.rateResponse?.rates || []).filter(
    (rate) => rate.validationStatus !== 'invalid' && (rate.errorMessages || []).length === 0
  );
  if (rates.length === 0) {
    throw new Error('No shipping rates are available for this address.');
  }

  const cheapest = rates.reduce((best, rate) => (rateTotal(rate) < rateTotal(best) ? rate : best));

  return {
    rateId: cheapest.rateId,
    carrierId: cheapest.carrierId,
    amount: Math.round(rateTotal(cheapest) * 100) / 100,
    currency: cheapest.shippingAmount?.currency || 'usd',
    carrierFriendlyName: cheapest.carrierFriendlyName,
    serviceType: cheapest.serviceType,
    serviceCode: cheapest.serviceCode,
    deliveryDays: cheapest.deliveryDays,
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
      packages: [{ weight: { value: Math.max(totalOunces, 1), unit: 'ounce' } }],
    },
  });
}
