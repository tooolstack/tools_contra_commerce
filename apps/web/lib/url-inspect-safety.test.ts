import { describe, expect, it } from 'vitest';
import { consumeRateLimit, privateAddress, readTextLimited } from '../app/api/url-inspect/route';

describe('public URL inspection network guard', () => {
  it.each(['127.0.0.1','10.0.0.1','172.16.0.1','172.31.255.255','192.168.1.5','169.254.10.2','0.0.0.0','::1','fc00::1','fd12::1','fe80::1','::ffff:127.0.0.1'])('blocks private or reserved address %s', (address) => {
    expect(privateAddress(address)).toBe(true);
  });
  it.each(['1.1.1.1','8.8.8.8','93.184.216.34','2606:4700:4700::1111'])('allows public address %s', (address) => {
    expect(privateAddress(address)).toBe(false);
  });
});

describe('public URL inspection resource limits', () => {
  it('stops reading a response after the configured byte limit', async () => {
    const response=new Response('abcdefghijklmnopqrstuvwxyz');
    await expect(readTextLimited(response,10)).resolves.toEqual({text:'abcdefghij',bytes:10,truncated:true});
  });

  it('returns complete small responses without truncation', async () => {
    const response=new Response('small response');
    await expect(readTextLimited(response,100)).resolves.toEqual({text:'small response',bytes:14,truncated:false});
  });

  it('limits repeated requests within a rolling window', () => {
    const key=`test-${Math.random()}`;const now=1_000_000;
    for(let request=0;request<20;request++)expect(consumeRateLimit(key,now).allowed).toBe(true);
    expect(consumeRateLimit(key,now)).toMatchObject({allowed:false,remaining:0,retryAfter:60});
    expect(consumeRateLimit(key,now+60_001)).toMatchObject({allowed:true,remaining:19});
  });
});
