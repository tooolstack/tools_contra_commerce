import { NextResponse } from 'next/server';
import { checkRateLimit, cleanText, requestWithinSize } from '../../../../lib/api-security';
import { getCourierConnection } from '../../../../lib/courier-connection-store';
import { testCourierConnection } from '../../../../lib/courier-adapters';
import { courierWorkspace } from '../../../../lib/courier-workspace';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'courier-connection-test', 20, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 4_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  const courierId = cleanText(body.courierId, 64).toLowerCase();
  if (!/^[a-z0-9][a-z0-9_-]+$/i.test(courierId)) {
    return NextResponse.json({ error: 'invalid_connection' }, { status: 400 });
  }
  try {
    const workspace = courierWorkspace(req);
    const connection = await getCourierConnection(workspace.workspaceId, courierId);
    if (!connection) {
      return NextResponse.json({ error: 'connection_not_found' }, { status: 404 });
    }
    const test = await testCourierConnection(connection);
    return NextResponse.json(test, {
      status: test.ok ? 200 : 422,
      headers: {
        'cache-control': 'no-store',
        ...(workspace.setCookie ? { 'set-cookie': workspace.setCookie } : {}),
      },
    });
  } catch (error) {
    console.error('Courier connection test failed', error);
    return NextResponse.json({ error: 'connection_test_unavailable' }, { status: 503 });
  }
}
