import { createHmac } from 'node:crypto';
import { sql } from './db';

type OutboxRow = {
  id: number;
  payload: unknown;
  attempts: number;
};

let processing = false;

function safeWebhookUrl(): URL | null {
  const value = process.env.LEAD_WEBHOOK_URL?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') return null;
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    return url;
  } catch {
    return null;
  }
}

export async function processLeadOutbox(limit = 25) {
  if (!sql || processing) return { processed: 0, delivered: 0, failed: 0 };
  const endpoint = safeWebhookUrl();
  if (!endpoint) return { processed: 0, delivered: 0, failed: 0 };
  processing = true;
  try {
    const rows = (await sql`
      with due as (
        select id
        from lead_outbox
        where
          (status = 'pending' and next_attempt_at <= now())
          or (status = 'processing' and updated_at < now() - interval '10 minutes')
        order by created_at
        limit ${Math.max(1, Math.min(100, limit))}
        for update skip locked
      )
      update lead_outbox
      set status = 'processing', updated_at = now()
      where id in (select id from due)
      returning id, payload, attempts`) as OutboxRow[];
    let delivered = 0;
    let failed = 0;
    for (const row of rows) {
      const body = JSON.stringify(row.payload);
      const secret = process.env.LEAD_WEBHOOK_SECRET || '';
      const signature = secret
        ? createHmac('sha256', secret).update(body).digest('hex')
        : '';
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-contra-event': 'lead.created',
            'x-contra-delivery-id': String(row.id),
            ...(signature ? { 'x-contra-signature-sha256': signature } : {}),
          },
          body,
          cache: 'no-store',
          signal: AbortSignal.timeout(10_000),
        });
        if (!response.ok) throw new Error(`Webhook returned HTTP ${response.status}`);
        await sql`
          update lead_outbox
          set status = 'delivered', attempts = attempts + 1,
              delivered_at = now(), last_error = null, updated_at = now()
          where id = ${row.id}`;
        delivered += 1;
      } catch (error) {
        const nextAttempt = Math.min(86_400, 60 * 2 ** Math.min(row.attempts, 10));
        await sql`
          update lead_outbox
          set status = 'pending', attempts = attempts + 1,
              next_attempt_at = now() + (${nextAttempt} * interval '1 second'),
              last_error = ${String(error instanceof Error ? error.message : 'delivery failed').slice(0, 500)},
              updated_at = now()
          where id = ${row.id}`;
        failed += 1;
      }
    }
    return { processed: rows.length, delivered, failed };
  } finally {
    processing = false;
  }
}
