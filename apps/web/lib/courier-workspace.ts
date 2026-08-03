import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'contra_courier_workspace';
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function signingSecret(): string {
  const secret =
    process.env.COURIER_WORKSPACE_SECRET?.trim() ||
    process.env.PHONE_HASH_SECRET?.trim() ||
    (process.env.NODE_ENV === 'production' ? '' : 'contra-local-courier-workspace');
  if (!secret) throw new Error('Courier workspace signing is not configured');
  return secret;
}

function signature(workspaceId: string): string {
  return createHmac('sha256', signingSecret()).update(workspaceId).digest('base64url');
}

function parseCookies(req: Request): Map<string, string> {
  const cookies = new Map<string, string>();
  for (const part of (req.headers.get('cookie') || '').split(';')) {
    const separator = part.indexOf('=');
    if (separator < 1) continue;
    cookies.set(part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1)));
  }
  return cookies;
}

function validWorkspaceId(value: string): string | null {
  const [workspaceId, suppliedSignature] = value.split('.');
  if (!/^[0-9a-f-]{36}$/i.test(workspaceId || '') || !suppliedSignature) return null;
  const expected = signature(workspaceId);
  const supplied = Buffer.from(suppliedSignature);
  const wanted = Buffer.from(expected);
  if (supplied.length !== wanted.length || !timingSafeEqual(supplied, wanted)) return null;
  return workspaceId;
}

export function courierWorkspace(req: Request): {
  workspaceId: string;
  setCookie?: string;
} {
  const existing = parseCookies(req).get(COOKIE_NAME);
  const workspaceId = existing ? validWorkspaceId(existing) : null;
  if (workspaceId) return { workspaceId };

  const created = randomUUID();
  const value = encodeURIComponent(`${created}.${signature(created)}`);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return {
    workspaceId: created,
    setCookie:
      `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}${secure}`,
  };
}
