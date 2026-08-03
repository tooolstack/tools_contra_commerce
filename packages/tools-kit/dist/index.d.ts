import * as react from 'react';
import { ReactNode } from 'react';
import { ProfitResult, ProfitInput } from './logic/profit.js';
export { CodChargeMode, calcProfit } from './logic/profit.js';

/**
 * Debounced usage tracking. Posts `{ tool, payload }` to the tracking endpoint
 * ~2.5s after the user stops changing inputs. The endpoint defaults to
 * NEXT_PUBLIC_TRACK_ENDPOINT — set on the marketing site, unset (and therefore
 * a no-op) in a host app like the boss's SaaS. Never throws.
 */
declare function useResultTracking(tool: string, payload: unknown, endpoint?: string | undefined): void;
declare const bdt: (n: number) => string;
declare const pct: (n: number, places?: number) => string;
declare const dec: (n: number, places?: number) => string;
declare const num: (n: number) => string;
type ToolProps = {
    brand?: string;
    ctaText?: string;
    ctaUrl?: string;
    className?: string;
};
declare function CalculatorShell({ className, children, }: {
    className?: string;
    children: ReactNode;
}): react.JSX.Element;
declare function InputCard({ title, children, }: {
    title?: ReactNode;
    children: ReactNode;
}): react.JSX.Element;
declare function ResultsColumn({ children }: {
    children: ReactNode;
}): react.JSX.Element;
declare function NumberField({ label, value, onChange, suffix, min, max, step, }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number | 'any';
}): react.JSX.Element;
declare function ResultHero({ label, value, positive, neutral, sub, }: {
    label: string;
    value: string;
    positive?: boolean;
    neutral?: boolean;
    sub?: ReactNode;
}): react.JSX.Element;
declare function StatGrid({ children }: {
    children: ReactNode;
}): react.JSX.Element;
declare function Stat({ label, value, tone, }: {
    label: string;
    value: string;
    tone?: 'default' | 'red' | 'emerald';
}): react.JSX.Element;
declare function Panel({ label, value, sub, }: {
    label: string;
    value: string;
    sub?: ReactNode;
}): react.JSX.Element;
declare function TextField({ label, value, onChange, placeholder, }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}): react.JSX.Element;
declare function TextArea({ label, value, onChange, placeholder, rows, }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    rows?: number;
}): react.JSX.Element;
declare function SelectField({ label, value, options, onChange, }: {
    label: string;
    value: string;
    options: {
        value: string;
        label: string;
    }[];
    onChange: (v: string) => void;
}): react.JSX.Element;
type DropdownOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
/** Accessible product-wide replacement for native selects, including the tray. */
declare function DropdownControl({ value, onChange, options, className, ariaLabel, disabled }: {
    value: string;
    onChange: (value: string) => void;
    options: Array<string | DropdownOption>;
    className?: string;
    ariaLabel?: string;
    disabled?: boolean;
}): react.JSX.Element;
/** A read-only output block with a copy button. */
declare function CopyField({ label, value }: {
    label?: string;
    value: string;
}): react.JSX.Element;
/** Generic titled output container. */
declare function OutputBox({ title, children }: {
    title?: ReactNode;
    children: ReactNode;
}): react.JSX.Element;
declare function CtaCard({ href, text, brand, }: {
    href?: string;
    text: string;
    brand?: string;
}): react.JSX.Element;

type ProfitCalculatorProps = ToolProps & {
    /** Fires on every valid recalculation — hook this to lead capture / analytics */
    onResult?: (result: ProfitResult, input: ProfitInput) => void;
};
declare function ProfitCalculator({ brand, ctaText, ctaUrl, className, onResult, }: ProfitCalculatorProps): react.JSX.Element;

/**
 * Facebook Ads Break-even Calculator — pure logic.
 *
 * Answers: how much can I pay per purchase (CPA) and still profit? What ROAS
 * breaks even? And — accounting for returns — what is my *actual* ROAS?
 *
 * A Facebook "purchase" = an order placed. Some of those get returned (RTO), so
 * the money available to pay for ads per purchase must absorb the return drag.
 */
type AdsInput = {
    /** Selling price charged to the customer (৳) */
    sellingPrice: number;
    /** Product buying cost per delivered order (৳) */
    productCost: number;
    /** Fulfillment cost per delivered order — delivery + packaging + COD fee etc. (৳) */
    fulfillmentCost: number;
    /** Return rate as a percentage of orders (e.g. 20 for 20%) */
    returnRatePct: number;
    /** Cost incurred on a returned order — courier return charge + lost packaging (৳) */
    returnCostPerReturn: number;
    /** Optional: current cost per purchase reported by the ad platform (৳) */
    currentCpp?: number;
    /** Optional: daily ad budget — enables the "sales per day needed" figure (৳) */
    dailyAdBudget?: number;
};
type AdsVerdict = 'keep_running' | 'optimize' | 'break_even' | 'stop';
type AdsResult = {
    /** ৳ contribution per delivered order before ad spend */
    marginPerDelivered: number;
    /** ৳ money available to spend on ads per purchase (break-even CPA) */
    maxCpp: number;
    /** Reported break-even ROAS (sellingPrice / maxCpp); Infinity if never profitable */
    breakEvenRoas: number;
    /** Break-even delivered sales/day for the daily ad budget (present when dailyAdBudget given) */
    breakEvenSalesPerDay?: number;
    /** Present only when currentCpp was provided */
    current?: {
        /** ৳ profit per order at the current CPA (maxCpp − currentCpp) */
        profitPerOrder: number;
        /** Reported ROAS at current CPA (value counted at order) */
        reportedRoas: number;
        /** Actual ROAS after returns (delivered revenue only) */
        actualRoas: number;
        /** true → keep running, false → losing money at this CPA */
        profitable: boolean;
        /** Actionable recommendation based on distance from break-even CPP */
        verdict: AdsVerdict;
    };
};
declare function calcAdsBreakeven(input: AdsInput): AdsResult;

type AdsBreakevenProps = ToolProps & {
    onResult?: (result: AdsResult, input: AdsInput) => void;
};
declare function AdsBreakeven({ brand, ctaText, ctaUrl, className, onResult, }: AdsBreakevenProps): react.JSX.Element;

/**
 * Import Landing Cost & CBM Calculator — pure logic.
 *
 * For Bangladeshi importers shipping from China/abroad by volume (CBM). Works
 * out total shipment volume, freight cost, per-piece landed cost, and suggested
 * wholesale/retail prices.
 */
type CbmInput = {
    /** Unit price in the foreign currency (RMB/USD) */
    productPrice: number;
    /** Exchange rate: 1 foreign unit = X BDT */
    exchangeRate: number;
    /** Total quantity of pieces */
    quantity: number;
    /** How many pieces fit in one carton */
    unitsPerCarton: number;
    /** Carton dimensions in centimetres */
    cartonLengthCm: number;
    cartonWidthCm: number;
    cartonHeightCm: number;
    /** Freight rate in BDT per CBM (m³) */
    shippingRatePerCbm: number;
    /** Customs + agent + misc costs, total in BDT */
    extraCost: number;
    /** Optional markups for the suggested prices (defaults: 30% / 80%) */
    wholesaleMarkupPct?: number;
    retailMarkupPct?: number;
};
type CbmResult = {
    cartons: number;
    cbmPerCarton: number;
    totalCbm: number;
    goodsCostBdt: number;
    shippingCostBdt: number;
    totalLandedCostBdt: number;
    perUnitLandedCostBdt: number;
    suggestedWholesale: number;
    suggestedRetail: number;
};
declare function calcCbm(input: CbmInput): CbmResult;

type CbmCalculatorProps = ToolProps & {
    onResult?: (result: CbmResult, input: CbmInput) => void;
};
declare function CbmCalculator({ brand, ctaText, ctaUrl, className, onResult, }: CbmCalculatorProps): react.JSX.Element;

/**
 * Courier Return Loss Calculator — pure logic.
 *
 * Shows how much money returns (RTO) quietly cost per month and per year, and
 * how much a 5% lift in delivery success rate would save. Highly shareable —
 * the yearly number is usually a shock.
 */
type ReturnLossInput = {
    /** Total parcels shipped per month */
    monthlyParcels: number;
    /** Delivery success rate as a percentage (e.g. 80 for 80%) */
    successRatePct: number;
    /** Courier forward/delivery charge per shipment (৳) */
    forwardCharge: number;
    /** Courier return (RTO) charge per returned shipment (৳) */
    returnCharge: number;
    /** Packaging cost lost per returned shipment (৳) */
    packagingCost: number;
    /** Optional: how many percentage points to model as an improvement (default 5) */
    improvementPct?: number;
};
type ReturnLossResult = {
    returnRatePct: number;
    returnedParcels: number;
    lossPerReturn: number;
    monthlyLoss: number;
    yearlyLoss: number;
    /** Savings if the success rate improves by `improvementPct` points */
    improvement: {
        points: number;
        monthlySaving: number;
        yearlySaving: number;
    };
};
declare function calcReturnLoss(input: ReturnLossInput): ReturnLossResult;

type ReturnLossCalculatorProps = ToolProps & {
    onResult?: (result: ReturnLossResult, input: ReturnLossInput) => void;
};
declare function ReturnLossCalculator({ brand, ctaText, ctaUrl, className, onResult, }: ReturnLossCalculatorProps): react.JSX.Element;

/**
 * Product Selling Price Calculator — pure logic.
 *
 * From product cost + overhead + target margin, works out break-even, target
 * selling, wholesale and retail prices, and how deep a discount is still safe.
 */
type SellingPriceInput = {
    /** Product buying cost (৳) */
    productCost: number;
    /** Overhead/operating cost as a percentage of product cost (e.g. 10) */
    overheadPct: number;
    /** Target profit margin as a percentage of selling price (e.g. 30) */
    targetMarginPct: number;
    /** VAT as a percentage, added on top (optional, e.g. 0 or 7.5) */
    vatPct?: number;
    /** Wholesale margin as a percentage of cost (optional, default 15) */
    wholesaleMarginPct?: number;
    /** Retail margin as a percentage of selling price (optional, default 50) */
    retailMarginPct?: number;
};
type SellingPriceResult = {
    /** ৳ operating/overhead cost added to the product cost */
    operatingCostAmount: number;
    /** ৳ cost including overhead */
    costWithOverhead: number;
    /** ৳ lowest price that still covers cost + overhead (+VAT), zero profit */
    breakEvenPrice: number;
    /** ৳ price that hits the target margin (+VAT) */
    targetPrice: number;
    /** ৳ suggested retail (MRP) price at the retail margin (+VAT) */
    retailPrice: number;
    /** ৳ suggested wholesale price (+VAT) */
    wholesalePrice: number;
    /** ৳ VAT portion included in the target price */
    vatAmount: number;
    /** ৳ target price excluding VAT */
    targetPriceExVat: number;
    /** ৳ profit at the target price (before VAT remittance) */
    profitAtTarget: number;
    /** Max discount % off the target price before dropping below break-even */
    maxDiscountPct: number;
};
declare function calcSellingPrice(input: SellingPriceInput): SellingPriceResult;

type SellingPriceCalculatorProps = ToolProps & {
    onResult?: (result: SellingPriceResult, input: SellingPriceInput) => void;
};
declare function SellingPriceCalculator({ brand, ctaText, ctaUrl, className, onResult, }: SellingPriceCalculatorProps): react.JSX.Element;

/**
 * Discount Calculator — pure logic.
 *
 * From regular price + discount + product cost: the discounted price, the money
 * saved, whether it's still profitable, the profit margin, a Buy-X-Get-Y bundle
 * cost, and a 20/30/40% comparison so the merchant can see where a discount
 * tips into a loss.
 */
type DiscountInput = {
    /** Regular price before discount (৳) */
    regularPrice: number;
    /** Discount as a percentage (e.g. 30) */
    discountPct: number;
    /** Product cost, to check profitability (৳) */
    productCost: number;
    /** Packaging, fulfillment and operating cost per item (৳, optional) */
    additionalCostPerUnit?: number;
    /** Bundle "Buy X" quantity — customer pays for these (default 2) */
    bundleBuyQty?: number;
    /** Bundle "Get Y free" quantity (default 1) */
    bundleFreeQty?: number;
    /** Optional set of discount % to compare (default 20/30/40) */
    comparePcts?: number[];
};
type DiscountStatus = 'profit' | 'break_even' | 'loss';
type DiscountRow = {
    discountPct: number;
    price: number;
    profit: number;
    marginPct: number;
    profitable: boolean;
    status: DiscountStatus;
};
type BundleResult = {
    buyQty: number;
    freeQty: number;
    /** Total items the customer walks away with (buy + free) */
    itemsGiven: number;
    /** ৳ what the customer actually pays (buyQty × regular price) */
    customerPays: number;
    /** ৳ your cost for all items given (itemsGiven × product cost) */
    totalCost: number;
    /** ৳ profit on the whole bundle */
    profit: number;
    profitable: boolean;
    status: DiscountStatus;
    /** Effective discount % the bundle represents (free / total) */
    effectiveDiscountPct: number;
    /** ৳ effective price per item across the bundle */
    perUnitPrice: number;
};
type DiscountResult = {
    /** Product cost + packaging/fulfillment/operating cost per item */
    totalUnitCost: number;
    discountedPrice: number;
    savedAmount: number;
    profitAfterDiscount: number;
    profitMarginPct: number;
    profitable: boolean;
    status: DiscountStatus;
    bundle: BundleResult;
    comparisons: DiscountRow[];
};
declare function calcDiscount(input: DiscountInput): DiscountResult;

type DiscountCalculatorProps = ToolProps & {
    onResult?: (result: DiscountResult, input: DiscountInput) => void;
};
declare function DiscountCalculator({ brand, ctaText, ctaUrl, className, onResult, }: DiscountCalculatorProps): react.JSX.Element;

/**
 * Dead Stock Recovery Calculator — pure logic.
 *
 * How much capital is tied up in slow-moving stock, what it costs to keep
 * holding it, and how deep a discount you can give while still recovering cost.
 */
type DeadStockInput = {
    /** Units still in stock */
    stockQty: number;
    /** Purchase (cost) price per unit (৳) */
    purchasePrice: number;
    /** Current selling price per unit (৳) */
    currentSellingPrice: number;
    /** How many days the stock has been sitting */
    daysHeld: number;
    /** Monthly carrying cost as a percentage of stock value (e.g. 3) */
    monthlyCarryingCostPct: number;
    /** Units per clearance bundle (default 3) */
    bundleSize?: number;
    /** Discount % applied to a bundle (default 25) */
    bundleDiscountPct?: number;
};
type DeadStockResult = {
    /** ৳ capital tied up (qty × purchase price) */
    tiedCapital: number;
    /** ৳ carrying cost per month */
    monthlyCarryingCost: number;
    /** ৳ carrying cost accrued so far */
    carryingCostToDate: number;
    /** ৳ break-even price — sell at cost */
    breakEvenPrice: number;
    /** Max discount % off current price that still recovers purchase cost */
    maxSafeDiscountPct: number;
    /** ৳ suggested quick-liquidation price (10% below cost to move fast) */
    suggestedLiquidationPrice: number;
    /** ৳ cost of waiting one more month instead of liquidating */
    costOfWaitingPerMonth: number;
    /** Bundle offer to move stock faster */
    bundle: {
        size: number;
        discountPct: number;
        price: number;
        perUnit: number;
    };
    /** Quick-sale (liquidate now) vs. wait-and-hope comparison */
    comparison: {
        sellNowValue: number;
        waitOneMonthValue: number;
        sellNowBetter: boolean;
    };
};
declare function calcDeadStock(input: DeadStockInput): DeadStockResult;

type DeadStockCalculatorProps = ToolProps & {
    onResult?: (result: DeadStockResult, input: DeadStockInput) => void;
};
declare function DeadStockCalculator({ brand, ctaText, ctaUrl, className, onResult, }: DeadStockCalculatorProps): react.JSX.Element;

/** Transparent size allocation and demand-planning logic. */
type SizeWeight = {
    size: string;
    weight: number;
};
type SizeRatioInput = {
    totalQty: number;
    ratio: SizeWeight[];
};
type SizeRatioRow = {
    size: string;
    qty: number;
    pct: number;
};
type SizeRatioResult = {
    rows: SizeRatioRow[];
    total: number;
};
/** Example presets only. They are not claims about verified market demand. */
declare const SIZE_PRESETS: Record<string, {
    label: string;
    ratio: SizeWeight[];
}>;
/** Largest-remainder allocation: integer quantities always add up to totalQty. */
declare function calcSizeRatio(input: SizeRatioInput): SizeRatioResult;

type SizeRatioCalculatorProps = ToolProps & {
    onResult?: (result: SizeRatioResult, input: SizeRatioInput) => void;
};
declare function SizeRatioCalculator({ brand, ctaText, ctaUrl, className, onResult }: SizeRatioCalculatorProps): react.JSX.Element;

/**
 * COD Settlement Calculator — pure logic.
 *
 * From a courier statement's numbers, works out exactly how much the merchant
 * actually receives after COD fees, delivery charges, return charges and any
 * manual adjustments.
 */
type CodSettlementInput = {
    /** Total COD amount collected from customers (৳) */
    totalCollected: number;
    /** COD fee as a percentage of the collected amount (e.g. 1) */
    codChargePct: number;
    /** Number of delivered parcels */
    deliveredParcels: number;
    /** Delivery charge per delivered parcel (৳) */
    deliveryChargePerParcel: number;
    /** Number of returned parcels */
    returnedParcels: number;
    /** Return charge per returned parcel (৳) */
    returnChargePerParcel: number;
    /** Other adjustments — positive or negative (৳) */
    adjustments: number;
};
type CodSettlementResult = {
    codCharge: number;
    deliveryCharges: number;
    returnCharges: number;
    totalDeductions: number;
    netPayable: number;
    /** Total deductions as a % of the collected amount */
    effectiveChargePct: number;
};
declare function calcCodSettlement(input: CodSettlementInput): CodSettlementResult;

type CodSettlementCalculatorProps = ToolProps & {
    onResult?: (result: CodSettlementResult, input: CodSettlementInput) => void;
};
declare function CodSettlementCalculator({ brand, ctaText, ctaUrl, className, onResult, }: CodSettlementCalculatorProps): react.JSX.Element;

/**
 * WhatsApp Order Link Generator — pure logic.
 *
 * Builds a wa.me deep link with a pre-filled order message. Normalises
 * Bangladesh phone numbers to the international format WhatsApp expects.
 */
type WhatsappInput = {
    /** Business WhatsApp number, any local format (e.g. 01712345678) */
    phone: string;
    /** Product name */
    product: string;
    /** Price shown in the message (৳) — optional */
    price?: string;
    /** Extra fields to prompt the customer for (e.g. Size, Color, Address) */
    fields?: string[];
};
type WhatsappResult = {
    /** Normalised international number (no +), e.g. 8801712345678 */
    normalizedPhone: string;
    /** The pre-filled message text */
    message: string;
    /** The full wa.me link */
    link: string;
    /** true if the phone looks like a valid BD mobile number */
    valid: boolean;
};
/** Normalise a Bangladesh number to 8801XXXXXXXXX (no plus). */
declare function normalizeBdPhone(raw: string): string;
declare function buildWhatsappLink(input: WhatsappInput): WhatsappResult;

type WhatsappLinkGeneratorProps = ToolProps & {
    onResult?: (result: WhatsappResult, input: WhatsappInput) => void;
};
declare function WhatsappLinkGenerator({ brand, ctaText, ctaUrl, className, onResult, }: WhatsappLinkGeneratorProps): react.JSX.Element;

type InvoiceGeneratorProps = ToolProps;
declare function InvoiceGenerator({ brand, ctaText, ctaUrl, className, }: InvoiceGeneratorProps): react.JSX.Element;

/** Pure invoice calculations shared by the editor, preview, and print output. */
type InvoiceItem = {
    name: string;
    description?: string;
    qty: number;
    price: number;
};
type InvoiceInput = {
    items: InvoiceItem[];
    deliveryCharge?: number;
    discount?: number;
    discountType?: 'fixed' | 'percent';
    taxRate?: number;
};
type InvoiceLine = InvoiceItem & {
    total: number;
};
type InvoiceResult = {
    lines: InvoiceLine[];
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    taxableAmount: number;
    tax: number;
    grandTotal: number;
    totalItems: number;
};
declare function calcInvoice(input: InvoiceInput): InvoiceResult;

type SocialMediaToolSlug = 'social-media-tools' | 'instagram-bio-generator' | 'hashtag-cleaner' | 'youtube-timestamp-generator' | 'thumbnail-title-checker' | 'facebook-ad-formatter' | 'linkedin-post-formatter' | 'twitter-thread-splitter' | 'engagement-rate-calculator' | 'influencer-rate-calculator' | 'giveaway-winner-picker' | 'social-username-checker';

type LaunchToolSlug = SocialMediaToolSlug | 'developer-tools' | 'website-seo-tools' | 'calculator-tools' | 'productivity-tools' | 'education-tools' | 'career-job-tools' | 'health-tools' | 'travel-tools' | 'creator-tools' | 'text-utility-tools' | 'home-everyday-tools' | 'image-tools' | 'moq-decision' | 'client-profitability' | 'professional-message' | 'whatsapp-reply-generator' | 'supplier-message' | 'video-script-timer' | 'teleprompter' | 'caption-formatter' | 'product-photo-cleaner' | 'social-image-resizer' | 'passport-photo-maker' | 'utm-builder' | 'social-share-preview' | 'job-offer-comparison' | 'study-hours-planner' | 'room-paint-calculator';
declare function LaunchToolSuite({ tool }: {
    tool: LaunchToolSlug;
}): react.JSX.Element;

declare function PdfDocumentStudio({ invoiceUrl }: {
    invoiceUrl?: string;
}): react.JSX.Element;

declare function DeveloperToolsStudio({ inspectEndpoint }: {
    inspectEndpoint?: string;
}): react.JSX.Element;

declare function WebsiteSeoStudio({ endpoint }: {
    endpoint?: string;
}): react.JSX.Element;

declare function CalculatorToolsStudio(): react.JSX.Element;

declare function ProductivityToolsStudio(): react.JSX.Element;

declare function EducationToolsStudio(): react.JSX.Element;

declare function CareerToolsStudio(): react.JSX.Element;

declare function HealthToolsStudio(): react.JSX.Element;

declare function TravelToolsStudio(): react.JSX.Element;

declare function CreatorToolsStudio(): react.JSX.Element;

declare function TextUtilityStudio(): react.JSX.Element;

declare function HomeToolsStudio(): react.JSX.Element;

declare function ImageToolsStudio(): react.JSX.Element;

type QrGeneratorProps = ToolProps;
declare function QrGenerator({ brand, ctaText, ctaUrl, className, }: QrGeneratorProps): react.JSX.Element;

/**
 * Business QR Code Generator — pure content logic.
 *
 * Builds the string that gets encoded into the QR for each business use-case.
 * The actual QR rendering happens in the component (via the `qrcode` library).
 */
type QrType = 'url' | 'whatsapp' | 'phone' | 'payment' | 'email' | 'text';
type QrInput = {
    type: QrType;
    value: string;
};
declare function buildQrContent({ type, value }: QrInput): string;
declare const QR_TYPE_OPTIONS: {
    value: QrType;
    label: string;
    placeholder: string;
}[];

type CampaignOfferBuilderProps = ToolProps;
declare function CampaignOfferBuilder({ brand, ctaText, ctaUrl, className, }: CampaignOfferBuilderProps): react.JSX.Element;

/**
 * Campaign Offer Builder — pure logic.
 *
 * From a goal + product + discount, produces an offer structure and ready-to-use
 * promotional copy (headline, body, CTA, urgency line). Template-based — no AI,
 * so it works offline and instantly.
 */
type CampaignGoal = 'stock-clearance' | 'new-launch' | 'eid-offer' | 'flash-sale' | 'repeat-customer' | 'bundle';
type CampaignInput = {
    goal: CampaignGoal;
    product: string;
    originalPrice: number;
    discountPct: number;
};
type CampaignResult = {
    offerPrice: number;
    saved: number;
    headline: string;
    body: string;
    cta: string;
    urgency: string;
};
declare const CAMPAIGN_GOALS: {
    value: CampaignGoal;
    label: string;
}[];
declare function buildCampaignOffer(input: CampaignInput): CampaignResult;

type CourierChargeComparisonProps = ToolProps & {
    /** Optional host endpoint that can return live/merchant-contract quotes. */
    ratesEndpoint?: string;
    /** Optional host endpoint that checks the current Contra Commerce session. */
    bookingStatusEndpoint?: string;
    /** Optional host endpoint that creates an authenticated courier booking. */
    bookingEndpoint?: string;
};
declare function CourierChargeComparison({ brand, ctaText, ctaUrl, ratesEndpoint, bookingStatusEndpoint, bookingEndpoint, className, }: CourierChargeComparisonProps): react.JSX.Element;

/**
 * Courier Charge Comparison — framework-independent calculation logic.
 *
 * The built-in table is a transparent published-rate fallback. A host app can
 * replace these quotes with live or merchant-contract rates via its own API.
 */
type CourierZone = 'inside-city' | 'sub-city' | 'outside-city';
type CourierRateStatus = 'published' | 'indicative';
type CourierChargeInput = {
    zone: CourierZone;
    /** Parcel weight in kg. Values below 0.1 are normalised to 0.1. */
    weightKg: number;
    /** COD amount to collect (৳). Negative values are normalised to zero. */
    codAmount: number;
};
type CourierLocationInput = {
    pickupDistrict: string;
    destinationDistrict: string;
    destinationArea?: string;
};
type WeightTier = {
    maxKg: number;
    charge: number;
};
type CourierRate = {
    courier: string;
    weightTiers: Record<CourierZone, WeightTier[]>;
    perExtraKg: Record<CourierZone, number>;
    codPct: Record<CourierZone, number>;
    returnRule: {
        type: 'none';
    } | {
        type: 'percentage-of-delivery';
        percentage: Record<CourierZone, number>;
    } | {
        type: 'fixed';
        charge: Record<CourierZone, number>;
    };
    days: Record<CourierZone, string>;
    sourceLabel: string;
    sourceUrl: string;
    sourceStatus: CourierRateStatus;
    asOf: string;
    note?: string;
};
type CourierQuote = {
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
type CourierChargeResult = {
    quotes: CourierQuote[];
    cheapest: string;
    zone: CourierZone;
    weightKg: number;
    codAmount: number;
};
declare const DISTRICT_OPTIONS: {
    value: string;
    label: string;
}[];
/**
 * Maps pickup and customer location to the three public courier rate zones.
 * Nearby Dhaka service areas are treated as sub-city; a different district is
 * otherwise an outside-city shipment.
 */
declare function detectCourierZone({ pickupDistrict, destinationDistrict, destinationArea, }: CourierLocationInput): CourierZone;
/**
 * Public fallback rates in BDT.
 *
 * `published` means the public page states the relevant rate structure.
 * `indicative` means the provider does not expose a complete public rate card;
 * that row must not be presented as a live or merchant-contract quote.
 */
declare const COURIER_RATES: CourierRate[];
declare const ZONE_OPTIONS: {
    value: CourierZone;
    label: string;
}[];
declare function compareCourierCharges(input: CourierChargeInput, rates?: CourierRate[]): CourierChargeResult;

/**
 * Operational order-risk assessment.
 *
 * Courier history can indicate delivery risk, but it cannot prove that a
 * customer or order is fraudulent. This helper deliberately returns actionable
 * fulfilment recommendations instead of a defamatory "fake/not fake" label.
 */
type OperationalRiskLevel = 'low' | 'medium' | 'high' | 'insufficient_data';
type OrderRiskVerdict = 'approve' | 'verify' | 'hold' | 'insufficient_data';
type OrderRiskEvidence = {
    riskLevel: OperationalRiskLevel;
    riskScore: number | null;
    successRate: number | null;
    totalOrders: number;
    delivered: number;
    cancellations: number;
    repeatedAttempts: number;
    addressSuspicious: boolean;
    addressReasons?: string[];
};
type OrderRiskAssessment = {
    verdict: OrderRiskVerdict;
    heading: string;
    recommendation: string;
    reasons: string[];
};
declare function assessOperationalOrderRisk(evidence: OrderRiskEvidence): OrderRiskAssessment;

type AddressFormatterProps = ToolProps;
declare function AddressFormatter({ brand, ctaText, ctaUrl, className, }: AddressFormatterProps): react.JSX.Element;

/**
 * Bangladesh Address Formatter — pure logic.
 *
 * Parses a messy pasted address into structured fields (name, phone, district,
 * address) and flags what's missing. Heuristic and best-effort — meant to speed
 * up order entry, not to be perfect.
 */
type AddressInput = {
    raw: string;
};
type AddressResult = {
    name: string;
    phone: string;
    district: string;
    thana: string;
    area: string;
    landmark: string;
    address: string;
    warnings: string[];
};
declare const BD_DISTRICTS: string[];
declare function parseAddress({ raw }: AddressInput): AddressResult;

type AdCopyGeneratorProps = ToolProps & {
    /** API endpoint that returns the generated copy (default: /api/ad-copy) */
    endpoint?: string;
};
declare function AdCopyGenerator({ brand, ctaText, ctaUrl, className, endpoint, }: AdCopyGeneratorProps): react.JSX.Element;

type ProductDescriptionGeneratorProps = ToolProps & {
    /** API endpoint (default: /api/product-description) */
    endpoint?: string;
};
declare function ProductDescriptionGenerator({ brand, ctaText, ctaUrl, className, endpoint, }: ProductDescriptionGeneratorProps): react.JSX.Element;

type FraudCheckerProps = ToolProps & {
    endpoint?: string;
};
declare function FraudChecker({ brand, ctaText, ctaUrl, className, endpoint, }: FraudCheckerProps): react.JSX.Element;

type ParcelTrackingProps = ToolProps & {
    /** API endpoint (default: /api/track) */
    endpoint?: string;
};
declare function ParcelTracking({ brand, ctaText, ctaUrl, className, endpoint, }: ParcelTrackingProps): react.JSX.Element;

type StoreHealthCheckerProps = ToolProps & {
    /** API endpoint (default: /api/store-health) */
    endpoint?: string;
};
declare function StoreHealthChecker({ brand, ctaText, ctaUrl, className, endpoint, }: StoreHealthCheckerProps): react.JSX.Element;

type NameCheckerProps = ToolProps & {
    /** API endpoint for domain checks (default: /api/domain-check) */
    endpoint?: string;
};
declare function NameChecker({ brand, ctaText, ctaUrl, className, endpoint, }: NameCheckerProps): react.JSX.Element;

/**
 * Business Name & Domain Checker — pure name-idea logic (client-side).
 * Generates brand-name ideas, slugs and slogans from a keyword. Domain
 * availability is checked separately via the /api/domain-check endpoint.
 */
type ColorSwatch = {
    name: string;
    hex: string;
};
type NameIdeasResult = {
    names: string[];
    slugs: string[];
    slogans: string[];
    fbUsernames: string[];
    colors: ColorSwatch[];
};
declare function generateNames(keyword: string): NameIdeasResult;

type DemandSurveyMakerProps = ToolProps & {
    /** Base URL of the poll page (default: current origin + /poll) */
    pollBaseUrl?: string;
};
declare function DemandSurveyMaker({ brand, ctaText, ctaUrl, className, pollBaseUrl, }: DemandSurveyMakerProps): react.JSX.Element;

/**
 * Product Demand Survey Maker — pure logic (client-side, self-contained).
 *
 * A survey is one optional product image + one or more questions, each with its
 * own options. The whole thing is base64-encoded into the shareable link, so no
 * backend is needed to create or render a poll. Collecting/storing responses is
 * the one part that uses the SaaS backend (POST /api/survey-vote).
 */
type SurveyQuestion = {
    question: string;
    options: string[];
};
type Survey = {
    /** Optional product image URL shown at the top of the poll */
    imageUrl?: string;
    questions: SurveyQuestion[];
};
/** URL-safe base64 encode of the survey. */
declare function encodeSurvey(survey: Survey): string;
declare function decodeSurvey(encoded: string): Survey | null;
/** Build the shareable poll link. `basePollUrl` should point at the poll page. */
declare function buildSurveyLink(survey: Survey, basePollUrl: string): string;

export { AdCopyGenerator, type AdCopyGeneratorProps, AddressFormatter, type AddressFormatterProps, type AddressInput, type AddressResult, AdsBreakeven, type AdsBreakevenProps, type AdsInput, type AdsResult, type AdsVerdict, BD_DISTRICTS, type BundleResult, CAMPAIGN_GOALS, COURIER_RATES, CalculatorShell, CalculatorToolsStudio, type CampaignGoal, type CampaignInput, CampaignOfferBuilder, type CampaignOfferBuilderProps, type CampaignResult, CareerToolsStudio, CbmCalculator, type CbmCalculatorProps, type CbmInput, type CbmResult, CodSettlementCalculator, type CodSettlementCalculatorProps, type CodSettlementInput, type CodSettlementResult, CopyField, CourierChargeComparison, type CourierChargeComparisonProps, type CourierChargeInput, type CourierChargeResult, type CourierLocationInput, type CourierQuote, type CourierRate, type CourierRateStatus, type CourierZone, CreatorToolsStudio, CtaCard, DISTRICT_OPTIONS, DeadStockCalculator, type DeadStockCalculatorProps, type DeadStockInput, type DeadStockResult, DemandSurveyMaker, type DemandSurveyMakerProps, DeveloperToolsStudio, DiscountCalculator, type DiscountCalculatorProps, type DiscountInput, type DiscountResult, type DiscountRow, type DiscountStatus, DropdownControl, type DropdownOption, EducationToolsStudio, FraudChecker, type FraudCheckerProps, HealthToolsStudio, HomeToolsStudio, ImageToolsStudio, InputCard, InvoiceGenerator, type InvoiceGeneratorProps, type InvoiceInput, type InvoiceItem, type InvoiceResult, type LaunchToolSlug, LaunchToolSuite, NameChecker, type NameCheckerProps, type NameIdeasResult, NumberField, type OperationalRiskLevel, type OrderRiskAssessment, type OrderRiskEvidence, type OrderRiskVerdict, OutputBox, Panel, ParcelTracking, type ParcelTrackingProps, PdfDocumentStudio, ProductDescriptionGenerator, type ProductDescriptionGeneratorProps, ProductivityToolsStudio, ProfitCalculator, type ProfitCalculatorProps, ProfitInput, ProfitResult, QR_TYPE_OPTIONS, QrGenerator, type QrGeneratorProps, type QrInput, type QrType, ResultHero, ResultsColumn, ReturnLossCalculator, type ReturnLossCalculatorProps, type ReturnLossInput, type ReturnLossResult, SIZE_PRESETS, SelectField, SellingPriceCalculator, type SellingPriceCalculatorProps, type SellingPriceInput, type SellingPriceResult, SizeRatioCalculator, type SizeRatioCalculatorProps, type SizeRatioInput, type SizeRatioResult, Stat, StatGrid, StoreHealthChecker, type StoreHealthCheckerProps, type Survey, TextArea, TextField, TextUtilityStudio, type ToolProps, TravelToolsStudio, WebsiteSeoStudio, type WhatsappInput, WhatsappLinkGenerator, type WhatsappLinkGeneratorProps, type WhatsappResult, ZONE_OPTIONS, assessOperationalOrderRisk, bdt, buildCampaignOffer, buildQrContent, buildSurveyLink, buildWhatsappLink, calcAdsBreakeven, calcCbm, calcCodSettlement, calcDeadStock, calcDiscount, calcInvoice, calcReturnLoss, calcSellingPrice, calcSizeRatio, compareCourierCharges, dec, decodeSurvey, detectCourierZone, encodeSurvey, generateNames, normalizeBdPhone, num, parseAddress, pct, useResultTracking };
