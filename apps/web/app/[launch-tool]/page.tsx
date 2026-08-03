import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { LaunchToolSuite, type LaunchToolSlug } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

const definitions: Record<LaunchToolSlug, { title: string; description: string }> = {
  'moq-decision': { title: 'MOQ Order Decision Calculator', description: 'Check the cash requirement, expected profit and break-even quantity before accepting a supplier MOQ.' },
  'client-profitability': { title: 'Client Profitability Calculator', description: 'Measure net client profit, effective hourly rate and margin after direct expenses.' },
  'professional-message': { title: 'Professional Message Rewriter', description: 'Turn blunt, angry or rushed wording into a clear professional message.' },
  'whatsapp-reply-generator': { title: 'WhatsApp Reply Generator', description: 'Create clear, natural WhatsApp replies for customers, suppliers and everyday conversations.' },
  'supplier-message': { title: 'Supplier Message Generator', description: 'Create complete quotation, sample and order follow-up messages for suppliers.' },
  'video-script-timer': { title: 'Video Script Timing Calculator', description: 'Estimate narration duration, word count and visual scene requirements.' },
  teleprompter: { title: 'Full-Screen Teleprompter', description: 'Run a smooth, adjustable full-screen teleprompter directly in your browser.' },
  'caption-formatter': { title: 'Social Caption Formatter', description: 'Format long captions into clean, readable lines without changing the words.' },
  'social-media-tools': { title: 'Social Media Tools', description: 'Create, format, check and measure social media content with 24 focused tools — including the full image toolkit — in one workspace.' },
  'developer-tools': { title: 'Developer Tools', description: 'Format, inspect, convert, generate and debug developer data with 21 focused utilities.' },
  'website-seo-tools': { title: 'Website & SEO Tools', description: 'Create, inspect and improve metadata, crawlability, content and launch quality with 19 focused utilities.' },
  'calculator-tools': { title: 'Calculator Tools', description: 'Solve date, financial, conversion, travel and cross-time-zone questions with 18 focused calculators.' },
  'productivity-tools': { title: 'Personal Productivity Tools', description: 'Plan, prioritize, focus and review work with 12 practical productivity utilities.' },
  'education-tools': { title: 'Education Tools', description: 'Calculate grades, plan study, improve writing and generate practice material with 17 focused learning tools.' },
  'career-job-tools': { title: 'Career & Job Tools', description: 'Prepare applications, compare opportunities and strengthen professional positioning with 12 career tools.' },
  'health-tools': { title: 'Health & Lifestyle Calculators', description: 'Explore general wellbeing estimates and reminder schedules with 10 clearly bounded informational tools.' },
  'travel-tools': { title: 'Travel Budget Calculator & Trip Tools', description: 'Calculate total, per-person and daily travel budgets, then prepare packing, currency, luggage, schedules and more with 12 utilities in one workspace.' },
  'creator-tools': { title: 'Creator Tools', description: 'Plan, time, produce, price and repurpose content with 12 focused creator utilities.' },
  'text-utility-tools': { title: 'Text & Utility Tools', description: 'Transform, organize, inspect and extract text with 14 private browser utilities.' },
  'home-everyday-tools': { title: 'Home & Everyday Tools', description: 'Estimate renovation, moving, kitchen and home-energy requirements with 11 practical tools.' },
  'image-tools': { title: 'Image Tools', description: 'Optimize, convert, resize, clean and present images with 12 private browser tools.' },
  'instagram-bio-generator': { title: 'Instagram Bio Generator', description: 'Create concise Instagram bios with positioning, credibility and a clear call to action.' },
  'hashtag-cleaner': { title: 'Hashtag Cleaner', description: 'Remove duplicate, broken and inconsistently formatted hashtags.' },
  'youtube-timestamp-generator': { title: 'YouTube Timestamp Generator', description: 'Format and validate video chapters for YouTube descriptions.' },
  'thumbnail-title-checker': { title: 'Thumbnail Title Checker', description: 'Preview and score thumbnail text for fast mobile readability.' },
  'facebook-ad-formatter': { title: 'Facebook Ad Text Formatter', description: 'Structure hooks, primary text, headlines, descriptions and calls to action.' },
  'linkedin-post-formatter': { title: 'LinkedIn Post Formatter', description: 'Turn ideas into readable LinkedIn posts with a strong hook and conversation prompt.' },
  'twitter-thread-splitter': { title: 'X / Twitter Thread Splitter', description: 'Split long writing into numbered posts without breaking words.' },
  'engagement-rate-calculator': { title: 'Engagement Rate Calculator', description: 'Measure average engagement per post using followers and meaningful interactions.' },
  'influencer-rate-calculator': { title: 'Influencer Rate Calculator', description: 'Estimate a negotiation range using audience, engagement, deliverables and usage rights.' },
  'giveaway-winner-picker': { title: 'Giveaway Winner Picker', description: 'Remove duplicate entries and select winners using secure browser randomness.' },
  'social-username-checker': { title: 'Social Username Availability Checker', description: 'Check official profile URLs and record username availability across major platforms.' },
  'product-photo-cleaner': { title: 'Product Background Cleaner', description: 'Normalize near-white product backgrounds and export a clean PNG locally.' },
  'social-image-resizer': { title: 'Social Media Image Resizer', description: 'Fit an image into common square, portrait, story and ad dimensions.' },
  'passport-photo-maker': { title: 'Passport and Visa Photo Maker', description: 'Crop a portrait into common passport and visa photo dimensions.' },
  'utm-builder': { title: 'UTM Campaign Link Builder', description: 'Create trackable campaign links with correctly encoded UTM parameters.' },
  'social-share-preview': { title: 'Social Sharing Preview Debugger', description: 'Preview how a title, description and image will appear when a page is shared.' },
  'job-offer-comparison': { title: 'Job Offer Comparison Calculator', description: 'Compare the adjusted financial value of two employment offers.' },
  'study-hours-planner': { title: 'Study Hours Planner', description: 'Turn syllabus workload, confidence and remaining days into a daily study target.' },
  'room-paint-calculator': { title: 'Room Paint and Primer Calculator', description: 'Estimate wall area and paint requirements with openings and waste included.' },
};

export function generateStaticParams() { return Object.keys(definitions).map((slug) => ({ 'launch-tool': slug })); }
export async function generateMetadata({ params }: { params: Promise<{ 'launch-tool': string }> }): Promise<Metadata> {
  const slug = (await params)['launch-tool'] as LaunchToolSlug; const item = definitions[slug];
  if (!item) return {};
  return { title: `${item.title} — Contra Commerce`, description: item.description, alternates: { canonical: getToolUrl(slug) } };
}
export default async function LaunchToolPage({ params }: { params: Promise<{ 'launch-tool': string }> }) {
  const requestedSlug = (await params)['launch-tool'];
  if (requestedSlug === 'travel-budget') redirect(getToolUrl('travel-tools'));
  const slug = requestedSlug as LaunchToolSlug;
  const item = definitions[slug]; if (!item) notFound();
  return <main className="mx-auto max-w-5xl px-4 py-10"><nav className="mb-6 text-sm text-gray-500"><a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / {item.title}</nav><header className="mb-8"><p className="text-sm font-medium text-blue-600">Free · Private by default</p><h1 className="mt-1 text-3xl font-bold text-gray-950">{item.title}</h1><p className="mt-2 max-w-2xl text-gray-600">{item.description}</p></header><LaunchToolSuite tool={slug}/></main>;
}
