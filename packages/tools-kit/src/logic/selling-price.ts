/**
 * Product Selling Price Calculator — pure logic.
 *
 * From product cost + overhead + target margin, works out break-even, target
 * selling, wholesale and retail prices, and how deep a discount is still safe.
 */

export type SellingPriceInput = {
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

export type SellingPriceResult = {
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

const money = (n: number) => Math.round(n * 100) / 100;
const nonNegative = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);
const margin = (n: number) => Math.min(99.9, nonNegative(n));

export function calcSellingPrice(input: SellingPriceInput): SellingPriceResult {
  const {
    productCost,
    overheadPct,
    targetMarginPct,
    vatPct = 0,
    wholesaleMarginPct = 15,
    retailMarginPct = 50,
  } = input;

  const safeProductCost = nonNegative(productCost);
  const safeOverheadPct = nonNegative(overheadPct);
  const safeTargetMarginPct = margin(targetMarginPct);
  const safeVatPct = nonNegative(vatPct);
  const safeWholesaleMarkupPct = nonNegative(wholesaleMarginPct);
  const safeRetailMarginPct = margin(retailMarginPct);

  const vat = 1 + safeVatPct / 100;
  const operatingCostAmount = safeProductCost * (safeOverheadPct / 100);
  const costWithOverhead = safeProductCost + operatingCostAmount;
  const breakEvenPrice = costWithOverhead * vat;

  const marginFactor = 1 - safeTargetMarginPct / 100;
  const targetPrice = (costWithOverhead / marginFactor) * vat;

  const retailFactor = 1 - safeRetailMarginPct / 100;
  const retailPrice = (costWithOverhead / retailFactor) * vat;

  const wholesalePrice = costWithOverhead * (1 + safeWholesaleMarkupPct / 100) * vat;

  const targetPriceExVat = targetPrice / vat;
  const vatAmount = targetPrice - targetPriceExVat;
  const profitAtTarget = targetPriceExVat - costWithOverhead;

  const maxDiscountPct =
    targetPrice > 0 && Number.isFinite(targetPrice)
      ? ((targetPrice - breakEvenPrice) / targetPrice) * 100
      : 0;

  return {
    operatingCostAmount: money(operatingCostAmount),
    costWithOverhead: money(costWithOverhead),
    breakEvenPrice: money(breakEvenPrice),
    targetPrice: money(targetPrice),
    retailPrice: money(retailPrice),
    wholesalePrice: money(wholesalePrice),
    vatAmount: money(vatAmount),
    targetPriceExVat: money(targetPriceExVat),
    profitAtTarget: money(profitAtTarget),
    maxDiscountPct: money(maxDiscountPct),
  };
}
