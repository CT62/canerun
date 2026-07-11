import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCheapestRate } from '@/lib/shipengine';

export async function POST(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items, fulfillment, shipTo } = await req.json();
    const isPickup = fulfillment === 'pickup';
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    // Build the dynamic Stripe line-item array based on the custom Next.js UI state
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          // Store weight parameters inside standard metadata so webhooks can read them later
          metadata: { id: item.id, weightOz: String(item.weightOz || 0) },
        },
        unit_amount: Math.round(item.price * 100), // convert float dollars to integer cents
      },
      quantity: item.quantity,
    }));

    const totalOunces = items.reduce((sum, item) => sum + (item.weightOz || 0) * item.quantity, 0);

    let shippingOptions;
    let shippingMetadata = {};
    if (!isPickup) {
      if (!shipTo) {
        return NextResponse.json({ error: 'A shipping address is required.' }, { status: 400 });
      }

      // Re-quote server-side rather than trusting a client-supplied dollar amount —
      // the price charged must come from ShipStation, not from the request body.
      const rate = await getCheapestRate({ shipTo, totalOunces });

      shippingOptions = [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: Math.round(rate.amount * 100), currency: 'usd' },
          display_name: `${rate.carrierFriendlyName} ${rate.serviceType}`,
        },
      }];

      shippingMetadata = {
        shipTo: JSON.stringify(shipTo),
        shipRateId: rate.rateId,
        totalOunces: String(totalOunces),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      metadata: { fulfillment: isPickup ? 'pickup' : 'ship', ...shippingMetadata },
      ...(shippingOptions ? { shipping_options: shippingOptions } : {}),
      success_url: `${origin}/success?fulfillment=${isPickup ? 'pickup' : 'ship'}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
