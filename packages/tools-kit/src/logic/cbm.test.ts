import { describe, it, expect } from 'vitest';
import { calcCbm, type CbmInput } from './cbm';

const base: CbmInput = {
  productPrice: 10,
  exchangeRate: 17,
  quantity: 1000,
  unitsPerCarton: 50,
  cartonLengthCm: 60,
  cartonWidthCm: 40,
  cartonHeightCm: 50,
  shippingRatePerCbm: 8000,
  extraCost: 20000,
};

describe('calcCbm', () => {
  it('computes cartons, CBM and freight', () => {
    const r = calcCbm(base);
    expect(r.cartons).toBe(20); // ceil(1000/50)
    expect(r.cbmPerCarton).toBeCloseTo(0.12, 4); // 60*40*50 / 1e6
    expect(r.totalCbm).toBeCloseTo(2.4, 4);
    expect(r.shippingCostBdt).toBeCloseTo(19200, 2); // 2.4 * 8000
  });

  it('computes landed cost and per-unit', () => {
    const r = calcCbm(base);
    expect(r.goodsCostBdt).toBeCloseTo(170000, 2); // 10*17*1000
    expect(r.totalLandedCostBdt).toBeCloseTo(209200, 2);
    expect(r.perUnitLandedCostBdt).toBeCloseTo(209.2, 2);
  });

  it('suggests wholesale/retail from markups', () => {
    const r = calcCbm(base);
    expect(r.suggestedWholesale).toBeCloseTo(271.96, 2); // 209.2 * 1.3
    expect(r.suggestedRetail).toBeCloseTo(376.56, 2); // 209.2 * 1.8
  });
});
