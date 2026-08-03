import { NextResponse } from 'next/server';
import { logEvent } from '../../../lib/db';
import { checkRateLimit, cleanText, requestWithinSize } from '../../../lib/api-security';
import { assertPublicHttpUrl, fetchPublicHtml } from '../../../lib/safe-url';

export const runtime = 'nodejs';

type Check = { label: string; pass: boolean; detail: string };

/**
 * Free Store Health Checker API — REAL analysis (no key required).
 * Fetches the homepage HTML for conversion/SEO signals and (best-effort) pulls
 * a mobile performance score from Google PageSpeed Insights.
 */
export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'store-health', 10, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 8_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  let url = cleanText(body.url, 500);
  if (!url) return NextResponse.json({ error: 'missing_url' }, { status: 400 });
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  try {
    url = (await assertPublicHttpUrl(url)).toString();
  } catch {
    return NextResponse.json({ error: 'invalid_or_private_url' }, { status: 400 });
  }

  const [htmlRes, speed] = await Promise.allSettled([fetchPublicHtml(url), pageSpeed(url)]);

  if (htmlRes.status !== 'fulfilled' || !htmlRes.value.reachable) {
    await logEvent('store-health', { url, reachable: false }, { req });
    return NextResponse.json({ url, reachable: false, score: 0, checks: [] });
  }

  const { html, httpsOk } = htmlRes.value;
  const has = (re: RegExp) => re.test(html);

  const checks: Check[] = [
    { label: 'HTTPS', pass: httpsOk, detail: httpsOk ? 'Secure connection' : 'Not served over HTTPS' },
    { label: 'Mobile viewport', pass: has(/<meta[^>]+name=["']viewport["']/i), detail: 'Responsive on phones' },
    { label: 'Page title', pass: has(/<title[^>]*>[^<]{3,}<\/title>/i), detail: 'Has a descriptive <title>' },
    {
      label: 'Meta description',
      pass: has(/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{10,}/i),
      detail: 'For search snippets',
    },
    { label: 'WhatsApp / contact', pass: has(/wa\.me|whatsapp|href=["']tel:|messenger|m\.me/i), detail: 'Easy way to reach you' },
    { label: 'Return / refund policy', pass: has(/return|refund|exchange|রিটার্ন/i), detail: 'Builds buyer trust' },
    { label: 'Trust signals', pass: has(/review|rating|verified|ssl|secure|testimonial/i), detail: 'Reviews / security badges' },
    {
      label: 'Product / buy buttons',
      pass: has(/add to cart|buy now|order now|add-to-cart|অর্ডার/i),
      detail: 'Clear purchase action (product-page quality)',
    },
    {
      label: 'Cart / checkout',
      pass: has(/checkout|shopping.?cart|["'/]cart["'/]|চেকআউট/i),
      detail: 'Checkout path present (low friction)',
    },
    { label: 'Open Graph tags', pass: has(/<meta[^>]+property=["']og:/i), detail: 'Nice link previews' },
    { label: 'Analytics / pixel', pass: has(/gtag|googletagmanager|fbq\(|connect\.facebook\.net/i), detail: 'Track visitors & ads' },
  ];

  // Mobile speed (best-effort — present only if PageSpeed responded).
  const mobileSpeed = speed.status === 'fulfilled' ? speed.value : null;
  if (mobileSpeed != null) {
    checks.splice(1, 0, {
      label: 'Mobile speed',
      pass: mobileSpeed >= 50,
      detail: `Google PageSpeed mobile score: ${mobileSpeed}/100`,
    });
  }

  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);
  await logEvent('store-health', { url, score, passed, mobileSpeed }, { req });
  return NextResponse.json({ url, reachable: true, score, passed, total: checks.length, mobileSpeed, checks });
}

async function pageSpeed(url: string): Promise<number | null> {
  try {
    const key = process.env.PAGESPEED_API_KEY;
    const api =
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}` +
      `&strategy=mobile&category=performance${key ? `&key=${key}` : ''}`;
    const res = await fetch(api, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) return null;
    const d = await res.json();
    const s = d?.lighthouseResult?.categories?.performance?.score;
    return typeof s === 'number' ? Math.round(s * 100) : null;
  } catch {
    return null;
  }
}
