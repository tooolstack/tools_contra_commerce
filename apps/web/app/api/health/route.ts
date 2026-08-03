import { NextResponse } from 'next/server';
import { serviceHealth } from '../../../lib/health';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await serviceHealth(), {
    status: 200,
    headers: { 'cache-control': 'no-store' },
  });
}
