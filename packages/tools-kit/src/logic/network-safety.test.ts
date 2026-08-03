import { describe, expect, it } from 'vitest';
import { isBlockedHostname, isPrivateNetworkAddress } from './network-safety';

describe('network safety', () => {
  it('blocks local and internal hostnames', () => {
    expect(isBlockedHostname('localhost')).toBe(true);
    expect(isBlockedHostname('api.internal')).toBe(true);
    expect(isBlockedHostname('shop.example')).toBe(true);
    expect(isBlockedHostname('contracommerce.com')).toBe(false);
  });

  it('blocks private, loopback and link-local IPv4 ranges', () => {
    for (const address of ['127.0.0.1', '10.0.0.4', '172.16.1.2', '192.168.1.3', '169.254.169.254']) {
      expect(isPrivateNetworkAddress(address)).toBe(true);
    }
    expect(isPrivateNetworkAddress('1.1.1.1')).toBe(false);
    expect(isPrivateNetworkAddress('8.8.8.8')).toBe(false);
  });

  it('blocks private and loopback IPv6 addresses', () => {
    expect(isPrivateNetworkAddress('::1')).toBe(true);
    expect(isPrivateNetworkAddress('fd00::1')).toBe(true);
    expect(isPrivateNetworkAddress('fe80::1')).toBe(true);
    expect(isPrivateNetworkAddress('2606:4700:4700::1111')).toBe(false);
  });
});
