import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { processLeadOutbox } from '../../../../lib/lead-outbox';

export const runtime = 'nodejs';

function authorized(req: Request) {
  const expected = process.env.CRON_SECRET || '';
  const supplied = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  if (!expected || expected.length !== supplied.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ ok: true, ...(await processLeadOutbox(50)) });
}
