'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';

type Connection = {
  courierId: string;
  displayName: string;
  connectionType: CourierDefinition['type'];
  enabled: boolean;
  syncEnabled: boolean;
  credentialsConfigured: boolean;
};

type CourierDefinition = {
  id: string;
  name: string;
  type: 'builtin' | 'custom_history' | 'custom_order_status';
  description: string;
  dynamic?: boolean;
  fields: Array<{
    key: string;
    label: string;
    placeholder: string;
    secret?: boolean;
    required?: boolean;
  }>;
};

const ORDER_STATUS_FIELDS: CourierDefinition['fields'] = [
  {
    key: 'endpoint',
    label: 'Order-status endpoint',
    placeholder: 'https://courier.example/orders/{{id}}',
    required: true,
  },
  { key: 'method', label: 'HTTP method', placeholder: 'GET' },
  { key: 'idField', label: 'Order ID field', placeholder: 'id' },
  {
    key: 'headers',
    label: 'Additional headers (JSON)',
    placeholder: '{"API-KEY":"…","API-SECRET":"…","USER-ID":"…"}',
    secret: true,
  },
  { key: 'apiKeyHeader', label: 'Single API-key header', placeholder: 'Authorization' },
  { key: 'apiKeyPrefix', label: 'API-key prefix', placeholder: 'Bearer ' },
  { key: 'apiKey', label: 'Single API key', placeholder: 'Optional when headers JSON is used', secret: true },
  {
    key: 'bodyTemplate',
    label: 'POST body template (JSON)',
    placeholder: '{"tracking_id":"{{id}}"}',
  },
  { key: 'statusPath', label: 'Response status path', placeholder: 'data.status' },
  { key: 'reasonPath', label: 'Response reason path', placeholder: 'data.reason' },
];

const BOOKING_FIELDS: CourierDefinition['fields'] = [
  {
    key: 'bookingEndpoint',
    label: 'Create-booking endpoint',
    placeholder: 'https://courier.example/orders',
  },
  { key: 'bookingMethod', label: 'Booking HTTP method', placeholder: 'POST' },
  {
    key: 'bookingHeaders',
    label: 'Booking headers (JSON)',
    placeholder: '{"Authorization":"Bearer …"}',
    secret: true,
  },
  { key: 'bookingApiKeyHeader', label: 'Booking API-key header', placeholder: 'Authorization' },
  { key: 'bookingApiKeyPrefix', label: 'Booking API-key prefix', placeholder: 'Bearer ' },
  {
    key: 'bookingApiKey',
    label: 'Booking API key / token',
    placeholder: 'Optional when booking headers JSON is used',
    secret: true,
  },
  {
    key: 'bookingBodyTemplate',
    label: 'Booking body template (JSON)',
    placeholder:
      '{"invoice":"{{invoice}}","recipient_phone":"{{customerPhone}}","cod_amount":{{codAmount}}}',
  },
  {
    key: 'bookingExternalIdPath',
    label: 'Booking response ID path',
    placeholder: 'data.consignment_id',
  },
  {
    key: 'bookingTrackingPath',
    label: 'Booking tracking-code path',
    placeholder: 'data.tracking_code',
  },
  {
    key: 'bookingStatusPath',
    label: 'Booking response status path',
    placeholder: 'status',
  },
];

const HISTORY_FIELDS: CourierDefinition['fields'] = [
  {
    key: 'endpoint',
    label: 'Phone-history endpoint',
    placeholder: 'https://courier.example/history',
    required: true,
  },
  { key: 'method', label: 'HTTP method', placeholder: 'POST' },
  { key: 'phoneField', label: 'Phone field', placeholder: 'phone' },
  {
    key: 'headers',
    label: 'Additional headers (JSON)',
    placeholder: '{"X-API-Key":"…"}',
    secret: true,
  },
  { key: 'apiKeyHeader', label: 'Single API-key header', placeholder: 'Authorization' },
  { key: 'apiKeyPrefix', label: 'API-key prefix', placeholder: 'Bearer ' },
  { key: 'apiKey', label: 'Single API key', placeholder: 'Optional when headers JSON is used', secret: true },
  { key: 'rootPath', label: 'Response root path', placeholder: 'data.summary' },
  { key: 'deliveredPath', label: 'Delivered field', placeholder: 'delivered' },
  { key: 'failedPath', label: 'Failed field', placeholder: 'cancelled' },
  { key: 'totalPath', label: 'Total field', placeholder: 'total' },
  { key: 'successRatePath', label: 'Success-rate field', placeholder: 'successRate' },
];

const GENERIC_COURIERS: Array<[string, string]> = [
  ['ecourier', 'eCourier'],
  ['redx', 'REDX'],
  ['paperfly', 'Paperfly'],
  ['delivery-tiger', 'Delivery Tiger'],
  ['sundarban', 'Sundarban Courier'],
  ['sa-paribahan', 'S.A. Paribahan'],
  ['janani', 'Janani Express'],
  ['ajr', 'AJR Courier'],
  ['karatoa', 'Karatoa Courier'],
  ['usb-express', 'USB Express'],
];

const COURIERS: CourierDefinition[] = [
  {
    id: 'steadfast',
    name: 'Steadfast',
    type: 'builtin',
    description: 'Track your Steadfast consignments and ingest verified delivery outcomes.',
    fields: [
      { key: 'baseUrl', label: 'API base URL', placeholder: 'https://portal.packzy.com/api/v1' },
      { key: 'apiKey', label: 'API key', placeholder: 'Steadfast API key', secret: true, required: true },
      { key: 'apiSecret', label: 'API secret', placeholder: 'Steadfast secret', secret: true, required: true },
    ],
  },
  {
    id: 'pathao',
    name: 'Pathao Courier',
    type: 'builtin',
    description: 'Connect a Pathao merchant account using its OAuth credentials.',
    fields: [
      { key: 'baseUrl', label: 'API base URL', placeholder: 'https://api-hermes.pathao.com' },
      { key: 'clientId', label: 'Client ID', placeholder: 'Pathao client ID', secret: true, required: true },
      { key: 'clientSecret', label: 'Client secret', placeholder: 'Pathao client secret', secret: true, required: true },
      { key: 'username', label: 'Username', placeholder: 'Merchant username', required: true },
      { key: 'password', label: 'Password', placeholder: 'Merchant password', secret: true, required: true },
      { key: 'lookupPath', label: 'Phone-history path (if licensed)', placeholder: '/aladdin/api/v1/customer/history' },
      { key: 'ordersPath', label: 'History rows path', placeholder: 'data.orders' },
      { key: 'historyExternalIdPath', label: 'History order ID path', placeholder: 'consignment_id' },
      { key: 'historyStatusPath', label: 'History status path', placeholder: 'order_status' },
      { key: 'historyReasonPath', label: 'History reason path', placeholder: 'reason' },
      { key: 'historyOccurredAtPath', label: 'History timestamp path', placeholder: 'updated_at' },
      ...BOOKING_FIELDS,
    ],
  },
  {
    id: 'carrybee',
    name: 'Carrybee',
    type: 'builtin',
    description: 'Connect Carrybee when your merchant account has API access.',
    fields: [
      { key: 'baseUrl', label: 'API base URL', placeholder: 'https://courier-api.example', required: true },
      { key: 'apiKey', label: 'API key', placeholder: 'Carrybee API key', secret: true, required: true },
      { key: 'lookupPath', label: 'Phone-history path (if licensed)', placeholder: '/api/v1/customer/history' },
      { key: 'ordersPath', label: 'History rows path', placeholder: 'data.orders' },
      { key: 'historyExternalIdPath', label: 'History order ID path', placeholder: 'tracking_id' },
      { key: 'historyStatusPath', label: 'History status path', placeholder: 'status' },
      { key: 'historyReasonPath', label: 'History reason path', placeholder: 'reason' },
      { key: 'historyOccurredAtPath', label: 'History timestamp path', placeholder: 'updated_at' },
      ...BOOKING_FIELDS,
    ],
  },
  {
    id: 'custom-history-api',
    name: 'Add another phone-history API',
    type: 'custom_history',
    dynamic: true,
    description: 'Add any licensed provider that returns delivery summaries by phone.',
    fields: [
      { key: 'courierId', label: 'Unique courier ID', placeholder: 'my-courier', required: true },
      { key: 'displayName', label: 'Courier name', placeholder: 'My Courier', required: true },
      ...HISTORY_FIELDS,
    ],
  },
  {
    id: 'custom-status-api',
    name: 'Add another order-status API',
    type: 'custom_order_status',
    dynamic: true,
    description: 'Add another courier with a merchant order/tracking status endpoint.',
    fields: [
      { key: 'courierId', label: 'Unique courier ID', placeholder: 'my-courier', required: true },
      { key: 'displayName', label: 'Courier name', placeholder: 'My Courier', required: true },
      ...ORDER_STATUS_FIELDS,
      ...BOOKING_FIELDS,
    ],
  },
  ...GENERIC_COURIERS.map(([id, name]) => ({
    id,
    name,
    type: 'custom_order_status' as const,
    description:
      'Connect the merchant API if this courier has issued your account an endpoint and credentials.',
    fields: [...ORDER_STATUS_FIELDS, ...BOOKING_FIELDS],
  })),
];

function connectionErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : String(error || '');
  if (code === 'connection_service_unavailable') {
    return 'Courier integrations are temporarily unavailable. Please try again shortly.';
  }
  if (code === 'rate_limited') {
    return 'Too many requests. Please wait a few minutes and try again.';
  }
  if (code === 'required_credentials_missing') {
    return 'Enter all required courier credentials and try again.';
  }
  return code || 'Could not connect to the courier service.';
}

export function CourierSettings() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [saving, setSaving] = useState('');
  const [testing, setTesting] = useState('');
  const [deleting, setDeleting] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [openCards, setOpenCards] = useState(
    () =>
      new Set([
        'steadfast',
        'pathao',
        'carrybee',
        'ecourier',
        'custom-history-api',
        'custom-status-api',
      ]),
  );

  const configured = useMemo(
    () => new Map(connections.map((connection) => [connection.courierId, connection])),
    [connections],
  );

  const refreshConnections = async () => {
    try {
      const response = await fetch('/api/courier-connections', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not load connections');
      setConnections(payload.connections || []);
    } catch (cause) {
      setError(connectionErrorMessage(cause));
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/courier-connections', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Could not load connections');
        return payload;
      })
      .then((payload) => {
        if (!cancelled) setConnections(payload.connections || []);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(connectionErrorMessage(cause));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (courierId: string, key: string, value: string) => {
    setValues((current) => ({
      ...current,
      [courierId]: { ...(current[courierId] || {}), [key]: value },
    }));
  };

  const save = async (event: FormEvent, courier: CourierDefinition) => {
    event.preventDefault();
    setSaving(courier.id);
    setMessage('');
    setError('');
    try {
      const formValues = values[courier.id] || {};
      const targetId = courier.dynamic
        ? String(formValues.courierId || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : courier.id;
      const targetName = courier.dynamic
        ? String(formValues.displayName || '').trim()
        : courier.name;
      if (!targetId || !targetName) {
        throw new Error('Enter a unique courier ID and courier name.');
      }
      const credentials = Object.fromEntries(
        Object.entries(formValues).filter(
          ([key]) => key !== 'courierId' && key !== 'displayName',
        ),
      );
      const response = await fetch('/api/courier-connections', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          courierId: targetId,
          displayName: targetName,
          connectionType: courier.type,
          enabled: true,
          syncEnabled: courier.type !== 'custom_history',
          credentials,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save connection');
      setValues((current) => ({ ...current, [courier.id]: {} }));
      setMessage(
        `${targetName} credentials saved securely. Run the connection test to verify them.`,
      );
      await refreshConnections();
    } catch (cause) {
      setError(connectionErrorMessage(cause));
    } finally {
      setSaving('');
    }
  };

  const testConnection = async (courierId: string, displayName: string) => {
    setTesting(courierId);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/courier-connections/test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ courierId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || payload.error || 'Connection test failed');
      setMessage(`${displayName}: ${payload.message}`);
    } catch (cause) {
      setError(connectionErrorMessage(cause));
    } finally {
      setTesting('');
    }
  };

  const removeConnection = async (courierId: string, displayName: string) => {
    if (!window.confirm(`Remove the saved ${displayName} credentials?`)) return;
    setDeleting(courierId);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/courier-connections', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ courierId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not remove connection');
      setMessage(`${displayName} credentials removed.`);
      await refreshConnections();
    } catch (cause) {
      setError(connectionErrorMessage(cause));
    } finally {
      setDeleting('');
    }
  };

  return (
    <div>
      <div className="mb-5 rounded-xl border border-info/20 bg-info/10 p-4 text-sm text-info">
        Credentials are sent only to the server and encrypted before storage. Existing secrets are
        never returned to this page.
      </div>
      {message && (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {loading ? (
        <p className="py-12 text-center text-sm text-gray-500">Loading courier connections…</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {COURIERS.map((courier) => {
            const existing = configured.get(courier.id);
            return (
              <form
                key={courier.id}
                onSubmit={(event) => save(event, courier)}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <details
                  open={openCards.has(courier.id)}
                  onToggle={(event) => {
                    const isOpen = event.currentTarget.open;
                    setOpenCards((current) => {
                      if (current.has(courier.id) === isOpen) return current;
                      const next = new Set(current);
                      if (isOpen) next.add(courier.id);
                      else next.delete(courier.id);
                      return next;
                    });
                  }}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-5">
                    <div>
                      <h2 className="font-semibold text-gray-950">{courier.name}</h2>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500">
                        {courier.description}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${
                        existing?.credentialsConfigured
                          ? 'bg-emerald-100 text-emerald-800'
                          : courier.dynamic
                            ? 'bg-info/10 text-info'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {existing?.credentialsConfigured
                        ? 'Saved'
                        : courier.dynamic
                          ? 'Add unlimited'
                          : 'Not connected'}
                    </span>
                  </summary>
                  <div className="border-t border-gray-100 p-5">
                    {existing?.credentialsConfigured && (
                      <p className="mb-3 text-xs text-amber-700">
                        Re-enter all required credentials when updating; stored secrets are never
                        displayed.
                      </p>
                    )}
                    <div className="space-y-3">
                      {courier.fields.map((field) => (
                        <label key={field.key} className="block">
                          <span className="text-xs font-medium text-gray-700">{field.label}</span>
                          <input
                            type={field.secret ? 'password' : 'text'}
                            value={values[courier.id]?.[field.key] || ''}
                            onChange={(event) => update(courier.id, field.key, event.target.value)}
                            placeholder={field.placeholder}
                            autoComplete="off"
                            required={field.required}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </label>
                      ))}
                    </div>
                    <button
                      type="submit"
                      disabled={saving === courier.id}
                      className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      {saving === courier.id
                        ? 'Encrypting & saving…'
                        : existing?.credentialsConfigured
                          ? 'Update credentials'
                          : courier.dynamic
                            ? 'Add courier API'
                            : 'Save courier credentials'}
                    </button>
                    {existing?.credentialsConfigured && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={testing === existing.courierId}
                          onClick={() =>
                            void testConnection(existing.courierId, existing.displayName)
                          }
                          className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                        >
                          {testing === existing.courierId ? 'Testing…' : 'Test connection'}
                        </button>
                        <button
                          type="button"
                          disabled={deleting === existing.courierId}
                          onClick={() =>
                            void removeConnection(existing.courierId, existing.displayName)
                          }
                          className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deleting === existing.courierId ? 'Removing…' : 'Remove'}
                        </button>
                      </div>
                    )}
                  </div>
                </details>
              </form>
            );
          })}
        </div>
      )}
    </div>
  );
}
