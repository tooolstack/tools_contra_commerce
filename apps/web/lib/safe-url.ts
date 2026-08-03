import { lookup } from 'node:dns/promises';
import {
  isBlockedHostname,
  isPrivateNetworkAddress,
} from '../../../packages/tools-kit/src/logic/network-safety';

const MAX_REDIRECTS = 3;

export async function assertPublicHttpUrl(raw: string): Promise<URL> {
  const url = new URL(raw);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only HTTP and HTTPS URLs are supported');
  }
  if (url.username || url.password) throw new Error('URL credentials are not allowed');
  if (url.port && !['80', '443'].includes(url.port)) {
    throw new Error('Only standard web ports are allowed');
  }
  if (isBlockedHostname(url.hostname)) throw new Error('Private hostnames are not allowed');

  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateNetworkAddress(address))) {
    throw new Error('Private network addresses are not allowed');
  }
  return url;
}

export async function fetchPublicHtml(
  raw: string,
): Promise<{ reachable: boolean; html: string; httpsOk: boolean }> {
  try {
    let url = await assertPublicHttpUrl(raw);
    for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
      const response = await fetch(url, {
        redirect: 'manual',
        headers: { 'user-agent': 'ContraStoreHealthBot/1.0' },
        signal: AbortSignal.timeout(10000),
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location || redirect === MAX_REDIRECTS) {
          throw new Error('Too many redirects');
        }
        url = await assertPublicHttpUrl(new URL(location, url).toString());
        continue;
      }

      if (!response.ok) return { reachable: false, html: '', httpsOk: false };
      const declaredLength = Number(response.headers.get('content-length') ?? 0);
      if (declaredLength > 1_500_000) throw new Error('Page is too large');
      const html = (await response.text()).slice(0, 1_500_000);
      return {
        reachable: true,
        html,
        httpsOk: response.url.startsWith('https://') || url.protocol === 'https:',
      };
    }
  } catch {
    // The public checker intentionally returns a generic reachability failure so
    // internal network details are never disclosed to the caller.
  }
  return { reachable: false, html: '', httpsOk: false };
}
