import { NextResponse } from 'next/server';
import {
  compareCourierCharges,
  detectCourierZone,
  type CourierChargeResult,
  type CourierQuote,
  type CourierZone,
} from '@contra/tools-kit';
import { checkRateLimit, requestWithinSize } from '../../../lib/api-security';

export const runtime = 'nodejs';

type ProviderPayload = {
  mode?: 'live' | 'contract';
  asOf?: string;
  quotes?: unknown[];
};

const numberAtLeast = (value: unknown, minimum: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(minimum, parsed) : minimum;
};

function normaliseProviderQuote(value: unknown, asOf: string): CourierQuote | null {
  if (!value || typeof value !== 'object') return null;
  const quote = value as Record<string, unknown>;
  const courier = String(quote.courier ?? '').trim();
  if (!courier) return null;

  const deliveryCharge = numberAtLeast(quote.deliveryCharge, 0);
  const codCharge = numberAtLeast(quote.codCharge, 0);
  const returnCharge = numberAtLeast(quote.returnCharge, 0);
  const deliveredTotal = numberAtLeast(
    quote.deliveredTotal ?? quote.total,
    deliveryCharge + codCharge,
  );
  const returnTotal = numberAtLeast(
    quote.returnTotal,
    deliveryCharge + returnCharge,
  );

  return {
    courier,
    deliveryCharge,
    codCharge,
    returnCharge,
    deliveredTotal,
    total: deliveredTotal,
    returnTotal,
    estDays: String(quote.estDays ?? 'Contact courier'),
    sourceLabel: String(quote.sourceLabel ?? 'Connected courier rate service'),
    sourceUrl: String(quote.sourceUrl ?? '#'),
    sourceStatus: quote.sourceStatus === 'indicative' ? 'indicative' : 'published',
    asOf: String(quote.asOf ?? asOf),
    note: quote.note ? String(quote.note) : undefined,
  };
}

export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'courier-rates', 40, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 12_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  const pickupDistrict = String(body.pickupDistrict ?? '').trim().slice(0, 100);
  const destinationDistrict = String(body.destinationDistrict ?? '').trim().slice(0, 100);
  const destinationArea = String(body.destinationArea ?? '').trim().slice(0, 160);
  const detectedZone = detectCourierZone({
    pickupDistrict,
    destinationDistrict,
    destinationArea,
  });
  const requestedZone = String(body.zone ?? '') as CourierZone;
  const zone: CourierZone =
    pickupDistrict && destinationDistrict ? detectedZone : requestedZone;
  const safeZone: CourierZone = ['inside-city', 'sub-city', 'outside-city'].includes(zone)
    ? zone
    : 'outside-city';
  const weightKg = numberAtLeast(body.weightKg, 0.1);
  const codAmount = numberAtLeast(body.codAmount, 0);
  const fallback = compareCourierCharges({ zone: safeZone, weightKg, codAmount });

  const providerUrl = process.env.COURIER_RATES_API_URL?.trim();
  if (!providerUrl) {
    return NextResponse.json({
      result: fallback,
      mode: 'published',
      asOf: fallback.quotes[0]?.asOf,
      fallbackReason:
        'Live or merchant-contract rate service is not configured—showing sourced public estimates.',
    });
  }

  try {
    const response = await fetch(providerUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(process.env.COURIER_RATES_API_KEY
          ? { authorization: `Bearer ${process.env.COURIER_RATES_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        pickupDistrict,
        destinationDistrict,
        destinationArea,
        zone: safeZone,
        weightKg,
        codAmount,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`Provider returned ${response.status}`);
    const payload = (await response.json()) as ProviderPayload;
    const asOf = String(payload.asOf ?? new Date().toISOString());
    const quotes = (payload.quotes ?? [])
      .map((quote) => normaliseProviderQuote(quote, asOf))
      .filter((quote): quote is CourierQuote => quote !== null)
      .sort((a, b) => a.deliveredTotal - b.deliveredTotal);
    if (!quotes.length) throw new Error('Provider returned no valid quotes');

    const result: CourierChargeResult = {
      quotes,
      cheapest: quotes[0].courier,
      zone: safeZone,
      weightKg,
      codAmount,
    };

    return NextResponse.json({
      result,
      mode: payload.mode === 'contract' ? 'contract' : 'live',
      asOf,
    });
  } catch {
    return NextResponse.json({
      result: fallback,
      mode: 'published',
      asOf: fallback.quotes[0]?.asOf,
      fallbackReason:
        'Connected rate service is temporarily unavailable—showing sourced public estimates.',
    });
  }
}
