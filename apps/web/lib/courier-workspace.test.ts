import { describe, expect, it } from 'vitest';
import { courierWorkspace } from './courier-workspace';

describe('courierWorkspace', () => {
  it('creates a signed HTTP-only workspace cookie and accepts it on the next request', () => {
    process.env.COURIER_WORKSPACE_SECRET = 'test-workspace-secret-that-is-at-least-32-characters';
    const first = courierWorkspace(new Request('http://localhost'));
    expect(first.workspaceId).toMatch(/^[0-9a-f-]{36}$/);
    expect(first.setCookie).toContain('HttpOnly');
    expect(first.setCookie).toContain('SameSite=Lax');

    const cookie = first.setCookie!.split(';')[0];
    const second = courierWorkspace(
      new Request('http://localhost', { headers: { cookie } }),
    );
    expect(second.workspaceId).toBe(first.workspaceId);
    expect(second.setCookie).toBeUndefined();
  });

  it('rejects a tampered workspace cookie', () => {
    process.env.COURIER_WORKSPACE_SECRET = 'test-workspace-secret-that-is-at-least-32-characters';
    const first = courierWorkspace(new Request('http://localhost'));
    const cookie = first.setCookie!.split(';')[0].replace(/.$/, 'x');
    const second = courierWorkspace(
      new Request('http://localhost', { headers: { cookie } }),
    );
    expect(second.workspaceId).not.toBe(first.workspaceId);
    expect(second.setCookie).toBeDefined();
  });
});
