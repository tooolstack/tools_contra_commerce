/**
 * Discount Calculator — pure logic.
 *
 * From regular price + discount + product cost: the discounted price, the money
 * saved, whether it's still profitable, the profit margin, a Buy-X-Get-Y bundle
 * cost, and a 20/30/40% comparison so the merchant can see where a discount
 * tips into a loss.
 */

export type DiscountInput = {
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

export type DiscountStatus = 'profit' | 'break_even' | 'loss';

export type DiscountRow = {
  discountPct: number;
  price: number;
  profit: number;
  marginPct: number;
  profitable: boolean;
  status: DiscountStatus;
};

export type BundleResult = {
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

export type DiscountResult = {
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

const money = (n: number) => Math.round(n * 100) / 100;
const nonNegative = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);
const discountPct = (n: number) => Math.min(100, nonNegative(n));
const bundleQty = (n: number) =>
  Math.max(1, Math.floor(Number.isFinite(n) ? n : 1));
const statusFor = (profit: number): DiscountStatus =>
  Math.abs(profit) < 0.005 ? 'break_even' : profit > 0 ? 'profit' : 'loss';

function row(regularPrice: number, productCost: number, pct: number): DiscountRow {
  const safePct = discountPct(pct);
  const price = regularPrice * (1 - safePct / 100);
  const profit = price - productCost;
  const status = statusFor(profit);
  return {
    discountPct: safePct,
    price: money(price),
    profit: money(profit),
    marginPct: price > 0 ? money((profit / price) * 100) : 0,
    profitable: status === 'profit',
    status,
  };
}

function bundle(
  regularPrice: number,
  productCost: number,
  buyQty: number,
  freeQty: number,
): BundleResult {
  const itemsGiven = buyQty + freeQty;
  const customerPays = buyQty * regularPrice; // pay for buyQty, get freeQty free
  const totalCost = itemsGiven * productCost;
  const profit = customerPays - totalCost;
  const status = statusFor(profit);
  return {
    buyQty,
    freeQty,
    itemsGiven,
    customerPays: money(customerPays),
    totalCost: money(totalCost),
    profit: money(profit),
    profitable: status === 'profit',
    status,
    effectiveDiscountPct: itemsGiven > 0 ? money((freeQty / itemsGiven) * 100) : 0,
    perUnitPrice: itemsGiven > 0 ? money(customerPays / itemsGiven) : 0,
  };
}

export function calcDiscount(input: DiscountInput): DiscountResult {
  const {
    regularPrice,
    discountPct,
    productCost,
    additionalCostPerUnit = 0,
    bundleBuyQty = 2,
    bundleFreeQty = 1,
    comparePcts = [20, 30, 40],
  } = input;

  const safeRegularPrice = nonNegative(regularPrice);
  const totalUnitCost =
    nonNegative(productCost) + nonNegative(additionalCostPerUnit);
  const safeBuyQty = bundleQty(bundleBuyQty);
  const safeFreeQty = bundleQty(bundleFreeQty);
  const main = row(safeRegularPrice, totalUnitCost, discountPct);

  return {
    totalUnitCost: money(totalUnitCost),
    discountedPrice: main.price,
    savedAmount: money(safeRegularPrice - main.price),
    profitAfterDiscount: main.profit,
    profitMarginPct: main.marginPct,
    profitable: main.profitable,
    status: main.status,
    bundle: bundle(
      safeRegularPrice,
      totalUnitCost,
      safeBuyQty,
      safeFreeQty,
    ),
    comparisons: comparePcts.map((p) => row(safeRegularPrice, totalUnitCost, p)),
  };
}
