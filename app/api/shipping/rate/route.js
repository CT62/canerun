import { NextResponse } from 'next/server';
import { getCheapestRate } from '@/lib/shipengine';
import { packItemsIntoBags } from '@/lib/bagSizes';

const REQUIRED_FIELDS = ['name', 'phone', 'addressLine1', 'cityLocality', 'stateProvince', 'postalCode', 'countryCode'];

export async function POST(req) {
  try {
    const { shipTo, items } = await req.json();

    const missing = REQUIRED_FIELDS.filter((field) => !shipTo?.[field]);
    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing address fields: ${missing.join(', ')}` }, { status: 400 });
    }

    // Re-derive the real bag breakdown server-side rather than trusting a client-supplied
    // package list — the seed density and bag-packing math live in one place (lib/bagSizes).
    const bagLines = packItemsIntoBags(items || []);
    const rate = await getCheapestRate({ shipTo, bagLines });
    return NextResponse.json({ rate });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
