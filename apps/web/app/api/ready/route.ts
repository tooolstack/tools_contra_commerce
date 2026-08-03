import { NextResponse } from 'next/server';
import { serviceHealth } from '../../../lib/health';

export const runtime = 'nodejs';

export async function GET() {
  const payload = await serviceHealth();
  const ready = payload.status === 'ready';
  return NextResponse.json(
    {
      ok: ready,
      service: 'contra-commerce-tools',
      checks: payload.checks,
      timestamp: payload.timestamp,
    },
    {
      status: ready ? 200 : 503,
      headers: { 'cache-control': 'no-store' },
    },
  );
}
