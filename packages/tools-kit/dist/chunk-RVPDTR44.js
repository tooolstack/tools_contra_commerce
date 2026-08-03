// src/logic/profit.ts
var money = (n) => Math.round(n * 100) / 100;
function clamp01(n) {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
function calcProfit(input) {
  const {
    productCost,
    sellingPrice,
    adCostPerOrder,
    forwardCharge,
    returnCharge,
    packagingCost,
    codChargePct,
    codChargeMode = "percentage",
    codChargeFixed = 0,
    returnRatePct,
    monthlyOrders,
    productRecoveredOnReturn = true
  } = input;
  const r = clamp01(returnRatePct / 100);
  const d = 1 - r;
  const codRate = codChargeMode === "percentage" ? Math.max(0, codChargePct) / 100 : 0;
  const fixedCodFee = codChargeMode === "fixed" ? Math.max(0, codChargeFixed) : 0;
  const revenue = d * sellingPrice;
  const productCostExpected = productRecoveredOnReturn ? d * productCost : productCost;
  const codFee = d * (sellingPrice * codRate + fixedCodFee);
  const returnFee = r * returnCharge;
  const expectedProfitPerAttempt = revenue - productCostExpected - codFee - forwardCharge - packagingCost - returnFee - adCostPerOrder;
  const netProfitPerDelivered = d > 0 ? expectedProfitPerAttempt / d : Number.NEGATIVE_INFINITY;
  const fixedPerAttempt = productCostExpected + forwardCharge + packagingCost + returnFee + adCostPerOrder + d * fixedCodFee;
  const breakEvenPrice = d > 0 ? fixedPerAttempt / (d * (1 - codRate)) : Number.POSITIVE_INFINITY;
  const maxAdCostPerOrder = revenue - productCostExpected - codFee - forwardCharge - packagingCost - returnFee;
  const returnLossPerReturned = adCostPerOrder + packagingCost + forwardCharge + returnCharge + (productRecoveredOnReturn ? 0 : productCost);
  const result = {
    deliveryRate: d,
    netProfitPerDelivered: money(netProfitPerDelivered),
    profitMarginPct: sellingPrice > 0 ? money(netProfitPerDelivered / sellingPrice * 100) : 0,
    breakEvenPrice: money(breakEvenPrice),
    maxAdCostPerOrder: money(maxAdCostPerOrder),
    returnLossPerReturned: money(returnLossPerReturned)
  };
  if (monthlyOrders && monthlyOrders > 0) {
    const returnedOrders = monthlyOrders * r;
    const deliveredOrders = monthlyOrders * d;
    result.monthly = {
      deliveredOrders: Math.round(deliveredOrders),
      returnedOrders: Math.round(returnedOrders),
      netProfit: money(deliveredOrders * netProfitPerDelivered),
      returnLoss: money(returnedOrders * returnLossPerReturned)
    };
  }
  return result;
}

export {
  calcProfit
};
