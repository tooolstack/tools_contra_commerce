import { describe, expect, it } from 'vitest';
import { testCourierConnection } from './courier-adapters';

const connection = {
  courierId: 'custom',
  displayName: 'Custom Courier',
  connectionType: 'custom_order_status' as const,
  enabled: true,
  syncEnabled: true,
  credentialsConfigured: true,
};

describe('testCourierConnection', () => {
  it('reports configured custom tracking capability without sending a mutating request', async () => {
    const result = await testCourierConnection({
      ...connection,
      credentials: {
        endpoint: 'https://courier.example/orders/{{id}}',
        method: 'GET',
      },
    });
    expect(result.ok).toBe(true);
    expect(result.capabilities).toContain('tracking');
  });

  it('does not mark an empty custom connection as working', async () => {
    const result = await testCourierConnection({ ...connection, credentials: {} });
    expect(result.ok).toBe(false);
    expect(result.capabilities).toEqual([]);
  });

  it('requires all Pathao merchant credentials for a live authentication test', async () => {
    const result = await testCourierConnection({
      ...connection,
      courierId: 'pathao',
      displayName: 'Pathao',
      connectionType: 'builtin',
      credentials: { clientId: 'id', clientSecret: 'secret' },
    });
    expect(result.ok).toBe(false);
    expect(result.message).toContain('username and password');
  });
});
