// Single source of truth for the tool registry.
// The hub buttons, the middleware subdomain router, and cross-links all read
// this — add a tool here once and everything picks it up.

export type Tool = {
  slug: string;
  title: string;
  desc: string;
  ready: boolean;
  category?: 'Business' | 'Creator' | 'Developer & SEO' | 'Image & Document' | 'Productivity' | 'Everyday Calculators';
  /**
   * Distinct utilities this entry contributes to the site-wide total.
   * Omitted = 1 (a single-purpose tool). Studios set their own count.
   * 0 marks an SEO landing page for a utility already counted inside a studio,
   * so the total never double-counts.
   */
  utilities?: number;
};

export const TOOLS: Tool[] = [
  {
    slug: 'profit-calculator',
    title: 'E-commerce Profit Calculator',
    desc: 'Find your real profit per order — including COD, returns and ad cost.',
    ready: true,
  },
  {
    slug: 'ads-breakeven',
    title: 'Facebook Ads Break-even Calculator',
    desc: 'Max cost per purchase, break-even ROAS and your real ROAS after returns.',
    ready: true,
  },
  {
    slug: 'cbm-calculator',
    title: 'Import Landing Cost & CBM Calculator',
    desc: 'Total CBM, freight, per-piece landed cost and suggested prices.',
    ready: true,
  },
  {
    slug: 'return-loss',
    title: 'Courier Return Loss Calculator',
    desc: 'See what returns cost you per month and per year — and what a 5% lift saves.',
    ready: true,
  },
  {
    slug: 'selling-price',
    title: 'Product Selling Price Calculator',
    desc: 'Break-even, wholesale, retail price and how deep a discount stays safe.',
    ready: true,
  },
  {
    slug: 'discount',
    title: 'Discount Calculator',
    desc: 'Discounted price, profit after discount and a 20/30/40% comparison.',
    ready: true,
  },
  {
    slug: 'dead-stock',
    title: 'Dead Stock Recovery Calculator',
    desc: 'See trapped capital, holding cost and the safe discount to clear slow stock.',
    ready: true,
  },
  {
    slug: 'size-ratio',
    title: 'Size Ratio Calculator',
    desc: 'Split an apparel/footwear order across sizes with a market-typical ratio.',
    ready: true,
  },
  {
    slug: 'cod-settlement',
    title: 'COD Settlement Calculator',
    desc: 'Your true courier payout after COD, delivery, return charges and adjustments.',
    ready: true,
  },
  {
    slug: 'whatsapp-link',
    title: 'WhatsApp Order Link Generator',
    desc: 'A wa.me link that opens WhatsApp with the order message pre-filled.',
    ready: true,
  },
  {
    slug: 'invoice-generator',
    title: 'Professional Invoice Generator',
    desc: 'Create branded invoices in 10 currencies, auto-calculate tax, and export PDF or packing slips.',
    ready: true,
  },
  {
    slug: 'qr-generator',
    title: 'Business QR Code Generator',
    desc: 'QR codes for your website, WhatsApp, phone or payment — download as PNG.',
    ready: true,
  },
  {
    slug: 'campaign-offer',
    title: 'Campaign Offer Builder',
    desc: 'Pick a goal and get offer pricing plus ready-to-post promotional copy.',
    ready: true,
  },
  {
    slug: 'courier-charge',
    title: 'Courier Charge Comparison',
    desc: 'Compare estimated delivery + COD charges across popular BD couriers.',
    ready: true,
  },
  {
    slug: 'address-formatter',
    title: 'Bangladesh Address Formatter',
    desc: 'Paste a messy address — get clean name, phone, district and address fields.',
    ready: true,
  },
  {
    slug: 'ad-copy',
    title: 'Facebook Ad Copy Generator',
    desc: 'Generate headline, primary text, CTA and caption for your product ads.',
    ready: true,
  },
  {
    slug: 'product-description',
    title: 'Product Description Generator',
    desc: 'Title, descriptions, features and SEO meta — ready to publish.',
    ready: true,
  },
  {
    slug: 'fraud-checker',
    title: 'COD Order Risk Checker',
    desc: "Check courier-wise parcel receive history and verify risky COD orders before shipping. Real history needs your courier account connected.",
    ready: true,
  },
  {
    slug: 'parcel-tracking',
    title: 'Courier Parcel Tracking Hub',
    desc: 'Track multiple courier parcels in one place. Needs your courier account connected once.',
    ready: true,
  },
  {
    slug: 'store-health',
    title: 'Free Store Health Checker',
    desc: 'Score your store on speed, trust, SEO and conversion signals.',
    ready: true,
  },
  {
    slug: 'name-checker',
    title: 'Business Name & Domain Checker',
    desc: 'Brand name ideas, slogans and live domain availability.',
    ready: true,
  },
  {
    slug: 'demand-survey',
    title: 'Product Demand Survey Maker',
    desc: 'Build a shareable poll to test demand before you stock.',
    ready: true,
  },
  { slug: 'moq-decision', title: 'MOQ Order Decision Calculator', desc: 'Know the cash required, likely profit and break-even quantity before accepting an MOQ.', ready: true },
  { slug: 'client-profitability', title: 'Client Profitability Calculator', desc: 'Find net client profit, effective hourly rate and margin after direct costs.', ready: true },
  { slug: 'professional-message', title: 'Professional Message Rewriter', desc: 'Polite emails, angry-to-professional rewrites and clear outcome-focused messages in one tool.', ready: true, category: 'Productivity' },
  { slug: 'whatsapp-reply-generator', title: 'WhatsApp Reply Generator', desc: 'Create clear, natural WhatsApp replies for customers, suppliers and everyday conversations.', ready: true, category: 'Productivity' },
  { slug: 'supplier-message', title: 'Supplier Message Generator', desc: 'Generate complete quotation, sample and order follow-up messages.', ready: true, category: 'Business' },
  { slug: 'video-script-timer', title: 'Video Script Timing Calculator', desc: 'Estimate narration duration, word count and recommended scene count.', ready: true, category: 'Creator' },
  { slug: 'teleprompter', title: 'Full-Screen Teleprompter', desc: 'Present scripts with adjustable automatic scrolling in full screen.', ready: true, category: 'Creator' },
  { slug: 'social-media-tools', title: 'Social Media Tools', desc: 'Create, format, check and measure social content with 24 focused tools — including the full image toolkit — in one organized workspace.', ready: true, utilities: 12, category: 'Creator' },
  { slug: 'image-tools', title: 'Image Tools', desc: 'Optimize, convert, resize, clean and present images with 12 private browser tools.', ready: true, utilities: 12, category: 'Image & Document' },
  { slug: 'pdf-document-studio', title: 'PDF & Document Studio', desc: 'Merge, split, edit, sign, convert, compare and generate polished PDF documents with 17 tools in one private workspace.', ready: true, utilities: 17, category: 'Image & Document' },
  { slug: 'developer-tools', title: 'Developer Tools', desc: 'Format, inspect, convert, generate and debug developer data with 21 focused utilities.', ready: true, utilities: 21, category: 'Developer & SEO' },
  { slug: 'website-seo-tools', title: 'Website & SEO Tools', desc: 'Create, inspect and improve metadata, crawlability, content and launch quality with 19 focused utilities.', ready: true, utilities: 19, category: 'Developer & SEO' },
  { slug: 'calculator-tools', title: 'Calculator Tools', desc: 'Solve date, financial, conversion, travel and cross-time-zone questions with 18 focused calculators.', ready: true, utilities: 18, category: 'Everyday Calculators' },
  { slug: 'productivity-tools', title: 'Personal Productivity Tools', desc: 'Plan, prioritize, focus and review work with 12 practical productivity utilities.', ready: true, utilities: 12, category: 'Productivity' },
  { slug: 'education-tools', title: 'Education Tools', desc: 'Calculate grades, plan study, improve writing and generate practice material with 17 focused learning tools.', ready: true, utilities: 17, category: 'Productivity' },
  { slug: 'career-job-tools', title: 'Career & Job Tools', desc: 'Prepare applications, compare opportunities and strengthen professional positioning with 12 career tools.', ready: true, utilities: 12, category: 'Productivity' },
  { slug: 'health-tools', title: 'Health & Lifestyle Calculators', desc: 'Explore general wellbeing estimates and reminder schedules with 10 clearly bounded informational tools.', ready: true, utilities: 10, category: 'Everyday Calculators' },
  { slug: 'travel-tools', title: 'Travel Budget Calculator & Trip Tools', desc: 'Calculate a travel budget, then plan packing, currency, luggage, flights and more with 12 utilities in one workspace.', ready: true, utilities: 12, category: 'Everyday Calculators' },
  { slug: 'creator-tools', title: 'Creator Tools', desc: 'Plan, time, produce, price and repurpose content with 12 focused creator utilities.', ready: true, utilities: 12, category: 'Creator' },
  { slug: 'text-utility-tools', title: 'Text & Utility Tools', desc: 'Transform, organize, inspect and extract text with 14 private browser utilities.', ready: true, utilities: 14, category: 'Productivity' },
  { slug: 'home-everyday-tools', title: 'Home & Everyday Tools', desc: 'Estimate renovation, moving, kitchen and home-energy requirements with 11 practical tools.', ready: true, utilities: 11, category: 'Everyday Calculators' },
  { slug: 'social-share-preview', title: 'Social Sharing Preview Debugger', desc: 'Preview how page metadata will appear when shared on social platforms.', ready: true, utilities: 0, category: 'Developer & SEO' },
  { slug: 'job-offer-comparison', title: 'Job Offer Comparison Calculator', desc: 'Compare the adjusted financial value of two job offers.', ready: true, utilities: 0, category: 'Productivity' },
  { slug: 'study-hours-planner', title: 'Study Hours Planner', desc: 'Convert workload and remaining days into a realistic daily study plan.', ready: true, utilities: 0, category: 'Productivity' },
  { slug: 'room-paint-calculator', title: 'Room Paint and Primer Calculator', desc: 'Estimate paintable area and litres required, including waste.', ready: true, utilities: 0, category: 'Everyday Calculators' },
];

export const TOOL_SLUGS = TOOLS.map((t) => t.slug);

/** Distinct utilities across every ready tool — studios counted by their contents. */
export const TOTAL_UTILITIES = TOOLS.filter((t) => t.ready).reduce(
  (sum, t) => sum + (t.utilities ?? 1),
  0,
);

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
