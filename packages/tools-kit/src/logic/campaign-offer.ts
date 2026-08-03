/**
 * Campaign Offer Builder — pure logic.
 *
 * From a goal + product + discount, produces an offer structure and ready-to-use
 * promotional copy (headline, body, CTA, urgency line). Template-based — no AI,
 * so it works offline and instantly.
 */

export type CampaignGoal =
  | 'stock-clearance'
  | 'new-launch'
  | 'eid-offer'
  | 'flash-sale'
  | 'repeat-customer'
  | 'bundle';

export type CampaignInput = {
  goal: CampaignGoal;
  product: string;
  originalPrice: number;
  discountPct: number;
};

export type CampaignResult = {
  offerPrice: number;
  saved: number;
  headline: string;
  body: string;
  cta: string;
  urgency: string;
};

const money = (n: number) => Math.round(n * 100) / 100;

const TEMPLATES: Record<CampaignGoal, { label: string; urgency: string; ctaWord: string }> = {
  'stock-clearance': { label: 'Stock Clearance', urgency: 'Only while stocks last!', ctaWord: 'Grab Yours' },
  'new-launch': { label: 'New Launch', urgency: 'Be the first to own it.', ctaWord: 'Shop Now' },
  'eid-offer': { label: 'Eid Special', urgency: 'Eid offer — limited time only.', ctaWord: 'Order for Eid' },
  'flash-sale': { label: 'Flash Sale', urgency: 'Ends tonight — hurry!', ctaWord: 'Buy Now' },
  'repeat-customer': { label: 'Loyalty Offer', urgency: 'A thank-you just for you.', ctaWord: 'Claim Offer' },
  bundle: { label: 'Bundle Deal', urgency: 'Bundle & save more.', ctaWord: 'Get the Bundle' },
};

export const CAMPAIGN_GOALS: { value: CampaignGoal; label: string }[] = (
  Object.keys(TEMPLATES) as CampaignGoal[]
).map((value) => ({ value, label: TEMPLATES[value].label }));

export function buildCampaignOffer(input: CampaignInput): CampaignResult {
  const { goal, product, originalPrice, discountPct } = input;
  const t = TEMPLATES[goal];
  const name = product || 'this product';

  const offerPrice = money(originalPrice * (1 - discountPct / 100));
  const saved = money(originalPrice - offerPrice);

  const headline = `${t.label}: ${discountPct}% OFF ${name}!`;
  const body =
    `Get ${name} now for just ৳${offerPrice} instead of ৳${originalPrice} — ` +
    `that's ৳${saved} saved. ${t.urgency}`;
  const cta = `${t.ctaWord} → ৳${offerPrice}`;

  return { offerPrice, saved, headline, body, cta, urgency: t.urgency };
}
