/**
 * Contra Commerce — Profit Calculator core logic.
 *
 * PURE and framework-agnostic. No React, no DOM, no "use client".
 * Safe to run in the browser, in a Next.js server component, or inside a
 * PostgreSQL-backed API route. This is the single source of truth for the
 * numbers — the UI only renders what these functions return.
 *
 * Economics model (Bangladesh COD e-commerce)
 * -------------------------------------------
 * Returns (RTO) cost money even though no sale happens: ads, packaging and the
 * courier's forward/return charges are spent on every order attempt, while
 * revenue only arrives on *delivered* orders. So an honest "profit per
 * delivered order" must absorb the drag from the returned ones.
 *
 * We compute the expected cash flow over a single order attempt, then divide by
 * the delivery rate to express it per delivered order.
 */

export type CodChargeMode = 'percentage' | 'fixed';

export type ProfitInput = {
  /** Product buying cost (৳) */
  productCost: number;
  /** Selling price charged to the customer (৳) */
  sellingPrice: number;
  /** Ad spend attributed to ONE order attempt = total ad spend / total orders (৳) */
  adCostPerOrder: number;
  /** Courier forward/delivery charge per shipment (৳) */
  forwardCharge: number;
  /** Courier return (RTO) charge per returned shipment (৳) */
  returnCharge: number;
  /** Packaging cost per shipment (৳) */
  packagingCost: number;
  /**
   * Courier COD fee as a percentage of the collected amount (e.g. 1 for 1%).
   * Retained as the default for backwards compatibility.
   */
  codChargePct: number;
  /** How the courier charges COD. Defaults to percentage. */
  codChargeMode?: CodChargeMode;
  /** Fixed COD fee per delivered order (৳), used when codChargeMode is fixed. */
  codChargeFixed?: number;
  /** Return rate as a percentage of total orders (e.g. 20 for 20%) */
  returnRatePct: number;

  /** Optional: total monthly orders — enables monthly projections */
  monthlyOrders?: number;
  /**
   * Whether a returned product comes back to sellable stock.
   * true  → product cost is only lost on delivered orders (default, typical).
   * false → product cost is lost on every attempt (perishable / damaged goods).
   */
  productRecoveredOnReturn?: boolean;
};

export type ProfitResult = {
  /** Delivery rate as a fraction (0..1) */
  deliveryRate: number;
  /** ৳ net profit per delivered order, with return drag absorbed */
  netProfitPerDelivered: number;
  /** net profit / selling price × 100 */
  profitMarginPct: number;
  /** ৳ selling price at which profit = 0 */
  breakEvenPrice: number;
  /** ৳ highest ad cost/order that still breaks even at the current selling price */
  maxAdCostPerOrder: number;
  /** ৳ money lost on each returned order */
  returnLossPerReturned: number;
  /** Present only when monthlyOrders was provided */
  monthly?: {
    deliveredOrders: number;
    returnedOrders: number;
    /** ৳ total monthly net profit */
    netProfit: number;
    /** ৳ total monthly loss caused by returns */
    returnLoss: number;
  };
};

const money = (n: number) => Math.round(n * 100) / 100;

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function calcProfit(input: ProfitInput): ProfitResult {
  const {
    productCost,
    sellingPrice,
    adCostPerOrder,
    forwardCharge,
    returnCharge,
    packagingCost,
    codChargePct,
    codChargeMode = 'percentage',
    codChargeFixed = 0,
    returnRatePct,
    monthlyOrders,
    productRecoveredOnReturn = true,
  } = input;

  const r = clamp01(returnRatePct / 100); // return fraction
  const d = 1 - r; // delivery fraction
  const codRate = codChargeMode === 'percentage' ? Math.max(0, codChargePct) / 100 : 0;
  const fixedCodFee = codChargeMode === 'fixed' ? Math.max(0, codChargeFixed) : 0;

  // --- Expected cash flow over ONE order attempt ---
  const revenue = d * sellingPrice; // only delivered orders bring revenue

  const productCostExpected = productRecoveredOnReturn
    ? d * productCost // lost only when delivered (returned stock is resold)
    : productCost; // lost on every attempt

  // COD is charged only when payment is collected on a delivered order.
  const codFee = d * (sellingPrice * codRate + fixedCodFee);
  const returnFee = r * returnCharge; // only returned shipments
  // forwardCharge, packagingCost, adCostPerOrder are spent on EVERY attempt

  const expectedProfitPerAttempt =
    revenue -
    productCostExpected -
    codFee -
    forwardCharge -
    packagingCost -
    returnFee -
    adCostPerOrder;

  // Per delivered order (guard against d = 0)
  const netProfitPerDelivered =
    d > 0 ? expectedProfitPerAttempt / d : Number.NEGATIVE_INFINITY;

  // --- Break-even selling price (solve expectedProfit = 0 for P) ---
  // d·P·(1 − codRate) = productCostExpected + forward + packaging + returnFee
  //                         + ads + expected fixed COD fee
  const fixedPerAttempt =
    productCostExpected +
    forwardCharge +
    packagingCost +
    returnFee +
    adCostPerOrder +
    d * fixedCodFee;
  const breakEvenPrice =
    d > 0 ? fixedPerAttempt / (d * (1 - codRate)) : Number.POSITIVE_INFINITY;

  // --- Max ad cost/order that still breaks even at the current selling price ---
  const maxAdCostPerOrder =
    revenue - productCostExpected - codFee - forwardCharge - packagingCost - returnFee;

  // --- Money lost on each returned order (spent, no revenue) ---
  const returnLossPerReturned =
    adCostPerOrder +
    packagingCost +
    forwardCharge +
    returnCharge +
    (productRecoveredOnReturn ? 0 : productCost);

  const result: ProfitResult = {
    deliveryRate: d,
    netProfitPerDelivered: money(netProfitPerDelivered),
    profitMarginPct:
      sellingPrice > 0 ? money((netProfitPerDelivered / sellingPrice) * 100) : 0,
    breakEvenPrice: money(breakEvenPrice),
    maxAdCostPerOrder: money(maxAdCostPerOrder),
    returnLossPerReturned: money(returnLossPerReturned),
  };

  if (monthlyOrders && monthlyOrders > 0) {
    const returnedOrders = monthlyOrders * r;
    const deliveredOrders = monthlyOrders * d;
    result.monthly = {
      deliveredOrders: Math.round(deliveredOrders),
      returnedOrders: Math.round(returnedOrders),
      netProfit: money(deliveredOrders * netProfitPerDelivered),
      returnLoss: money(returnedOrders * returnLossPerReturned),
    };
  }

  return result;
}
