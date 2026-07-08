import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const signature = req.headers.get('stripe-signature');
  const payload = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      // Sum the configured bag weights (in oz) carried in each line item's product metadata
      const totalOunces = lineItems.data.reduce((sum, item) => {
        const weightOz = parseFloat(item.price?.product?.metadata?.weightOz) || 0;
        return sum + weightOz * item.quantity;
      }, 0);

      // Pickup orders have nothing to ship — skip ShipEngine entirely.
      // Otherwise, shipment creation is opt-in: only attempt it once ShipEngine + a
      // ship-from address are configured via env vars, so we never guess at real warehouse details.
      if (session.metadata?.fulfillment !== 'pickup' && process.env.SHIPENGINE_API_KEY && process.env.SHIP_FROM_ADDRESS_JSON) {
        const { default: ShipEngine } = await import('shipengine');
        const shipengine = new ShipEngine(process.env.SHIPENGINE_API_KEY);
        const shipFrom = JSON.parse(process.env.SHIP_FROM_ADDRESS_JSON);
        const shipTo = session.shipping_details?.address;

        if (shipTo) {
          await shipengine.createLabelFromShipmentDetails({
            shipment: {
              ship_from: shipFrom,
              ship_to: {
                name: session.shipping_details?.name,
                address_line1: shipTo.line1,
                address_line2: shipTo.line2 || undefined,
                city_locality: shipTo.city,
                state_province: shipTo.state,
                postal_code: shipTo.postal_code,
                country_code: shipTo.country,
              },
              packages: [{ weight: { value: Math.max(totalOunces, 1), unit: 'ounce' } }],
            },
          });
        }
      }
    } catch (err) {
      // Never fail the webhook response over a shipping-side error — log and let Stripe consider it delivered.
      console.error('Post-checkout fulfillment error:', err);
    }
  }

  return NextResponse.json({ received: true });
}
