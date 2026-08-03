import { neon } from '@neondatabase/serverless';
import { privacySafeIdentifier } from './privacy';

// Neon serverless SQL client. Null when DATABASE_URL isn't set, so the tools
// keep working (the DB is a bonus, never a hard dependency).
const url = process.env.DATABASE_URL;
export const sql = url ? neon(url) : null;

function clientIp(req?: Request): string | null {
  if (!req) return null;
  const value =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim();
  return value ? privacySafeIdentifier(value, 'ip') : null;
}

/** Log a deliberate tool action. Fire-and-forget — never throws to the caller. */
export async function logEvent(
  tool: string,
  payload: unknown,
  opts: { demo?: boolean; req?: Request } = {},
): Promise<void> {
  if (!sql) return;
  try {
    await sql`
      insert into tool_events (tool, payload, demo, ip, user_agent)
      values (
        ${tool},
        ${JSON.stringify(payload ?? null)}::jsonb,
        ${opts.demo ?? null},
        ${clientIp(opts.req)},
        ${opts.req?.headers.get('user-agent') ?? null}
      )`;
  } catch {
    /* storage is best-effort */
  }
}

/** Save a captured lead (contact info from the funnel). */
export async function saveLead(lead: {
  tool?: string;
  name?: string;
  phone?: string;
  email?: string;
  meta?: unknown;
}): Promise<{ saved: boolean; queued: boolean }> {
  if (!sql) return { saved: false, queued: false };
  try {
    const rows = await sql`
      insert into leads (tool, name, phone, email, meta)
      values (${lead.tool ?? null}, ${lead.name ?? null}, ${lead.phone ?? null},
              ${lead.email ?? null}, ${JSON.stringify(lead.meta ?? null)}::jsonb)
       returning id`;
    const leadId = Number(rows[0]?.id);
    const webhookConfigured = Boolean(process.env.LEAD_WEBHOOK_URL?.trim());
    if (webhookConfigured && Number.isFinite(leadId)) {
      await sql`
        insert into lead_outbox (lead_id, payload)
        values (
          ${leadId},
          ${JSON.stringify({ id: leadId, ...lead })}::jsonb
        )
        on conflict (lead_id) do nothing`;
      void import('./lead-outbox').then(({ processLeadOutbox }) => processLeadOutbox(1));
    }
    return { saved: true, queued: webhookConfigured };
  } catch {
    return { saved: false, queued: false };
  }
}

/** Save a demand-survey vote. */
export async function saveVote(vote: {
  surveyHash: string;
  question?: string;
  choice: string;
  req?: Request;
}): Promise<void> {
  if (!sql) return;
  try {
    await sql`
      insert into survey_votes (survey_hash, question, choice, ip)
      values (${vote.surveyHash}, ${vote.question ?? null}, ${vote.choice}, ${clientIp(vote.req)})`;
  } catch {
    /* best-effort */
  }
}

/** Save a fraud/risk check — grows the shared fraud dataset over time. */
export async function saveFraudCheck(check: {
  phone: string;
  riskLevel?: string;
  successRate?: number;
  source?: string;
}): Promise<void> {
  if (!sql) return;
  try {
    await sql`
      insert into fraud_checks (phone, risk_level, success_rate, source)
      values (${check.phone}, ${check.riskLevel ?? null}, ${check.successRate ?? null}, ${check.source ?? null})`;
  } catch {
    /* best-effort */
  }
}
