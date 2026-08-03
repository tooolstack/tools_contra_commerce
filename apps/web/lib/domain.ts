// Subdomain URL helpers.
//
// NEXT_PUBLIC_TOOLS_DOMAIN holds the BASE domain (no subdomain, no protocol):
//   production:  contracommerce.com
//   local dev:   localhost:3000   (browsers resolve *.localhost → 127.0.0.1)
//
// Layout: the hub lives at  tools.<domain>  and every tool at  <slug>.<domain>.

const RAW = process.env.NEXT_PUBLIC_TOOLS_DOMAIN ?? 'localhost:3000';
const PROTO = RAW.includes('localhost') ? 'http' : 'https';
export const USE_PATH_ROUTING = process.env.NEXT_PUBLIC_TOOLS_PATH_ROUTING === 'true';

/** Base domain WITH port for URL building, e.g. "contracommerce.com" or "localhost:3000". */
export const TOOLS_DOMAIN = RAW;

/** Base hostname WITHOUT port, for Host-header comparison in middleware. */
export const BASE_HOST = RAW.split(':')[0];

/** Absolute URL of a tool on its own subdomain, e.g. https://profit-calculator.contracommerce.com */
export function getToolUrl(slug: string): string {
  if (USE_PATH_ROUTING) return `${PROTO}://${RAW}/${slug}`;
  return `${PROTO}://${slug}.${RAW}`;
}

/** Absolute URL of the hub, e.g. https://tools.contracommerce.com */
export function getHubUrl(): string {
  if (USE_PATH_ROUTING) return `${PROTO}://${RAW}`;
  return `${PROTO}://tools.${RAW}`;
}

/** Extract the subdomain label from a request Host header (port already tolerated). */
export function subdomainOf(host: string): string {
  const hostname = host.split(':')[0];
  if (hostname === BASE_HOST) return '';
  if (hostname.endsWith('.' + BASE_HOST)) {
    return hostname.slice(0, -(BASE_HOST.length + 1));
  }
  return '';
}
