/**
 * Dead Stock Recovery Calculator — pure logic.
 *
 * How much capital is tied up in slow-moving stock, what it costs to keep
 * holding it, and how deep a discount you can give while still recovering cost.
 */

export type DeadStockInput = {
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

export type DeadStockResult = {
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
  bundle: { size: number; discountPct: number; price: number; perUnit: number };
  /** Quick-sale (liquidate now) vs. wait-and-hope comparison */
  comparison: { sellNowValue: number; waitOneMonthValue: number; sellNowBetter: boolean };
};

const money = (n: number) => Math.round(n * 100) / 100;

export function calcDeadStock(input: DeadStockInput): DeadStockResult {
  const {
    stockQty,
    purchasePrice,
    currentSellingPrice,
    daysHeld,
    monthlyCarryingCostPct,
    bundleSize = 3,
    bundleDiscountPct = 25,
  } = input;

  const tiedCapital = stockQty * purchasePrice;
  const monthlyCarryingCost = tiedCapital * (monthlyCarryingCostPct / 100);
  const carryingCostToDate = monthlyCarryingCost * (daysHeld / 30);

  const marginPerUnit = currentSellingPrice - purchasePrice;
  const maxSafeDiscountPct =
    currentSellingPrice > 0 && marginPerUnit > 0
      ? (marginPerUnit / currentSellingPrice) * 100
      : 0;

  const liquidationPrice = purchasePrice * 0.9;

  // Bundle: N units sold together at a discount off the current price.
  const bundlePrice = bundleSize * currentSellingPrice * (1 - bundleDiscountPct / 100);

  // Sell now (liquidate the lot fast) vs. wait a month hoping to sell at full price.
  const sellNowValue = stockQty * liquidationPrice;
  const waitOneMonthValue = stockQty * currentSellingPrice - monthlyCarryingCost;

  return {
    tiedCapital: money(tiedCapital),
    monthlyCarryingCost: money(monthlyCarryingCost),
    carryingCostToDate: money(carryingCostToDate),
    breakEvenPrice: money(purchasePrice),
    maxSafeDiscountPct: money(maxSafeDiscountPct),
    suggestedLiquidationPrice: money(liquidationPrice),
    costOfWaitingPerMonth: money(monthlyCarryingCost),
    bundle: {
      size: bundleSize,
      discountPct: bundleDiscountPct,
      price: money(bundlePrice),
      perUnit: money(bundleSize > 0 ? bundlePrice / bundleSize : 0),
    },
    comparison: {
      sellNowValue: money(sellNowValue),
      waitOneMonthValue: money(waitOneMonthValue),
      sellNowBetter: sellNowValue >= waitOneMonthValue,
    },
  };
}
