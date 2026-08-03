import { assertPublicHttpUrl } from './safe-url';
import type { CourierConnectionSummary } from './courier-connection-store';

type ConnectedCourier = CourierConnectionSummary & {
  credentials: Record<string, unknown>;
};

export type CourierCapability = 'connection_test' | 'tracking' | 'history' | 'booking';

export type ConnectionTestResult = {
  ok: boolean;
  courierId: string;
  message: string;
  capabilities: CourierCapability[];
  checkedAt: string;
};

export type CourierTrackingResult = {
  tracking: string;
  status: string;
  courier: string;
  lastUpdate: string;
  found: boolean;
};

export type CourierHistoryResult = {
  courier: string;
  delivered: number;
  failed: number;
  total: number;
  successRate: number | null;
};

export type CourierBookingInput = {
  courierId: string;
  invoice: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  codAmount: number;
  weightKg: number;
  itemDescription?: string;
  itemQuantity?: number;
  note?: string;
};

export type CourierBookingResult = {
  ok: true;
  booking: {
    id: string;
    courierId: string;
    invoice: string;
    status: string;
    externalId?: string | null;
    trackingCode?: string | null;
  };
};

const text = (value: unknown) => String(value ?? '').trim();

function endpoint(baseUrl: unknown, path: string): string {
  const base = text(baseUrl).replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function nestedValue(source: unknown, path: string): unknown {
  if (!path) return source;
  return path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object') return undefined;
    return (value as Record<string, unknown>)[key];
  }, source);
}

function friendlyStatus(value: unknown): string {
  const raw = text(value);
  if (!raw) return 'Not found';
  if (/out.?for.?deliver/i.test(raw)) return 'Out for Delivery';
  if (/deliver/i.test(raw)) return 'Delivered';
  if (/transit|picked|processing/i.test(raw)) return 'In Transit';
  if (/hold|review/i.test(raw)) return 'On Hold';
  if (/cancel|return|refus|partial/i.test(raw)) return 'Returning';
  if (/pending/i.test(raw)) return 'In Transit';
  return raw.replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function parseHeaderJson(value: unknown): Record<string, string> {
  if (!text(value)) return {};
  const parsed = JSON.parse(text(value));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Courier headers must be a JSON object');
  }
  const blocked = new Set(['host', 'connection', 'content-length', 'transfer-encoding']);
  return Object.fromEntries(
    Object.entries(parsed)
      .filter(([key, headerValue]) => !blocked.has(key.toLowerCase()) && typeof headerValue === 'string')
      .map(([key, headerValue]) => [key, String(headerValue)])
      .slice(0, 30),
  );
}

function applyTemplate(template: string, identifier: string): string {
  return template.replaceAll('{{id}}', identifier).replaceAll('{{tracking}}', identifier);
}

function bookingTemplate(template: string, booking: CourierBookingInput): string {
  const values: Record<string, string | number> = {
    invoice: booking.invoice,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    deliveryAddress: booking.deliveryAddress,
    codAmount: booking.codAmount,
    weightKg: booking.weightKg,
    itemDescription: booking.itemDescription || '',
    itemQuantity: booking.itemQuantity || 1,
    note: booking.note || '',
  };
  return Object.entries(values).reduce(
    (output, [key, value]) =>
      output.replaceAll(
        `{{${key}}}`,
        typeof value === 'number' ? String(value) : JSON.stringify(value).slice(1, -1),
      ),
    template,
  );
}

function finiteNumber(value: unknown): number | null {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

async function safeJsonRequest(
  rawUrl: string,
  init: RequestInit,
): Promise<{ status: number; payload: Record<string, unknown> }> {
  const url = await assertPublicHttpUrl(rawUrl);
  const response = await fetch(url, {
    ...init,
    redirect: 'error',
    signal: AbortSignal.timeout(10_000),
  });
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (declaredLength > 1_000_000) throw new Error('Courier response is too large');
  const raw = (await response.text()).slice(0, 1_000_000);
  let payload: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) payload = parsed;
  } catch {
    // Some provider errors are plain text; status handling below remains authoritative.
  }
  return { status: response.status, payload };
}

function result(
  connection: ConnectedCourier,
  ok: boolean,
  message: string,
  capabilities: CourierCapability[],
): ConnectionTestResult {
  return {
    ok,
    courierId: connection.courierId,
    message,
    capabilities,
    checkedAt: new Date().toISOString(),
  };
}

async function testSteadfast(connection: ConnectedCourier): Promise<ConnectionTestResult> {
  const credentials = connection.credentials;
  const baseUrl = text(credentials.baseUrl) || 'https://portal.packzy.com/api/v1';
  const apiKey = text(credentials.apiKey);
  const apiSecret = text(credentials.apiSecret);
  if (!apiKey || !apiSecret) {
    return result(connection, false, 'Steadfast API key and secret are required.', []);
  }
  const response = await safeJsonRequest(endpoint(baseUrl, '/get_balance'), {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'secret-key': apiSecret,
    },
  });
  if (response.status >= 200 && response.status < 300) {
    return result(
      connection,
      true,
      'Steadfast authenticated successfully.',
      ['connection_test', ...courierCapabilities(connection)],
    );
  }
  return result(
    connection,
    false,
    response.status === 401 || response.status === 403
      ? 'Steadfast rejected the API credentials.'
      : `Steadfast returned HTTP ${response.status}.`,
    [],
  );
}

async function testPathao(connection: ConnectedCourier): Promise<ConnectionTestResult> {
  const credentials = connection.credentials;
  const baseUrl = text(credentials.baseUrl) || 'https://api-hermes.pathao.com';
  const clientId = text(credentials.clientId);
  const clientSecret = text(credentials.clientSecret);
  const username = text(credentials.username);
  const password = text(credentials.password);
  if (!clientId || !clientSecret || !username || !password) {
    return result(
      connection,
      false,
      'Pathao client ID, client secret, username and password are required for a live test.',
      [],
    );
  }
  const response = await safeJsonRequest(endpoint(baseUrl, '/aladdin/api/v1/issue-token'), {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      username,
      password,
      grant_type: 'password',
    }),
  });
  if (
    response.status >= 200 &&
    response.status < 300 &&
    typeof response.payload.access_token === 'string'
  ) {
    return result(
      connection,
      true,
      'Pathao authenticated successfully.',
      ['connection_test', ...courierCapabilities(connection)],
    );
  }
  return result(
    connection,
    false,
    response.status === 401 || response.status === 403 || response.status === 422
      ? 'Pathao rejected the merchant credentials.'
      : `Pathao returned HTTP ${response.status}.`,
    [],
  );
}

export function courierCapabilities(connection: ConnectedCourier): CourierCapability[] {
  const credentials = connection.credentials;
  const capabilities: CourierCapability[] = [];
  if (connection.courierId === 'steadfast') {
    return ['tracking', 'booking'];
  }
  if (connection.connectionType === 'builtin' && text(credentials.lookupPath)) {
    capabilities.push('history');
  }
  if (connection.connectionType === 'custom_order_status' && text(credentials.endpoint)) {
    capabilities.push('tracking');
  }
  if (connection.connectionType === 'custom_history' && text(credentials.endpoint)) {
    capabilities.push('history');
  }
  const booking =
    credentials.booking && typeof credentials.booking === 'object'
      ? (credentials.booking as Record<string, unknown>)
      : {};
  if (text(booking.endpoint)) capabilities.push('booking');
  return capabilities;
}

export async function testCourierConnection(
  connection: ConnectedCourier,
): Promise<ConnectionTestResult> {
  try {
    if (connection.courierId === 'steadfast') return await testSteadfast(connection);
    if (connection.courierId === 'pathao') return await testPathao(connection);

    const capabilities = courierCapabilities(connection);
    if (!capabilities.length) {
      return result(
        connection,
        false,
        'No tracking, history or booking endpoint is configured.',
        [],
      );
    }
    return result(
      connection,
      true,
      'Configuration is valid. The first real operation will verify the custom endpoint response.',
      capabilities,
    );
  } catch (error) {
    return result(
      connection,
      false,
      error instanceof Error ? error.message : 'Courier connection test failed.',
      [],
    );
  }
}

async function trackSteadfast(
  connection: ConnectedCourier,
  identifiers: string[],
  identifierType: 'invoice' | 'cid' | 'trackingcode',
): Promise<CourierTrackingResult[]> {
  const credentials = connection.credentials;
  const baseUrl = text(credentials.baseUrl) || 'https://portal.packzy.com/api/v1';
  const apiKey = text(credentials.apiKey);
  const apiSecret = text(credentials.apiSecret);
  if (!apiKey || !apiSecret) throw new Error('Steadfast credentials are incomplete');
  return Promise.all(
    identifiers.map(async (identifier) => {
      const response = await safeJsonRequest(
        endpoint(baseUrl, `/status_by_${identifierType}/${encodeURIComponent(identifier)}`),
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'secret-key': apiSecret,
          },
        },
      );
      const rawStatus =
        response.payload.delivery_status ??
        nestedValue(response.payload, 'data.delivery_status') ??
        response.payload.status;
      const found = response.status >= 200 && response.status < 300 && Boolean(text(rawStatus));
      return {
        tracking: identifier,
        status: found ? friendlyStatus(rawStatus) : 'Not found',
        courier: connection.displayName,
        lastUpdate: 'live',
        found,
      };
    }),
  );
}

async function trackCustom(
  connection: ConnectedCourier,
  identifiers: string[],
): Promise<CourierTrackingResult[]> {
  const credentials = connection.credentials;
  const endpointTemplate = text(credentials.endpoint);
  if (!endpointTemplate) throw new Error('Tracking endpoint is not configured');
  const method = text(credentials.method).toUpperCase() === 'GET' ? 'GET' : 'POST';
  const headers: Record<string, string> = {
    accept: 'application/json',
    ...parseHeaderJson(credentials.headers),
  };
  const apiKey = text(credentials.apiKey);
  if (apiKey) {
    const header = text(credentials.apiKeyHeader) || 'Authorization';
    headers[header] = `${text(credentials.apiKeyPrefix)}${apiKey}`;
  }
  const mapping =
    credentials.mapping && typeof credentials.mapping === 'object'
      ? (credentials.mapping as Record<string, unknown>)
      : {};
  return Promise.all(
    identifiers.map(async (identifier) => {
      const requestUrl =
        method === 'GET'
          ? applyTemplate(endpointTemplate, encodeURIComponent(identifier))
          : endpointTemplate;
      const bodyTemplate =
        text(credentials.bodyTemplate) ||
        JSON.stringify({ [text(credentials.idField) || 'id']: '{{id}}' });
      const response = await safeJsonRequest(requestUrl, {
        method,
        headers: {
          ...headers,
          ...(method === 'POST' ? { 'content-type': 'application/json' } : {}),
        },
        ...(method === 'POST'
          ? { body: applyTemplate(bodyTemplate, JSON.stringify(identifier).slice(1, -1)) }
          : {}),
      });
      const rawStatus = nestedValue(
        response.payload,
        text(mapping.statusPath) || 'status',
      );
      const found = response.status >= 200 && response.status < 300 && Boolean(text(rawStatus));
      return {
        tracking: identifier,
        status: found ? friendlyStatus(rawStatus) : 'Not found',
        courier: connection.displayName,
        lastUpdate: 'live',
        found,
      };
    }),
  );
}

export async function trackCourierOrders(
  connection: ConnectedCourier,
  identifiers: string[],
  identifierType: 'invoice' | 'cid' | 'trackingcode',
): Promise<CourierTrackingResult[]> {
  if (connection.courierId === 'steadfast') {
    return trackSteadfast(connection, identifiers, identifierType);
  }
  if (connection.connectionType === 'custom_order_status') {
    return trackCustom(connection, identifiers);
  }
  throw new Error(`${connection.displayName} does not have a configured tracking adapter`);
}

async function pathaoAccessToken(connection: ConnectedCourier): Promise<string> {
  const credentials = connection.credentials;
  const response = await safeJsonRequest(
    endpoint(text(credentials.baseUrl) || 'https://api-hermes.pathao.com', '/aladdin/api/v1/issue-token'),
    {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: text(credentials.clientId),
        client_secret: text(credentials.clientSecret),
        username: text(credentials.username),
        password: text(credentials.password),
        grant_type: 'password',
      }),
    },
  );
  const token = text(response.payload.access_token);
  if (response.status < 200 || response.status >= 300 || !token) {
    throw new Error('Pathao authentication failed');
  }
  return token;
}

export async function checkCourierHistory(
  connection: ConnectedCourier,
  phone: string,
): Promise<CourierHistoryResult> {
  const credentials = connection.credentials;
  let rawUrl = text(credentials.endpoint);
  let method = text(credentials.method).toUpperCase() === 'GET' ? 'GET' : 'POST';
  const headers: Record<string, string> = {
    accept: 'application/json',
    ...parseHeaderJson(credentials.headers),
  };
  let phoneField = text(credentials.phoneField) || 'phone';

  if (connection.connectionType === 'builtin') {
    const lookupPath = text(credentials.lookupPath);
    if (!lookupPath) {
      throw new Error(`${connection.displayName} has no licensed phone-history endpoint configured`);
    }
    rawUrl = endpoint(credentials.baseUrl, lookupPath);
    method = 'POST';
    if (connection.courierId === 'pathao') {
      headers.authorization = `Bearer ${await pathaoAccessToken(connection)}`;
    } else if (text(credentials.apiKey)) {
      headers.authorization = `Bearer ${text(credentials.apiKey)}`;
    }
    phoneField = 'phone';
  } else {
    const apiKey = text(credentials.apiKey);
    if (apiKey) {
      headers[text(credentials.apiKeyHeader) || 'Authorization'] =
        `${text(credentials.apiKeyPrefix)}${apiKey}`;
    }
  }
  if (!rawUrl) throw new Error('Phone-history endpoint is not configured');

  const requestUrl =
    method === 'GET'
      ? (() => {
          const url = new URL(rawUrl);
          url.searchParams.set(phoneField, phone);
          return url.toString();
        })()
      : rawUrl;
  const response = await safeJsonRequest(requestUrl, {
    method,
    headers: {
      ...headers,
      ...(method === 'POST' ? { 'content-type': 'application/json' } : {}),
    },
    ...(method === 'POST' ? { body: JSON.stringify({ [phoneField]: phone }) } : {}),
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`${connection.displayName} history returned HTTP ${response.status}`);
  }

  const mapping =
    credentials.mapping && typeof credentials.mapping === 'object'
      ? (credentials.mapping as Record<string, unknown>)
      : {};
  const root = nestedValue(response.payload, text(mapping.rootPath)) ?? response.payload;
  const delivered = finiteNumber(
    nestedValue(root, text(mapping.deliveredPath) || 'delivered'),
  );
  const failed = finiteNumber(
    nestedValue(root, text(mapping.failedPath) || 'cancelled'),
  );
  const mappedTotal = finiteNumber(
    nestedValue(root, text(mapping.totalPath) || 'total'),
  );
  const total = mappedTotal ?? (delivered ?? 0) + (failed ?? 0);
  let successRate = finiteNumber(
    nestedValue(root, text(mapping.successRatePath) || 'successRate'),
  );
  if (successRate != null && successRate <= 1) successRate *= 100;
  if (successRate == null && total > 0) successRate = ((delivered ?? 0) / total) * 100;
  if (delivered == null && successRate == null && mappedTotal == null) {
    throw new Error(`${connection.displayName} history response did not match its field mapping`);
  }
  return {
    courier: connection.displayName,
    delivered: Math.max(0, Math.round(delivered ?? 0)),
    failed: Math.max(0, Math.round(failed ?? Math.max(0, total - (delivered ?? 0)))),
    total: Math.max(0, Math.round(total)),
    successRate: successRate == null ? null : Math.max(0, Math.min(100, Math.round(successRate))),
  };
}

export async function createCourierBooking(
  connection: ConnectedCourier,
  booking: CourierBookingInput,
): Promise<CourierBookingResult> {
  const credentials = connection.credentials;
  const bookingConfig =
    credentials.booking && typeof credentials.booking === 'object'
      ? (credentials.booking as Record<string, unknown>)
      : {};
  let rawUrl = text(bookingConfig.endpoint);
  let method = text(bookingConfig.method).toUpperCase() || 'POST';
  const headers: Record<string, string> = {
    accept: 'application/json',
    ...parseHeaderJson(bookingConfig.headers),
  };
  let body: Record<string, unknown>;

  if (connection.courierId === 'steadfast') {
    rawUrl = rawUrl || endpoint(
      text(credentials.baseUrl) || 'https://portal.packzy.com/api/v1',
      '/create_order',
    );
    method = 'POST';
    headers['api-key'] = text(credentials.apiKey);
    headers['secret-key'] = text(credentials.apiSecret);
    body = {
      invoice: booking.invoice,
      recipient_name: booking.customerName,
      recipient_phone: booking.customerPhone,
      recipient_address: booking.deliveryAddress,
      cod_amount: booking.codAmount,
      note: booking.note || booking.itemDescription || '',
    };
  } else {
    if (!rawUrl) throw new Error(`${connection.displayName} booking endpoint is not configured`);
    const apiKey = text(bookingConfig.apiKey);
    if (apiKey) {
      headers[text(bookingConfig.apiKeyHeader) || 'Authorization'] =
        `${text(bookingConfig.apiKeyPrefix)}${apiKey}`;
    } else if (connection.courierId === 'pathao') {
      headers.authorization = `Bearer ${await pathaoAccessToken(connection)}`;
    }
    const template = text(bookingConfig.bodyTemplate);
    if (!template) throw new Error(`${connection.displayName} booking body template is required`);
    try {
      body = JSON.parse(bookingTemplate(template, booking));
    } catch {
      throw new Error(`${connection.displayName} booking body template is invalid JSON`);
    }
  }
  if (method !== 'POST' && method !== 'PUT') method = 'POST';
  const response = await safeJsonRequest(rawUrl, {
    method,
    headers: { ...headers, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`${connection.displayName} booking returned HTTP ${response.status}`);
  }
  const mapping =
    bookingConfig.mapping && typeof bookingConfig.mapping === 'object'
      ? (bookingConfig.mapping as Record<string, unknown>)
      : {};
  const externalId =
    nestedValue(response.payload, text(mapping.externalIdPath) || 'consignment.consignment_id') ??
    response.payload.consignment_id ??
    response.payload.id;
  const trackingCode =
    nestedValue(response.payload, text(mapping.trackingPath) || 'consignment.tracking_code') ??
    response.payload.tracking_code;
  const status =
    nestedValue(response.payload, text(mapping.statusPath) || 'status') ?? 'created';
  return {
    ok: true,
    booking: {
      id: text(externalId) || `${connection.courierId}:${booking.invoice}`,
      courierId: connection.courierId,
      invoice: booking.invoice,
      status: text(status) || 'created',
      externalId: text(externalId) || null,
      trackingCode: text(trackingCode) || null,
    },
  };
}
