/**
 * Courier Return Loss Calculator — pure logic.
 *
 * Shows how much money returns (RTO) quietly cost per month and per year, and
 * how much a 5% lift in delivery success rate would save. Highly shareable —
 * the yearly number is usually a shock.
 */

export type ReturnLossInput = {
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

export type ReturnLossResult = {
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

const money = (n: number) => Math.round(n * 100) / 100;
const nonNegative = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function calcReturnLoss(input: ReturnLossInput): ReturnLossResult {
  const {
    monthlyParcels,
    successRatePct,
    forwardCharge,
    returnCharge,
    packagingCost,
    improvementPct = 5,
  } = input;

  const safeMonthlyParcels = nonNegative(monthlyParcels);
  const safeForwardCharge = nonNegative(forwardCharge);
  const safeReturnCharge = nonNegative(returnCharge);
  const safePackagingCost = nonNegative(packagingCost);
  const safeImprovementPct = nonNegative(improvementPct);
  const successRate = clamp01(successRatePct / 100);
  const r = 1 - successRate;

  const returnedParcels = safeMonthlyParcels * r;
  const lossPerReturn = safeForwardCharge + safeReturnCharge + safePackagingCost;
  const monthlyLoss = returnedParcels * lossPerReturn;

  // Improvement: fewer returns → parcels saved from the return bucket.
  const points = clamp01(safeImprovementPct / 100);
  const parcelsSaved = safeMonthlyParcels * Math.min(points, r);
  const monthlySaving = parcelsSaved * lossPerReturn;

  return {
    returnRatePct: money(r * 100),
    returnedParcels: Math.round(returnedParcels),
    lossPerReturn: money(lossPerReturn),
    monthlyLoss: money(monthlyLoss),
    yearlyLoss: money(monthlyLoss * 12),
    improvement: {
      points: safeImprovementPct,
      monthlySaving: money(monthlySaving),
      yearlySaving: money(monthlySaving * 12),
    },
  };
}
