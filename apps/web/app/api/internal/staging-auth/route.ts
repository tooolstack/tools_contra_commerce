import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function matchesSecret(value: string, expected: string) {
  if (!value || !expected || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export async function GET(req: Request) {
  if (process.env.DEPLOYMENT_STAGE !== 'staging') {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  const expected = process.env.STAGING_AUTH_BYPASS_SECRET || '';
  if (expected.length < 32) {
    return NextResponse.json({ error: 'staging_auth_not_configured' }, { status: 503 });
  }
  const cookie = req.headers
    .get('cookie')
    ?.split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith('contra-staging-session='))
    ?.slice('contra-staging-session='.length);
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  const authenticated =
    matchesSecret(decodeURIComponent(cookie || ''), expected) ||
    matchesSecret(bearer, expected);
  return NextResponse.json(
    {
      authenticated,
      bookingUrl: authenticated ? '/courier-charge' : undefined,
      staging: true,
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
