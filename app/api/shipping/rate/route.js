import { NextResponse } from 'next/server';
import { getCheapestRate } from '@/lib/shipengine';

const REQUIRED_FIELDS = ['name', 'phone', 'addressLine1', 'cityLocality', 'stateProvince', 'postalCode', 'countryCode'];

export async function POST(req) {
  try {
    const { shipTo, totalOunces } = await req.json();

    const missing = REQUIRED_FIELDS.filter((field) => !shipTo?.[field]);
    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing address fields: ${missing.join(', ')}` }, { status: 400 });
    }

    const rate = await getCheapestRate({ shipTo, totalOunces: Number(totalOunces) || 0 });
    return NextResponse.json({ rate });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
