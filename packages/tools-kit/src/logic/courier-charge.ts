/**
 * Courier Charge Comparison — framework-independent calculation logic.
 *
 * The built-in table is a transparent published-rate fallback. A host app can
 * replace these quotes with live or merchant-contract rates via its own API.
 */

export type CourierZone = 'inside-city' | 'sub-city' | 'outside-city';
export type CourierRateStatus = 'published' | 'indicative';

export type CourierChargeInput = {
  zone: CourierZone;
  /** Parcel weight in kg. Values below 0.1 are normalised to 0.1. */
  weightKg: number;
  /** COD amount to collect (৳). Negative values are normalised to zero. */
  codAmount: number;
};

export type CourierLocationInput = {
  pickupDistrict: string;
  destinationDistrict: string;
  destinationArea?: string;
};

type WeightTier = { maxKg: number; charge: number };

export type CourierRate = {
  courier: string;
  weightTiers: Record<CourierZone, WeightTier[]>;
  perExtraKg: Record<CourierZone, number>;
  codPct: Record<CourierZone, number>;
  returnRule:
    | { type: 'none' }
    | { type: 'percentage-of-delivery'; percentage: Record<CourierZone, number> }
    | { type: 'fixed'; charge: Record<CourierZone, number> };
  days: Record<CourierZone, string>;
  sourceLabel: string;
  sourceUrl: string;
  sourceStatus: CourierRateStatus;
  asOf: string;
  note?: string;
};

export type CourierQuote = {
  courier: string;
  deliveryCharge: number;
  codCharge: number;
  /** Additional charge applied only when the parcel is returned. */
  returnCharge: number;
  /** Cost when delivered: delivery + COD. Kept as `total` for compatibility. */
  total: number;
  deliveredTotal: number;
  /** Cost when returned: forward delivery attempt + additional return charge. */
  returnTotal: number;
  estDays: string;
  sourceLabel: string;
  sourceUrl: string;
  sourceStatus: CourierRateStatus;
  asOf: string;
  note?: string;
};

export type CourierChargeResult = {
  quotes: CourierQuote[];
  cheapest: string;
  zone: CourierZone;
  weightKg: number;
  codAmount: number;
};

const money = (n: number) => Math.round(n * 100) / 100;
const RATE_REVIEW_DATE = '2026-07-26';

export const DISTRICT_OPTIONS = [
  'Bagerhat',
  'Bandarban',
  'Barguna',
  'Barishal',
  'Bhola',
  'Bogura',
  'Brahmanbaria',
  'Chandpur',
  'Chapainawabganj',
  'Chattogram',
  'Chuadanga',
  "Cox's Bazar",
  'Cumilla',
  'Dhaka',
  'Dinajpur',
  'Faridpur',
  'Feni',
  'Gaibandha',
  'Gazipur',
  'Gopalganj',
  'Habiganj',
  'Jamalpur',
  'Jashore',
  'Jhalokati',
  'Jhenaidah',
  'Joypurhat',
  'Khagrachhari',
  'Khulna',
  'Kishoreganj',
  'Kurigram',
  'Kushtia',
  'Lakshmipur',
  'Lalmonirhat',
  'Madaripur',
  'Magura',
  'Manikganj',
  'Meherpur',
  'Moulvibazar',
  'Munshiganj',
  'Mymensingh',
  'Naogaon',
  'Narail',
  'Narayanganj',
  'Narsingdi',
  'Natore',
  'Netrokona',
  'Nilphamari',
  'Noakhali',
  'Pabna',
  'Panchagarh',
  'Patuakhali',
  'Pirojpur',
  'Rajbari',
  'Rajshahi',
  'Rangamati',
  'Rangpur',
  'Satkhira',
  'Shariatpur',
  'Sherpur',
  'Sirajganj',
  'Sunamganj',
  'Sylhet',
  'Tangail',
  'Thakurgaon',
].map((district) => ({ value: district, label: district }));

const DHAKA_SUBURB_TERMS = [
  'ashulia',
  'dhamrai',
  'dohar',
  'hemayetpur',
  'keraniganj',
  'nawabganj',
  'savar',
  'tongi',
];

const normaliseLocation = (value: string) =>
  (value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9ঀ-৿]+/g, ' ');

/**
 * Maps pickup and customer location to the three public courier rate zones.
 * Nearby Dhaka service areas are treated as sub-city; a different district is
 * otherwise an outside-city shipment.
 */
export function detectCourierZone({
  pickupDistrict,
  destinationDistrict,
  destinationArea = '',
}: CourierLocationInput): CourierZone {
  const pickup = normaliseLocation(pickupDistrict);
  const destination = normaliseLocation(destinationDistrict);
  const area = normaliseLocation(destinationArea);

  if (!pickup || !destination) return 'outside-city';

  const isDhakaSuburb =
    pickup === 'dhaka' &&
    (destination === 'gazipur' ||
      destination === 'narayanganj' ||
      DHAKA_SUBURB_TERMS.some((term) => area.includes(term)));

  if (isDhakaSuburb) return 'sub-city';
  return pickup === destination ? 'inside-city' : 'outside-city';
}

const singleTier = (
  inside: number,
  subCity: number,
  outside: number,
): Record<CourierZone, WeightTier[]> => ({
  'inside-city': [{ maxKg: 1, charge: inside }],
  'sub-city': [{ maxKg: 1, charge: subCity }],
  'outside-city': [{ maxKg: 1, charge: outside }],
});

/**
 * Public fallback rates in BDT.
 *
 * `published` means the public page states the relevant rate structure.
 * `indicative` means the provider does not expose a complete public rate card;
 * that row must not be presented as a live or merchant-contract quote.
 */
export const COURIER_RATES: CourierRate[] = [
  {
    courier: 'Steadfast',
    weightTiers: singleTier(70, 100, 130),
    perExtraKg: { 'inside-city': 15, 'sub-city': 20, 'outside-city': 20 },
    codPct: { 'inside-city': 1, 'sub-city': 1, 'outside-city': 1 },
    returnRule: { type: 'none' },
    days: { 'inside-city': '1–2', 'sub-city': '2–3', 'outside-city': '2–4' },
    sourceLabel: 'Steadfast public pricing',
    sourceUrl: 'https://steadfast.com.bd/pricing',
    sourceStatus: 'published',
    asOf: RATE_REVIEW_DATE,
    note: 'Extra-weight and delivery-time figures remain estimates; contract rates can differ.',
  },
  {
    courier: 'Pathao',
    weightTiers: {
      'inside-city': [
        { maxKg: 0.5, charge: 60 },
        { maxKg: 1, charge: 70 },
        { maxKg: 2, charge: 90 },
      ],
      'sub-city': [
        { maxKg: 0.5, charge: 80 },
        { maxKg: 1, charge: 100 },
        { maxKg: 2, charge: 130 },
      ],
      'outside-city': [
        { maxKg: 0.5, charge: 110 },
        { maxKg: 1, charge: 130 },
        { maxKg: 2, charge: 170 },
      ],
    },
    perExtraKg: { 'inside-city': 15, 'sub-city': 25, 'outside-city': 25 },
    codPct: { 'inside-city': 0.5, 'sub-city': 1, 'outside-city': 1 },
    returnRule: {
      type: 'percentage-of-delivery',
      percentage: { 'inside-city': 0, 'sub-city': 50, 'outside-city': 50 },
    },
    days: { 'inside-city': '1', 'sub-city': '3', 'outside-city': '3' },
    sourceLabel: 'Pathao Courier rate card',
    sourceUrl: 'https://pathao.com/courier/?lang=en',
    sourceStatus: 'published',
    asOf: RATE_REVIEW_DATE,
  },
  {
    courier: 'Paperfly',
    weightTiers: singleTier(70, 110, 130),
    perExtraKg: { 'inside-city': 15, 'sub-city': 15, 'outside-city': 30 },
    codPct: { 'inside-city': 0.5, 'sub-city': 1, 'outside-city': 1 },
    returnRule: { type: 'none' },
    days: { 'inside-city': '1', 'sub-city': '1–3', 'outside-city': '1–3' },
    sourceLabel: 'Paperfly terms and rate card',
    sourceUrl: 'https://paperfly.com.bd/terms/',
    sourceStatus: 'published',
    asOf: RATE_REVIEW_DATE,
  },
  {
    courier: 'RedX',
    weightTiers: singleTier(65, 90, 120),
    perExtraKg: { 'inside-city': 15, 'sub-city': 15, 'outside-city': 15 },
    codPct: { 'inside-city': 1, 'sub-city': 1, 'outside-city': 1 },
    returnRule: {
      type: 'fixed',
      charge: { 'inside-city': 30, 'sub-city': 45, 'outside-city': 60 },
    },
    days: { 'inside-city': '1–2', 'sub-city': '2–3', 'outside-city': '3–5' },
    sourceLabel: 'RedX indicative estimate',
    sourceUrl: 'https://redx.com.bd/',
    sourceStatus: 'indicative',
    asOf: RATE_REVIEW_DATE,
    note: 'A complete public rate card was not available; verify this estimate in your merchant panel.',
  },
];

export const ZONE_OPTIONS: { value: CourierZone; label: string }[] = [
  { value: 'inside-city', label: 'Inside city / same district' },
  { value: 'sub-city', label: 'Dhaka nearby / suburb' },
  { value: 'outside-city', label: 'Outside city / different district' },
];

function normaliseNumber(value: number, minimum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, value);
}

function deliveryForWeight(rate: CourierRate, zone: CourierZone, weightKg: number): number {
  const tiers = rate.weightTiers[zone];
  const matchingTier = tiers.find((tier) => weightKg <= tier.maxKg);
  if (matchingTier) return matchingTier.charge;

  const finalTier = tiers[tiers.length - 1];
  const extraKg = Math.ceil(weightKg - finalTier.maxKg);
  return finalTier.charge + extraKg * rate.perExtraKg[zone];
}

function returnChargeFor(rate: CourierRate, zone: CourierZone, deliveryCharge: number): number {
  if (rate.returnRule.type === 'none') return 0;
  if (rate.returnRule.type === 'fixed') return rate.returnRule.charge[zone];
  return deliveryCharge * (rate.returnRule.percentage[zone] / 100);
}

export function compareCourierCharges(
  input: CourierChargeInput,
  rates: CourierRate[] = COURIER_RATES,
): CourierChargeResult {
  const zone = input.zone;
  const weightKg = normaliseNumber(input.weightKg, 0.1);
  const codAmount = normaliseNumber(input.codAmount, 0);

  const quotes = rates
    .map((rate) => {
      const deliveryCharge = deliveryForWeight(rate, zone, weightKg);
      const codCharge = codAmount * (rate.codPct[zone] / 100);
      const returnCharge = returnChargeFor(rate, zone, deliveryCharge);
      const deliveredTotal = deliveryCharge + codCharge;
      const returnTotal = deliveryCharge + returnCharge;

      return {
        courier: rate.courier,
        deliveryCharge: money(deliveryCharge),
        codCharge: money(codCharge),
        returnCharge: money(returnCharge),
        total: money(deliveredTotal),
        deliveredTotal: money(deliveredTotal),
        returnTotal: money(returnTotal),
        estDays: rate.days[zone],
        sourceLabel: rate.sourceLabel,
        sourceUrl: rate.sourceUrl,
        sourceStatus: rate.sourceStatus,
        asOf: rate.asOf,
        note: rate.note,
      };
    })
    .sort((a, b) => a.deliveredTotal - b.deliveredTotal);

  return {
    quotes,
    cheapest: quotes[0]?.courier ?? '',
    zone,
    weightKg,
    codAmount,
  };
}
