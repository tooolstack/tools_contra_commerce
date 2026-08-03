import { NextResponse } from 'next/server';
import { hasLlm, generateJson } from '../../../lib/llm';
import { logEvent } from '../../../lib/db';
import { checkRateLimit, cleanText, requestWithinSize } from '../../../lib/api-security';

export const runtime = 'nodejs';

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    headline: { type: 'string' },
    primaryText: { type: 'string' },
    cta: { type: 'string' },
    caption: { type: 'string' },
    offerCopy: { type: 'string' },
    retargetingCopy: { type: 'string' },
    videoHook: { type: 'string' },
  },
  required: ['headline', 'primaryText', 'cta', 'caption', 'offerCopy', 'retargetingCopy', 'videoHook'],
};

type AdCopy = {
  headline: string;
  primaryText: string;
  cta: string;
  caption: string;
  offerCopy: string;
  retargetingCopy: string;
  videoHook: string;
};

export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'ad-copy', 10, 24 * 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 20_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  const product = cleanText(body.product, 200);
  const audience = cleanText(body.audience, 300);
  const offer = cleanText(body.offer, 300);
  const tone = cleanText(body.tone || 'friendly', 80);

  await logEvent('ad-copy', { product, audience, offer, tone }, { demo: !hasLlm(), req });

  if (!hasLlm()) {
    return NextResponse.json({ demo: true, ...fallback(product, offer) });
  }

  try {
    const result = await generateJson<AdCopy>(
      'আপনি বাংলাদেশের ই-কমার্স ব্যবসার জন্য একজন দক্ষ Facebook ad copywriter। স্বাভাবিক, সংক্ষিপ্ত ও বিক্রয়মুখী বাংলা ভাষায় লিখুন। প্রয়োজন হলে Cash on Delivery উল্লেখ করুন। অযাচাইকৃত দাবি করবেন না।',
      `পণ্য: ${product}\nটার্গেট ক্রেতা: ${audience}\nঅফার: ${offer}\nটোন: ${tone}\nবাংলায় লিখুন: headline, primary text, CTA, short caption, offer copy, retargeting copy এবং ভিডিওর প্রথম ৩ সেকেন্ডের hook।`,
      SCHEMA,
    );
    return NextResponse.json({ demo: false, ...result });
  } catch {
    return NextResponse.json({ demo: true, error: 'generation_failed', ...fallback(product, offer) });
  }
}

function fallback(product: string, offer: string): AdCopy {
  const p = product || 'এই পণ্য';
  return {
    headline: `${offer || 'বিশেষ অফার'} — আজই নিন ${p}`,
    primaryText: `${p} খুঁজছেন? ${offer ? `${offer}। ` : ''}সারা বাংলাদেশে Cash on Delivery-তে অর্ডার করুন। স্টক সীমিত।`,
    cta: 'এখনই অর্ডার করুন',
    caption: `${p} এখন পাওয়া যাচ্ছে—অর্ডার করতে ইনবক্স করুন। 🛒`,
    offerCopy: `🔥 ${offer || 'সীমিত সময়ের অফার'} — স্টক থাকা পর্যন্ত।`,
    retargetingCopy: `${p} এখনও ভাবছেন? স্টক শেষ হওয়ার আগে অর্ডার নিশ্চিত করুন।`,
    videoHook: `একটু থামুন—${p} কেন আপনার জন্য ভালো হতে পারে দেখুন…`,
  };
}
