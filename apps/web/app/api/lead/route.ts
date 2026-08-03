import { NextResponse } from 'next/server';
import { saveLead } from '../../../lib/db';
import {
  checkRateLimit,
  cleanText,
  requestWithinSize,
} from '../../../lib/api-security';

export const runtime = 'nodejs';

// Capture a lead (contact info) — the funnel goal. Wire a tool's onResult /
// a capture form to POST { tool, name, phone, email, meta } here.
export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'lead', 5, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'retry-after': String(rate.retryAfterSeconds) } },
    );
  }
  if (!requestWithinSize(req, 12_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  if (body.consent !== true) {
    return NextResponse.json({ error: 'consent_required' }, { status: 400 });
  }
  const email = cleanText(body.email, 160).toLowerCase();
  const phone = cleanText(body.phone, 24).replace(/\D/g, '');
  const validEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPhone = !phone || /^(?:88)?01\d{9}$/.test(phone);
  if ((!email && !phone) || !validEmail || !validPhone) {
    return NextResponse.json({ error: 'invalid_contact' }, { status: 400 });
  }

  const result = await saveLead({
    tool: cleanText(body.tool, 64),
    name: cleanText(body.name, 100),
    phone: phone || undefined,
    email: email || undefined,
    meta:
      body.meta && typeof body.meta === 'object'
        ? {
            page: cleanText(body.meta.page, 200),
            utmSource: cleanText(body.meta.utmSource, 100),
            utmCampaign: cleanText(body.meta.utmCampaign, 100),
            consentAt: new Date().toISOString(),
          }
        : { consentAt: new Date().toISOString() },
  });
  if (!result.saved && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'lead_storage_unavailable' }, { status: 503 });
  }
  return NextResponse.json({ ok: true, queued: result.queued });
}
