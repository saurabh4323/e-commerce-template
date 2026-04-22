import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'rates.json');

function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readStoredRates() {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {}
  return null;
}

// ── Completely FREE — No API key needed ──
// Gold/Silver: https://api.gold-api.com (no key, real-time)
// Forex:       https://open.er-api.com  (no key, updates daily)
async function fetchLiveRates() {
  // Parallel fetch gold + silver + USD/INR rate
  const [goldRes, silverRes, forexRes] = await Promise.all([
    fetch('https://api.gold-api.com/price/XAU', { cache: 'no-store' }),
    fetch('https://api.gold-api.com/price/XAG', { cache: 'no-store' }),
    fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' }),
  ]);

  if (!goldRes.ok || !silverRes.ok || !forexRes.ok) {
    throw new Error('One or more upstream APIs failed');
  }

  const [gold, silver, forex] = await Promise.all([
    goldRes.json(),
    silverRes.json(),
    forexRes.json(),
  ]);

  const usdToInr = forex.rates.INR; // e.g. 93.60

  // gold.price / silver.price are in USD per troy ounce
  // 1 troy oz = 31.1035 grams
  const goldPer10gInr = (gold.price / 31.1035) * 10 * usdToInr;
  const silverPer1gInr = (silver.price / 31.1035) * usdToInr;

  return {
    source: 'live',
    mode: 'api',
    gold24k: Math.round(goldPer10gInr),
    gold22k: Math.round(goldPer10gInr * 0.916),
    gold18k: Math.round(goldPer10gInr * 0.75),
    silverGram: Math.round(silverPer1gInr),
    silverKg: Math.round(silverPer1gInr * 1000),
    usdToInr: Math.round(usdToInr * 100) / 100,
    goldUsdOz: Math.round(gold.price * 100) / 100,
    silverUsdOz: Math.round(silver.price * 100) / 100,
    updatedAt: new Date().toISOString(),
  };
}

// ── GET: Serve rates to website ──
export async function GET() {
  const stored = readStoredRates();

  // If admin set manual mode, serve stored manual rates
  if (stored?.mode === 'manual') {
    return NextResponse.json(stored);
  }

  // Default: live API mode
  try {
    const live = await fetchLiveRates();
    return NextResponse.json(live);
  } catch (err) {
    // Fallback to last stored if live fails
    if (stored) {
      return NextResponse.json({ ...stored, fallback: true });
    }
    // Ultimate fallback (demo)
    return NextResponse.json({
      source: 'demo',
      mode: 'api',
      gold24k: 78000,
      gold22k: 71500,
      gold18k: 58500,
      silverGram: 95,
      silverKg: 95000,
      updatedAt: new Date().toISOString(),
      fallback: true,
    });
  }
}

// ── POST: Admin saves manual rates OR switches mode ──
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    ensureDataDir();

    // Switch to API mode
    if (action === 'set_mode_api') {
      const current = readStoredRates() || {};
      const updated = { ...current, mode: 'api', updatedAt: new Date().toISOString() };
      fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
      return NextResponse.json({ success: true, mode: 'api' });
    }

    // Switch to manual mode & save rates
    if (action === 'set_manual') {
      const { gold22k, gold24k, gold18k, silverGram, silverKg } = body;
      if (!gold22k || !gold24k || !gold18k || !silverGram || !silverKg) {
        return NextResponse.json({ error: 'All rate fields are required' }, { status: 400 });
      }
      const data = {
        source: 'manual',
        mode: 'manual',
        gold24k: Number(gold24k),
        gold22k: Number(gold22k),
        gold18k: Number(gold18k),
        silverGram: Number(silverGram),
        silverKg: Number(silverKg),
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
