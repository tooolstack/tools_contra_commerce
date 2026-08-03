import { NextResponse, type NextRequest } from 'next/server';
import { TOOL_SLUGS } from './lib/tools';
import { getToolUrl, subdomainOf, USE_PATH_ROUTING } from './lib/domain';

// Host-based routing. One app, one deploy — each tool served on its own
// subdomain via an internal rewrite. Requires a wildcard DNS record
// (*.contracommerce.com) pointing at this deployment.
export function proxy(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const sub = subdomainOf(host);
  const { pathname } = req.nextUrl;
  const isTool = (s: string) => TOOL_SLUGS.includes(s);

  // <slug>.contracommerce.com  →  serve /<slug> at the subdomain root.
  if (isTool(sub)) {
    if (pathname === '/') {
      const url = req.nextUrl.clone();
      url.pathname = `/${sub}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Hub / apex / www: keep tool paths OFF this host so each tool has one
  // canonical URL (its subdomain). Redirect e.g. tools../profit-calculator
  // → https://profit-calculator...
  const firstSeg = pathname.split('/')[1] ?? '';
  if (isTool(firstSeg)) {
    if (USE_PATH_ROUTING) return NextResponse.next();
    return NextResponse.redirect(getToolUrl(firstSeg), 308);
  }

  return NextResponse.next();
}

// Skip static assets, API routes and files with an extension.
export const config = {
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
