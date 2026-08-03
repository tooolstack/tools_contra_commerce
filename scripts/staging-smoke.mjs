import { readFile } from 'node:fs/promises';

const origin = String(process.env.STAGING_ORIGIN || 'http://tools.localhost:3000').replace(/\/+$/, '');
const cookie = String(process.env.STAGING_COOKIE || '').trim();
const timeoutMs = 12_000;
const results = [];

async function request(label, url, options = {}, expected = [200]) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(cookie ? { cookie } : {}),
        ...(options.headers || {}),
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });
    const ok = expected.includes(response.status);
    results.push({ label, ok, status: response.status });
    return { response, payload: await response.json().catch(() => null) };
  } catch (error) {
    results.push({ label, ok: false, error: error instanceof Error ? error.message : 'request failed' });
    return { response: null, payload: null };
  }
}

await request('liveness', `${origin}/api/health`);
const ready = await request('readiness', `${origin}/api/ready`);
if (ready.payload?.ok !== true) {
  results.push({ label: 'readiness payload', ok: false, error: 'Expected ok=true' });
}
await request('sitemap', `${origin}/sitemap.xml`);
await request('robots', `${origin}/robots.txt`);
await request('booking session bridge', `${origin}/api/courier-booking-status`);

const toolsSource = await readFile(new URL('../apps/web/lib/tools.ts', import.meta.url), 'utf8');
const readyToolCount = (toolsSource.match(/ready:\s*true/g) || []).length;
if (readyToolCount !== 22) {
  results.push({ label: 'tool registry', ok: false, error: `Expected 22 ready tools, found ${readyToolCount}` });
} else {
  results.push({ label: 'tool registry', ok: true, count: readyToolCount });
}

const invalidFraud = await request(
  'fraud validation',
  `${origin}/api/fraud-check`,
  {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: 'invalid', consent: true }),
  },
  [400],
);
if (invalidFraud.payload?.error !== 'invalid_phone') {
  results.push({ label: 'fraud validation payload', ok: false, error: 'Expected invalid_phone' });
}

if (process.env.REQUIRE_LIVE_HISTORY === 'true') {
  const history = await request(
    'live courier history',
    `${origin}/api/fraud-check`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        phone: process.env.SANDBOX_HISTORY_PHONE,
        consent: true,
        refresh: true,
      }),
    },
  );
  if (history.payload?.dataMode !== 'live') {
    results.push({ label: 'live history mode', ok: false, error: 'Courier response was not live' });
  }
}

if (process.env.SMOKE_COURIER_BOOKING === 'true') {
  if (process.env.CONFIRM_SANDBOX_COURIER !== 'true') {
    results.push({
      label: 'sandbox booking safety',
      ok: false,
      error: 'Set CONFIRM_SANDBOX_COURIER=true only for a non-billable sandbox account',
    });
  } else {
    const invoice = `SMOKE-${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}`;
    await request(
      'sandbox courier booking',
      `${origin}/api/courier-book`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'idempotency-key': `sandbox-${invoice}`,
        },
        body: JSON.stringify({
          courierId: process.env.SANDBOX_COURIER_ID,
          invoice,
          customerName: process.env.SANDBOX_CUSTOMER_NAME,
          customerPhone: process.env.SANDBOX_CUSTOMER_PHONE,
          deliveryAddress: process.env.SANDBOX_DELIVERY_ADDRESS,
          codAmount: Number(process.env.SANDBOX_COD_AMOUNT || 0),
          weightKg: Number(process.env.SANDBOX_WEIGHT_KG || 0.5),
          itemDescription: 'Automated non-billable staging smoke test',
          itemQuantity: 1,
        }),
      },
      [200, 201],
    );
  }
}

for (const result of results) {
  console.log(`${result.ok ? '✓' : '✗'} ${result.label}${result.status ? ` (${result.status})` : ''}${result.error ? ` — ${result.error}` : ''}`);
}
const failed = results.filter((result) => !result.ok);
console.log(`\n${results.length - failed.length}/${results.length} staging checks passed.`);
if (failed.length) process.exitCode = 1;
