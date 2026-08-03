import { describe, it, expect } from 'vitest';
import { calcAdsBreakeven, type AdsInput } from './ads-breakeven';

const base: AdsInput = {
  sellingPrice: 800,
  productCost: 300,
  fulfillmentCost: 110,
  returnRatePct: 20,
  returnCostPerReturn: 90,
  currentCpp: 150,
};

describe('calcAdsBreakeven', () => {
  it('computes margin, max CPP and break-even ROAS with return drag', () => {
    const r = calcAdsBreakeven(base);
    expect(r.marginPerDelivered).toBe(390); // 800-300-110
    expect(r.maxCpp).toBeCloseTo(294, 2); // 0.8*390 - 0.2*90
    expect(r.breakEvenRoas).toBeCloseTo(2.72, 2); // 800/294
  });

  it('evaluates the current campaign and reports actual ROAS', () => {
    const r = calcAdsBreakeven(base);
    expect(r.current?.profitPerOrder).toBeCloseTo(144, 2); // 294-150
    expect(r.current?.profitable).toBe(true);
    expect(r.current?.reportedRoas).toBeCloseTo(5.33, 2); // 800/150
    expect(r.current?.actualRoas).toBeCloseTo(4.27, 2); // 0.8*5.33
    expect(r.current?.verdict).toBe('keep_running');
  });

  it('flags an unprofitable campaign when CPP exceeds max', () => {
    const r = calcAdsBreakeven({ ...base, currentCpp: 350 });
    expect(r.current?.profitable).toBe(false);
    expect(r.current?.profitPerOrder).toBeLessThan(0);
    expect(r.current?.verdict).toBe('stop');
  });

  it('recommends optimization when profitable CPP is close to break-even', () => {
    const r = calcAdsBreakeven({ ...base, currentCpp: 280 });
    expect(r.current?.profitable).toBe(true);
    expect(r.current?.verdict).toBe('optimize');
  });

  it('reports a distinct verdict at break-even', () => {
    const r = calcAdsBreakeven({ ...base, currentCpp: 294 });
    expect(r.current?.profitPerOrder).toBe(0);
    expect(r.current?.verdict).toBe('break_even');
  });

  it('omits the current block when no CPP is given', () => {
    const { currentCpp, ...noCpp } = base;
    expect(calcAdsBreakeven(noCpp).current).toBeUndefined();
  });

  it('computes break-even sales/day from a daily ad budget', () => {
    const r = calcAdsBreakeven({ ...base, dailyAdBudget: 2940 }); // maxCpp 294
    expect(r.breakEvenSalesPerDay).toBe(10); // ceil(2940 / 294)
  });

  it('normalizes negative costs and budgets and clamps return rate', () => {
    const r = calcAdsBreakeven({
      ...base,
      sellingPrice: -800,
      productCost: -300,
      fulfillmentCost: -110,
      returnRatePct: 120,
      returnCostPerReturn: -90,
      currentCpp: -150,
      dailyAdBudget: -5000,
    });
    expect(r.marginPerDelivered).toBe(0);
    expect(r.maxCpp).toBe(0);
    expect(r.current).toBeUndefined();
    expect(r.breakEvenSalesPerDay).toBeUndefined();
  });
});
