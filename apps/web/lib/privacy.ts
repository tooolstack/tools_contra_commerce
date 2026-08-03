import { createHash } from 'node:crypto';

export function privacySafeIdentifier(
  value: string,
  scope: 'phone' | 'ip',
): string | null {
  const pepper = process.env.PHONE_HASH_SECRET?.trim();
  if (!pepper) return null;
  return `sha256:${createHash('sha256')
    .update(`${pepper}:${scope}:${value}`)
    .digest('hex')}`;
}

/**
 * Returns a one-way identifier for analytics storage. If no dedicated pepper
 * is configured, no phone identifier is persisted.
 */
export function phoneStorageHash(phone: string): string | null {
  return privacySafeIdentifier(phone, 'phone');
}
