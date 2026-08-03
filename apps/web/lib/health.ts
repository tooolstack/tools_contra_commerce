import { sql } from './db';

export async function serviceHealth() {
  let database: 'up' | 'down' | 'not_configured' = sql ? 'down' : 'not_configured';
  if (sql) {
    try {
      await sql`select 1`;
      database = 'up';
    } catch {
      database = 'down';
    }
  }

  const credentialEncryption = Boolean(
    process.env.COURIER_CONNECTION_ENCRYPTION_KEY || process.env.PHONE_HASH_SECRET,
  );
  const workspaceSigning = Boolean(
    process.env.COURIER_WORKSPACE_SECRET || process.env.PHONE_HASH_SECRET,
  );
  const ready = database === 'up' && credentialEncryption && workspaceSigning;

  return {
    ok: true,
    status: ready ? ('ready' as const) : ('degraded' as const),
    service: 'contra-commerce-tools',
    checks: {
      database,
      credentialEncryption: credentialEncryption ? 'configured' : 'not_configured',
      workspaceSigning: workspaceSigning ? 'configured' : 'not_configured',
    },
    optional: {
      llm: Boolean(process.env.ANTHROPIC_API_KEY),
      pageSpeed: Boolean(process.env.PAGESPEED_API_KEY),
      leadWebhook: Boolean(process.env.LEAD_WEBHOOK_URL),
      liveRates: Boolean(process.env.COURIER_RATES_API_URL),
    },
    timestamp: new Date().toISOString(),
  };
}
