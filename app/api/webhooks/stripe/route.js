import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { purchaseLabelForOrder } from '@/lib/shipengine';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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

      const items = lineItems.data.map((item) => ({
        name: item.price?.product?.name || item.description,
        quantity: item.quantity,
        amount: (item.amount_total || 0) / 100,
      }));

      // Sum the configured bag weights (in oz) carried in each line item's product metadata
      const totalOunces = lineItems.data.reduce((sum, item) => {
        const weightOz = parseFloat(item.price?.product?.metadata?.weightOz) || 0;
        return sum + weightOz * item.quantity;
      }, 0);

      const isPickup = session.metadata?.fulfillment === 'pickup';
      let tracking = null;

      // Pickup orders have nothing to ship — skip ShipStation entirely.
      // Otherwise, label purchase is opt-in: only attempt it once ShipStation + a
      // ship-from address are configured via env vars, so we never guess at real warehouse details.
      if (!isPickup && process.env.SHIPENGINE_API_KEY && process.env.SHIP_FROM_ADDRESS_JSON && session.metadata?.shipTo) {
        const shipTo = JSON.parse(session.metadata.shipTo);
        const label = await purchaseLabelForOrder({
          rateId: session.metadata.shipRateId,
          shipTo,
          totalOunces: Number(session.metadata.totalOunces) || totalOunces,
        });
        tracking = { trackingNumber: label.trackingNumber, carrierCode: label.carrierCode };
      }

      await sendOrderConfirmationEmail({
        to: session.customer_details?.email,
        items,
        total: (session.amount_total || 0) / 100,
        fulfillment: isPickup ? 'pickup' : 'ship',
        tracking,
      });
    } catch (err) {
      // Never fail the webhook response over a shipping/email-side error — log and let Stripe consider it delivered.
      console.error('Post-checkout fulfillment error:', err);
    }
  }

  return NextResponse.json({ received: true });
}
