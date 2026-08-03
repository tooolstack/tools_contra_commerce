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
type CodChargeMode = 'percentage' | 'fixed';
type ProfitInput = {
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
type ProfitResult = {
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
declare function calcProfit(input: ProfitInput): ProfitResult;

export { type CodChargeMode, type ProfitInput, type ProfitResult, calcProfit };
