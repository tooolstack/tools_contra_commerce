import { describe, it, expect } from 'vitest';
import { calcReturnLoss, type ReturnLossInput } from './return-loss';

const base: ReturnLossInput = {
  monthlyParcels: 1000,
  successRatePct: 80,
  forwardCharge: 70,
  returnCharge: 70,
  packagingCost: 20,
};

describe('calcReturnLoss', () => {
  it('computes returned parcels and loss per return', () => {
    const r = calcReturnLoss(base);
    expect(r.returnedParcels).toBe(200); // 1000 * 20%
    expect(r.lossPerReturn).toBe(160); // 70+70+20
  });

  it('computes monthly and yearly loss', () => {
    const r = calcReturnLoss(base);
    expect(r.monthlyLoss).toBe(32000); // 200 * 160
    expect(r.yearlyLoss).toBe(384000); // 32000 * 12
  });

  it('computes savings from a 5% success-rate lift', () => {
    const r = calcReturnLoss(base);
    expect(r.improvement.monthlySaving).toBe(8000); // 0.05 * 1000 * 160
    expect(r.improvement.yearlySaving).toBe(96000);
  });

  it('clamps success rate to the valid 0–100% range', () => {
    expect(calcReturnLoss({ ...base, successRatePct: 120 }).monthlyLoss).toBe(0);
    expect(calcReturnLoss({ ...base, successRatePct: -20 }).monthlyLoss).toBe(160000);
  });

  it('prevents negative parcel counts and costs from producing invalid losses', () => {
    const r = calcReturnLoss({
      ...base,
      monthlyParcels: -100,
      forwardCharge: -70,
      returnCharge: -70,
      packagingCost: -20,
    });
    expect(r.returnedParcels).toBe(0);
    expect(r.lossPerReturn).toBe(0);
    expect(r.monthlyLoss).toBe(0);
    expect(r.yearlyLoss).toBe(0);
  });
});
