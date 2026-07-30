import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { purchaseLabelForOrder } from '@/lib/shipengine';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { packItemsIntoBags } from '@/lib/bagSizes';

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

      // Re-derive the real small/medium/large bag breakdown from each line item's product
      // metadata (seed id + configured per-bag weight) — same packing math used at checkout,
      // recomputed here rather than trusted from Stripe metadata so it can't go stale.
      const bagLines = packItemsIntoBags(
        lineItems.data.map((item) => ({
          id: item.price?.product?.metadata?.id,
          weightOz: parseFloat(item.price?.product?.metadata?.weightOz) || 0,
          quantity: item.quantity,
        }))
      );

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
          bagLines,
        });
        tracking = {
          trackingNumber: label.trackingNumber,
          carrierCode: label.carrierCode,
          labelUrl: label.labelDownload?.pdf || label.labelDownload?.href || null,
          // Multi-package shipments (e.g. an order whose bags didn't all fit in one box)
          // carry one tracking number per box here, even though the label itself is a single object.
          packages: (label.packages || [])
            .filter((pkg) => pkg.trackingNumber)
            .map((pkg) => ({ trackingNumber: pkg.trackingNumber })),
        };
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
