import { NextResponse } from 'next/server';
import { checkRateLimit } from '../../../lib/api-security';
import { listActiveCourierConnections } from '../../../lib/courier-connection-store';
import { courierWorkspace } from '../../../lib/courier-workspace';
import { courierCapabilities } from '../../../lib/courier-adapters';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const rate = await checkRateLimit(req, 'courier-booking-status', 60, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  try {
    const workspace = courierWorkspace(req);
    const connections = await listActiveCourierConnections(workspace.workspaceId);
    const configured = connections.some(
      (connection) => courierCapabilities(connection).includes('booking'),
    );
    return NextResponse.json(
      {
        configured,
        authenticated: true,
        directBooking: configured,
        bookingUrl: configured ? '/courier-charge' : '/courier-settings',
      },
      {
        headers: {
          'cache-control': 'no-store',
          ...(workspace.setCookie ? { 'set-cookie': workspace.setCookie } : {}),
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        configured: false,
        authenticated: true,
        error: 'connection_service_unavailable',
      },
      { headers: { 'cache-control': 'no-store' } },
    );
  }
}
