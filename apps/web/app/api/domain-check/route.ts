import { NextResponse } from 'next/server';
import { logEvent } from '../../../lib/db';
import { checkRateLimit, requestWithinSize } from '../../../lib/api-security';

export const runtime = 'nodejs';

/**
 * Domain availability check — REAL, via RDAP (free, no key).
 * RDAP returns 404 for an unregistered domain and 200 for a registered one.
 */
export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'domain-check', 20, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 12_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  const domains: string[] = Array.isArray(body.domains)
    ? body.domains
        .map((d: unknown) => String(d).trim().toLowerCase())
        .filter((domain: string) => /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain))
    : [];

  const results = await Promise.all(
    domains.slice(0, 12).map(async (domain) => {
      try {
        const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
          headers: { accept: 'application/rdap+json' },
          redirect: 'follow',
          signal: AbortSignal.timeout(8000),
        });
        if (res.status === 404) return { domain, available: true };
        if (res.status === 200) return { domain, available: false };
        return { domain, available: null }; // unknown (rate limit / unsupported TLD)
      } catch {
        return { domain, available: null };
      }
    }),
  );

  await logEvent('name-checker', { domains: domains.slice(0, 12) }, { req });
  return NextResponse.json({ results });
}
