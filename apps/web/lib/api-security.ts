import { createHash } from 'node:crypto';
import { sql } from './db';

type RateBucket = { count: number; resetAt: number };

const buckets = new Map<string, RateBucket>();

function clientKey(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'local'
  );
}

export async function checkRateLimit(
  req: Request,
  name: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const now = Date.now();
  const resetAt = Math.floor(now / windowMs) * windowMs + windowMs;
  const key = createHash('sha256')
    .update(`${name}:${clientKey(req)}:${resetAt}`)
    .digest('hex');

  if (sql) {
    try {
      const rows = await sql`
        insert into api_rate_limits (bucket_key, request_count, expires_at)
        values (${key}, 1, ${new Date(resetAt).toISOString()}::timestamptz)
        on conflict (bucket_key)
        do update set request_count = api_rate_limits.request_count + 1
        returning request_count
      `;
      const count = Number(rows[0]?.request_count ?? 1);
      return {
        allowed: count <= limit,
        retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
      };
    } catch {
      // Schema may not be migrated yet; use the process-local safety net.
    }
  }

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;
  return {
    allowed: current.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export function requestWithinSize(req: Request, maxBytes: number): boolean {
  const length = Number(req.headers.get('content-length') ?? 0);
  return !Number.isFinite(length) || length <= 0 || length <= maxBytes;
}

export function cleanText(value: unknown, maxLength: number): string {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}
