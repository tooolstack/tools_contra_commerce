import { NextResponse } from 'next/server';
import {
  listCourierConnections,
  saveCourierConnection,
  deleteCourierConnection,
} from '../../../lib/courier-connection-store';
import { courierWorkspace } from '../../../lib/courier-workspace';
import { checkRateLimit, cleanText, requestWithinSize } from '../../../lib/api-security';

export const runtime = 'nodejs';

const TYPES = ['builtin', 'custom_history', 'custom_order_status'] as const;

export async function GET(req: Request) {
  const rate = await checkRateLimit(req, 'courier-connections-read', 60, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  try {
    const workspace = courierWorkspace(req);
    return NextResponse.json(await listCourierConnections(workspace.workspaceId), {
      headers: {
        'cache-control': 'no-store',
        ...(workspace.setCookie ? { 'set-cookie': workspace.setCookie } : {}),
      },
    });
  } catch (error) {
    console.error('Courier connection service read failed', error);
    return NextResponse.json(
      { error: 'connection_service_unavailable' },
      { status: 503 },
    );
  }
}

export async function DELETE(req: Request) {
  const rate = await checkRateLimit(req, 'courier-connections-delete', 20, 60 * 60 * 1000);
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
    const deleted = await deleteCourierConnection(workspace.workspaceId, courierId);
    return NextResponse.json(
      { ok: true, deleted },
      {
        headers: {
          'cache-control': 'no-store',
          ...(workspace.setCookie ? { 'set-cookie': workspace.setCookie } : {}),
        },
      },
    );
  } catch (error) {
    console.error('Courier connection deletion failed', error);
    return NextResponse.json({ error: 'connection_service_unavailable' }, { status: 503 });
  }
}

export async function PUT(req: Request) {
  const rate = await checkRateLimit(req, 'courier-connections-write', 20, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 32_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }

  const body = await req.json().catch(() => ({}));
  const courierId = cleanText(body.courierId, 64).toLowerCase();
  const displayName = cleanText(body.displayName, 100);
  const connectionType = TYPES.includes(body.connectionType)
    ? (body.connectionType as (typeof TYPES)[number])
    : null;
  if (!/^[a-z0-9][a-z0-9_-]+$/i.test(courierId) || !displayName || !connectionType) {
    return NextResponse.json({ error: 'invalid_connection' }, { status: 400 });
  }

  const credentials = sanitiseCredentials(
    connectionType,
    body.credentials && typeof body.credentials === 'object' ? body.credentials : {},
  );
  const missingCredential =
    (courierId === 'steadfast' && (!credentials.apiKey || !credentials.apiSecret)) ||
    (courierId === 'pathao' &&
      (!credentials.clientId ||
        !credentials.clientSecret ||
        !credentials.username ||
        !credentials.password)) ||
    (courierId === 'carrybee' && (!credentials.baseUrl || !credentials.apiKey)) ||
    ((connectionType === 'custom_history' || connectionType === 'custom_order_status') &&
      !credentials.endpoint);
  if (missingCredential) {
    return NextResponse.json({ error: 'required_credentials_missing' }, { status: 400 });
  }
  try {
    const workspace = courierWorkspace(req);
    const result = await saveCourierConnection(workspace.workspaceId, courierId, {
      displayName,
      connectionType,
      enabled: body.enabled !== false,
      syncEnabled: body.syncEnabled !== false,
      credentials,
    });
    return NextResponse.json(result, {
      headers: {
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
        ...(workspace.setCookie ? { 'set-cookie': workspace.setCookie } : {}),
      },
    });
  } catch (error) {
    console.error('Courier connection service write failed', error);
    return NextResponse.json(
      { error: 'connection_service_unavailable' },
      { status: 503 },
    );
  }
}

function sanitiseCredentials(
  type: (typeof TYPES)[number],
  source: Record<string, unknown>,
): Record<string, unknown> {
  const text = (key: string, max = 500) => cleanText(source[key], max);
  if (type === 'builtin') {
    return {
      baseUrl: text('baseUrl', 500),
      apiKey: text('apiKey', 1000),
      apiSecret: text('apiSecret', 1000),
      clientId: text('clientId', 500),
      clientSecret: text('clientSecret', 1000),
      username: text('username', 320),
      password: text('password', 1000),
      lookupPath: text('lookupPath', 500),
      ordersPath: text('ordersPath', 200),
      historyMapping: {
        externalIdPath: text('historyExternalIdPath', 200),
        statusPath: text('historyStatusPath', 200),
        reasonPath: text('historyReasonPath', 200),
        occurredAtPath: text('historyOccurredAtPath', 200),
      },
      booking: {
        endpoint: text('bookingEndpoint', 1000),
        method: text('bookingMethod', 10).toUpperCase() || 'POST',
        headers: text('bookingHeaders', 8000),
        apiKeyHeader: text('bookingApiKeyHeader', 100) || 'Authorization',
        apiKeyPrefix: text('bookingApiKeyPrefix', 100),
        apiKey: text('bookingApiKey', 1000),
        bodyTemplate: text('bookingBodyTemplate', 8000),
        mapping: {
          externalIdPath: text('bookingExternalIdPath', 200),
          trackingPath: text('bookingTrackingPath', 200),
          statusPath: text('bookingStatusPath', 200),
        },
      },
    };
  }
  return {
    endpoint: text('endpoint', 1000),
    method: text('method', 10).toUpperCase() === 'GET' ? 'GET' : 'POST',
    phoneField: text('phoneField', 100) || 'phone',
    idField: text('idField', 100) || 'id',
    apiKeyHeader: text('apiKeyHeader', 100) || 'Authorization',
    apiKeyPrefix: text('apiKeyPrefix', 100),
    apiKey: text('apiKey', 1000),
    headers: text('headers', 8000),
    bodyTemplate: text('bodyTemplate', 8000),
    mapping:
      type === 'custom_history'
        ? {
            rootPath: text('rootPath', 200),
            deliveredPath: text('deliveredPath', 200),
            failedPath: text('failedPath', 200),
            totalPath: text('totalPath', 200),
            successRatePath: text('successRatePath', 200),
          }
        : {
            statusPath: text('statusPath', 200) || 'status',
            reasonPath: text('reasonPath', 200) || 'reason',
          },
    booking: {
      endpoint: text('bookingEndpoint', 1000),
      method: text('bookingMethod', 10).toUpperCase() || 'POST',
      headers: text('bookingHeaders', 8000),
      apiKeyHeader: text('bookingApiKeyHeader', 100) || 'Authorization',
      apiKeyPrefix: text('bookingApiKeyPrefix', 100),
      apiKey: text('bookingApiKey', 1000),
      bodyTemplate: text('bookingBodyTemplate', 8000),
      mapping: {
        externalIdPath: text('bookingExternalIdPath', 200),
        trackingPath: text('bookingTrackingPath', 200),
        statusPath: text('bookingStatusPath', 200),
      },
    },
  };
}
