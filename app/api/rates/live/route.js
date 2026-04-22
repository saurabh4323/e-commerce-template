import { NextResponse } from 'next/server';

// Admin preview endpoint — fetch live rates without saving
export async function GET() {
  try {
    const [goldRes, silverRes, forexRes] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAU', { cache: 'no-store' }),
      fetch('https://api.gold-api.com/price/XAG', { cache: 'no-store' }),
      fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' }),
    ]);

    if (!goldRes.ok || !silverRes.ok || !forexRes.ok) {
      throw new Error('Upstream API error');
    }

    const [gold, silver, forex] = await Promise.all([
      goldRes.json(), silverRes.json(), forexRes.json(),
    ]);

    const usdToInr = forex.rates.INR;
    const goldPer10gInr = (gold.price / 31.1035) * 10 * usdToInr;
    const silverPer1gInr = (silver.price / 31.1035) * usdToInr;

    return NextResponse.json({
      gold24k: Math.round(goldPer10gInr),
      gold22k: Math.round(goldPer10gInr * 0.916),
      gold18k: Math.round(goldPer10gInr * 0.75),
      silverGram: Math.round(silverPer1gInr),
      silverKg: Math.round(silverPer1gInr * 1000),
      usdToInr: Math.round(usdToInr * 100) / 100,
      goldUsdOz: Math.round(gold.price * 100) / 100,
      silverUsdOz: Math.round(silver.price * 100) / 100,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
