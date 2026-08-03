import { NextResponse } from 'next/server';
import { logEvent } from '../../../lib/db';
import { checkRateLimit, requestWithinSize } from '../../../lib/api-security';

export const runtime = 'nodejs';

// Generic client-side ingest — the calculators POST their (debounced) results here.
export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'event', 120, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 24_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  const tool = String(body.tool ?? 'unknown').slice(0, 64);
  await logEvent(tool, body.payload ?? null, { req });
  return NextResponse.json({ ok: true });
}
