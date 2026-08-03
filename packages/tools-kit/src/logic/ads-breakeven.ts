/**
 * Facebook Ads Break-even Calculator — pure logic.
 *
 * Answers: how much can I pay per purchase (CPA) and still profit? What ROAS
 * breaks even? And — accounting for returns — what is my *actual* ROAS?
 *
 * A Facebook "purchase" = an order placed. Some of those get returned (RTO), so
 * the money available to pay for ads per purchase must absorb the return drag.
 */

export type AdsInput = {
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

export type AdsVerdict = 'keep_running' | 'optimize' | 'break_even' | 'stop';

export type AdsResult = {
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

const money = (n: number) => Math.round(n * 100) / 100;
const nonNegative = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function calcAdsBreakeven(input: AdsInput): AdsResult {
  const {
    sellingPrice,
    productCost,
    fulfillmentCost,
    returnRatePct,
    returnCostPerReturn,
    currentCpp,
    dailyAdBudget,
  } = input;

  const safeSellingPrice = nonNegative(sellingPrice);
  const safeProductCost = nonNegative(productCost);
  const safeFulfillmentCost = nonNegative(fulfillmentCost);
  const safeReturnCost = nonNegative(returnCostPerReturn);
  const safeCurrentCpp = currentCpp == null ? undefined : nonNegative(currentCpp);
  const safeDailyAdBudget =
    dailyAdBudget == null ? undefined : nonNegative(dailyAdBudget);
  const r = clamp01(returnRatePct / 100);
  const d = 1 - r;

  const marginPerDelivered =
    safeSellingPrice - safeProductCost - safeFulfillmentCost;

  // Money available per purchase to spend on ads, after return drag.
  const maxCpp = d * marginPerDelivered - r * safeReturnCost;

  const breakEvenRoas =
    maxCpp > 0 ? safeSellingPrice / maxCpp : Number.POSITIVE_INFINITY;

  const result: AdsResult = {
    marginPerDelivered: money(marginPerDelivered),
    maxCpp: money(maxCpp),
    breakEvenRoas: money(breakEvenRoas),
  };

  if (safeDailyAdBudget && safeDailyAdBudget > 0 && maxCpp > 0) {
    // Facebook purchases/orders placed needed so the day's spend breaks even.
    result.breakEvenSalesPerDay = Math.ceil(safeDailyAdBudget / maxCpp);
  }

  if (safeCurrentCpp && safeCurrentCpp > 0) {
    const reportedRoas = safeSellingPrice / safeCurrentCpp;
    const profitPerOrder = maxCpp - safeCurrentCpp;
    const breakEvenTolerance = 0.01;
    const verdict: AdsVerdict =
      Math.abs(profitPerOrder) <= breakEvenTolerance
        ? 'break_even'
        : profitPerOrder < 0
          ? 'stop'
          : safeCurrentCpp <= maxCpp * 0.8
            ? 'keep_running'
            : 'optimize';
    result.current = {
      profitPerOrder: money(profitPerOrder),
      reportedRoas: money(reportedRoas),
      actualRoas: money(d * reportedRoas),
      profitable: profitPerOrder > 0,
      verdict,
    };
  }

  return result;
}
