import { describe, it, expect } from 'vitest';
import { calcSellingPrice, type SellingPriceInput } from './selling-price';

const base: SellingPriceInput = {
  productCost: 300,
  overheadPct: 10,
  targetMarginPct: 30,
  vatPct: 0,
};

describe('calcSellingPrice', () => {
  it('computes cost with overhead and break-even', () => {
    const r = calcSellingPrice(base);
    expect(r.costWithOverhead).toBe(330); // 300 * 1.1
    expect(r.breakEvenPrice).toBe(330);
  });

  it('computes the target price for the desired margin', () => {
    const r = calcSellingPrice(base);
    expect(r.targetPrice).toBeCloseTo(471.43, 2); // 330 / (1-0.30)
    expect(r.profitAtTarget).toBeCloseTo(141.43, 2);
  });

  it('computes wholesale price and max safe discount', () => {
    const r = calcSellingPrice(base);
    expect(r.wholesalePrice).toBeCloseTo(379.5, 2); // 330 * 1.15
    expect(r.maxDiscountPct).toBeCloseTo(30, 1); // margin == max discount to break-even
  });

  it('adds VAT on top when provided', () => {
    const withVat = calcSellingPrice({ ...base, vatPct: 10 });
    expect(withVat.breakEvenPrice).toBeCloseTo(363, 2); // 330 * 1.1
    expect(withVat.operatingCostAmount).toBe(30);
    expect(withVat.vatAmount).toBeCloseTo(47.14, 2);
  });

  it('uses an editable wholesale markup', () => {
    const r = calcSellingPrice({ ...base, wholesaleMarginPct: 25 });
    expect(r.wholesalePrice).toBeCloseTo(412.5, 2);
  });

  it('normalizes negative costs and percentages', () => {
    const r = calcSellingPrice({
      ...base,
      productCost: -300,
      overheadPct: -10,
      vatPct: -7.5,
      wholesaleMarginPct: -15,
    });
    expect(r.operatingCostAmount).toBe(0);
    expect(r.costWithOverhead).toBe(0);
    expect(r.targetPrice).toBe(0);
    expect(r.wholesalePrice).toBe(0);
  });

  it('keeps target and retail margins below 100%', () => {
    const r = calcSellingPrice({
      ...base,
      targetMarginPct: 100,
      retailMarginPct: 150,
    });
    expect(Number.isFinite(r.targetPrice)).toBe(true);
    expect(Number.isFinite(r.retailPrice)).toBe(true);
    expect(r.targetPrice).toBe(330000);
    expect(r.retailPrice).toBe(330000);
  });
});
