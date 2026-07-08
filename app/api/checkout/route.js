import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { items, fulfillment } = await req.json();
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      metadata: { fulfillment: isPickup ? 'pickup' : 'ship' },
      // Pickup orders skip shipping address collection entirely — nothing to ship.
      ...(isPickup ? {} : { shipping_address_collection: { allowed_countries: ['US', 'CA'] } }),
      success_url: `${origin}/success?fulfillment=${isPickup ? 'pickup' : 'ship'}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
