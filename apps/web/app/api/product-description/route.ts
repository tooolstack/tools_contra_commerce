import { NextResponse } from 'next/server';
import { hasLlm, generateJson } from '../../../lib/llm';
import { logEvent } from '../../../lib/db';
import { checkRateLimit, cleanText, requestWithinSize } from '../../../lib/api-security';

export const runtime = 'nodejs';

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    shortDescription: { type: 'string' },
    fullDescription: { type: 'string' },
    features: { type: 'array', items: { type: 'string' } },
    seoTitle: { type: 'string' },
    metaDescription: { type: 'string' },
    facebookCaption: { type: 'string' },
  },
  required: [
    'title',
    'shortDescription',
    'fullDescription',
    'features',
    'seoTitle',
    'metaDescription',
    'facebookCaption',
  ],
};

type ProductDesc = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  seoTitle: string;
  metaDescription: string;
  facebookCaption: string;
};

export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'product-description', 10, 24 * 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 4_500_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  const product = cleanText(body.product, 200);
  const details = cleanText(body.details, 2_000);
  const keywords = cleanText(body.keywords, 500);
  const image = typeof body.image === 'string' && body.image.length <= 4_000_000 ? body.image : '';

  await logEvent('product-description', { product, details, keywords }, { demo: !hasLlm(), req });

  if (!hasLlm()) {
    return NextResponse.json({ demo: true, ...fallback(product) });
  }

  try {
    const result = await generateJson<ProductDesc>(
      'You are an e-commerce product copywriter. Write clear, benefit-led product content in English for a Bangladeshi online store. If an image is provided, describe what you see.',
      `Product: ${product}\nDetails: ${details}\nKeywords: ${keywords}\nWrite a website title, short description, full description, 4-6 feature bullets, an SEO title, a meta description and a Facebook caption.`,
      SCHEMA,
      typeof image === 'string' && image.startsWith('data:image/') ? image : undefined,
    );
    return NextResponse.json({ demo: false, ...result });
  } catch {
    return NextResponse.json({ demo: true, error: 'generation_failed', ...fallback(product) });
  }
}

function fallback(product: string): ProductDesc {
  const p = product || 'This product';
  return {
    title: p,
    shortDescription: `${p} — quality you can trust, delivered across Bangladesh with cash on delivery.`,
    fullDescription: `${p} is designed to give you the best value for money. Carefully selected for quality and durability, it's a favourite among our customers. Order today and enjoy fast delivery and easy returns anywhere in Bangladesh.`,
    features: ['High quality materials', 'Great value for money', 'Cash on delivery available', 'Fast nationwide delivery'],
    seoTitle: `${p} — Best Price in Bangladesh | Order Online`,
    metaDescription: `Buy ${p} online in Bangladesh at the best price. Cash on delivery, fast shipping, easy returns. Order now!`,
    facebookCaption: `✨ ${p} is here! Cash on delivery all over Bangladesh 🇧🇩 — DM to order! 🛒`,
  };
}
