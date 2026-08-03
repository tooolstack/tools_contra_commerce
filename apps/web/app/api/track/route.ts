import { NextResponse } from 'next/server';
import { logEvent } from '../../../lib/db';
import { checkRateLimit, requestWithinSize } from '../../../lib/api-security';
import { listActiveCourierConnections } from '../../../lib/courier-connection-store';
import { courierWorkspace } from '../../../lib/courier-workspace';
import { trackCourierOrders, type CourierTrackingResult } from '../../../lib/courier-adapters';

export const runtime = 'nodejs';

/**
 * Courier Parcel Tracking Hub API.
 *
 * Real status comes from courier connections saved in this visitor's encrypted
 * workspace. No deterministic/demo delivery result is presented as real data.
 */
export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'parcel-track', 30, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 20_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  const numbers: string[] = Array.isArray(body.trackingNumbers)
    ? body.trackingNumbers
        .map((n: unknown) => String(n).trim().slice(0, 100))
        .filter(Boolean)
        .slice(0, 50)
    : [];
  const type = ['invoice', 'cid', 'trackingcode'].includes(body.type) ? body.type : 'trackingcode';

  if (!numbers.length) {
    return NextResponse.json({ error: 'tracking_numbers_required' }, { status: 400 });
  }

  try {
    const workspace = courierWorkspace(req);
    const connections = await listActiveCourierConnections(workspace.workspaceId);
    if (!connections.length) {
      return NextResponse.json(
        { error: 'courier_connection_required' },
        {
          status: 409,
          headers: workspace.setCookie ? { 'set-cookie': workspace.setCookie } : {},
        },
      );
    }
    const unresolved = new Set(numbers);
    const resolved = new Map<string, CourierTrackingResult>();
    const providerErrors: Array<{ courier: string; error: string }> = [];
    for (const connection of connections) {
      if (!unresolved.size) break;
      try {
        const rows = await trackCourierOrders(connection, [...unresolved], type);
        for (const row of rows) {
          if (!row.found) continue;
          resolved.set(row.tracking, row);
          unresolved.delete(row.tracking);
        }
      } catch (error) {
        providerErrors.push({
          courier: connection.displayName,
          error: error instanceof Error ? error.message : 'Tracking failed',
        });
      }
    }
    const results = numbers.map(
      (tracking) =>
        resolved.get(tracking) || {
          tracking,
          status: 'Not found',
          courier: 'Connected couriers',
          lastUpdate: 'live',
          found: false,
        },
    );
    await logEvent('parcel-tracking', { count: numbers.length }, { demo: false, req });
    return NextResponse.json(
      { demo: false, results, providerErrors },
      {
        headers: {
          'cache-control': 'no-store',
          ...(workspace.setCookie ? { 'set-cookie': workspace.setCookie } : {}),
        },
      },
    );
  } catch (error) {
    console.error('Connected courier tracking failed', error);
    return NextResponse.json({ error: 'tracking_service_unavailable' }, { status: 503 });
  }
}
