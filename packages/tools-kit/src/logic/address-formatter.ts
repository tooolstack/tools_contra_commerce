/**
 * Bangladesh Address Formatter — pure logic.
 *
 * Parses a messy pasted address into structured fields (name, phone, district,
 * address) and flags what's missing. Heuristic and best-effort — meant to speed
 * up order entry, not to be perfect.
 */

export type AddressInput = { raw: string };

export type AddressResult = {
  name: string;
  phone: string;
  district: string;
  thana: string;
  area: string;
  landmark: string;
  address: string;
  warnings: string[];
};

// 64 districts of Bangladesh (lowercase, for matching).
export const BD_DISTRICTS = [
  'bagerhat', 'bandarban', 'barguna', 'barisal', 'bhola', 'bogura', 'bogra', 'brahmanbaria',
  'chandpur', 'chapainawabganj', 'chattogram', 'chittagong', 'chuadanga', 'comilla', 'cumilla',
  "cox's bazar", 'coxs bazar', 'dhaka', 'dinajpur', 'faridpur', 'feni', 'gaibandha', 'gazipur',
  'gopalganj', 'habiganj', 'jamalpur', 'jashore', 'jessore', 'jhalokati', 'jhenaidah', 'joypurhat',
  'khagrachhari', 'khulna', 'kishoreganj', 'kurigram', 'kushtia', 'lakshmipur', 'lalmonirhat',
  'madaripur', 'magura', 'manikganj', 'meherpur', 'moulvibazar', 'munshiganj', 'mymensingh',
  'naogaon', 'narail', 'narayanganj', 'narsingdi', 'natore', 'netrokona', 'nilphamari', 'noakhali',
  'pabna', 'panchagarh', 'patuakhali', 'pirojpur', 'rajbari', 'rajshahi', 'rangamati', 'rangpur',
  'satkhira', 'shariatpur', 'sherpur', 'sirajganj', 'sunamganj', 'sylhet', 'tangail', 'thakurgaon',
];

/** Extract a Bangladesh mobile number if present. */
function extractPhone(text: string): string {
  // 01XXXXXXXXX with optional +88 / 88 prefix, tolerant of spaces/dashes.
  const m = text.replace(/[\s-]/g, '').match(/(?:\+?88)?(01\d{9})/);
  return m ? m[1] : '';
}

function findDistrict(text: string): string {
  const lower = text.toLowerCase();
  // Prefer the longest match so "cox's bazar" wins over a shorter token.
  const hit = [...BD_DISTRICTS]
    .sort((a, b) => b.length - a.length)
    .find((d) => lower.includes(d));
  if (!hit) return '';
  return hit.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function parseAddress({ raw }: AddressInput): AddressResult {
  const text = (raw || '').trim();
  const phone = extractPhone(text);
  const district = findDistrict(text);

  // Name heuristic: the first line that has letters and isn't the phone/district.
  const lines = text
    .split(/[\n,]+/)
    .map((l) => l.trim())
    .filter(Boolean);
  let name = '';
  for (const line of lines) {
    const stripped = line.replace(/[\s-]/g, '');
    const isPhone = /(?:\+?88)?01\d{9}/.test(stripped);
    const isDistrictOnly = district && line.toLowerCase() === district.toLowerCase();
    if (!isPhone && !isDistrictOnly && /[A-Za-zঀ-৿]/.test(line) && line.length <= 40) {
      name = line;
      break;
    }
  }

  // Address = everything, minus a standalone name line and the phone token.
  let address = text.replace(/(?:\+?88)?01[\s-]?\d{4}[\s-]?\d{5}/g, '').trim();
  if (name) address = address.replace(name, '').trim();
  address = address.replace(/^[\s,;-]+|[\s,;-]+$/g, '').replace(/\s*,\s*,\s*/g, ', ');

  const cap = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

  // Thana / Upazila — explicit keyword mention.
  const thanaMatch =
    text.match(/(?:thana|upazila|ps)\s*[:\-]?\s*([A-Za-zঀ-৿]+)/i) ||
    text.match(/([A-Za-zঀ-৿]+)\s+(?:thana|upazila)\b/i);
  const thana = thanaMatch ? cap(thanaMatch[1].trim()) : '';

  // Area — the comma-segment just before the district (e.g. "…, Dhanmondi, Dhaka").
  let area = '';
  if (district) {
    const di = lines.findIndex((l) => l.toLowerCase() === district.toLowerCase());
    const prev = di > 0 ? lines[di - 1] : '';
    if (
      prev &&
      !/^(house|road|holding|block|sector|flat|plot|bldg|building|\d)/i.test(prev) &&
      prev.toLowerCase() !== name.toLowerCase()
    ) {
      area = prev;
    }
  }

  // Landmark — "near/beside/opposite/behind/সামনে/পাশে …" up to the next comma.
  const lm = text.match(
    /(?:near|beside|opposite|behind|in front of|পাশে|সামনে|কাছে|বিপরীতে)\s+([^,\n]+)/i,
  );
  const landmark = lm ? lm[0].trim() : '';

  const warnings: string[] = [];
  if (!phone) warnings.push('No phone number found');
  if (!district) warnings.push('District not recognised');
  if (!name) warnings.push('Could not detect a name');
  if (address.length < 8) warnings.push('Address looks too short');

  return { name, phone, district, thana, area, landmark, address, warnings };
}
