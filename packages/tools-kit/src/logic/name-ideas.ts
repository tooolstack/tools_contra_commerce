/**
 * Business Name & Domain Checker — pure name-idea logic (client-side).
 * Generates brand-name ideas, slugs and slogans from a keyword. Domain
 * availability is checked separately via the /api/domain-check endpoint.
 */

const SUFFIXES = ['Shop', 'Mart', 'Hub', 'Bazar', 'Kart', 'Store', 'Zone', 'Point', 'Deals', 'BD'];
const PREFIXES = ['My', 'The', 'Go', 'Daily', 'Prime'];
const SLOGAN_TEMPLATES = [
  (k: string) => `${title(k)} — delivered to your door.`,
  (k: string) => `Your trusted ${k.toLowerCase()} store in Bangladesh.`,
  (k: string) => `Quality ${k.toLowerCase()}, honest prices.`,
  (k: string) => `Shop ${k.toLowerCase()}. Smile more.`,
];

function title(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export type ColorSwatch = { name: string; hex: string };

export type NameIdeasResult = {
  names: string[];
  slugs: string[];
  slogans: string[];
  fbUsernames: string[];
  colors: ColorSwatch[];
};

// A few ready brand palettes (primary / accent / dark). One is suggested per keyword.
const PALETTES: ColorSwatch[][] = [
  [
    { name: 'Primary', hex: '#1a73e8' },
    { name: 'Accent', hex: '#ff6d00' },
    { name: 'Dark', hex: '#0f172a' },
  ],
  [
    { name: 'Primary', hex: '#059669' },
    { name: 'Accent', hex: '#f59e0b' },
    { name: 'Dark', hex: '#1f2937' },
  ],
  [
    { name: 'Primary', hex: '#db2777' },
    { name: 'Accent', hex: '#7c3aed' },
    { name: 'Dark', hex: '#111827' },
  ],
  [
    { name: 'Primary', hex: '#e11d48' },
    { name: 'Accent', hex: '#0ea5e9' },
    { name: 'Dark', hex: '#18181b' },
  ],
];

export function generateNames(keyword: string): NameIdeasResult {
  const k = (keyword || '').trim();
  if (!k) return { names: [], slugs: [], slogans: [], fbUsernames: [], colors: [] };
  const base = title(k);

  const names = new Set<string>();
  for (const suf of SUFFIXES) names.add(`${base} ${suf}`);
  for (const pre of PREFIXES) names.add(`${pre} ${base}`);

  const list = [...names].slice(0, 10);
  const slugs = list.map((n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com');
  const slogans = SLOGAN_TEMPLATES.map((t) => t(k));

  // Facebook page usernames (@handles) — lowercase, no spaces, a couple of variants.
  const root = k.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const fbUsernames = [root, `${root}bd`, `${root}.shop`, `${root}official`, `the${root}`];

  // Suggest one palette, chosen deterministically from the keyword.
  const idx = root.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % PALETTES.length;

  return { names: list, slugs, slogans, fbUsernames, colors: PALETTES[idx] };
}
