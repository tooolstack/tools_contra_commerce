import { describe, it, expect } from 'vitest';
import { calcDiscount, type DiscountInput } from './discount';

const base: DiscountInput = {
  regularPrice: 1000,
  discountPct: 30,
  productCost: 500,
};

describe('calcDiscount', () => {
  it('computes discounted price and saved amount', () => {
    const r = calcDiscount(base);
    expect(r.discountedPrice).toBe(700); // 1000 * 0.7
    expect(r.savedAmount).toBe(300);
  });

  it('computes profit and margin after discount', () => {
    const r = calcDiscount(base);
    expect(r.profitAfterDiscount).toBe(200); // 700 - 500
    expect(r.profitMarginPct).toBeCloseTo(28.57, 2);
    expect(r.profitable).toBe(true);
    expect(r.status).toBe('profit');
  });

  it('builds the 20/30/40 comparison table', () => {
    const r = calcDiscount(base);
    expect(r.comparisons.map((c) => c.price)).toEqual([800, 700, 600]);
    expect(r.comparisons.map((c) => c.profit)).toEqual([300, 200, 100]);
  });

  it('flags a loss when the discount is too deep', () => {
    const r = calcDiscount({ ...base, discountPct: 60 });
    expect(r.profitable).toBe(false); // price 400 < cost 500
    expect(r.profitAfterDiscount).toBeLessThan(0);
    expect(r.status).toBe('loss');
  });

  it('reports exact break-even separately from a loss', () => {
    const r = calcDiscount({ ...base, discountPct: 50 });
    expect(r.profitAfterDiscount).toBe(0);
    expect(r.profitable).toBe(false);
    expect(r.status).toBe('break_even');
  });

  it('computes a Buy 2 Get 1 bundle offer', () => {
    const b = calcDiscount(base).bundle; // defaults: buy 2, get 1 free
    expect(b.itemsGiven).toBe(3);
    expect(b.customerPays).toBe(2000); // 2 × 1000
    expect(b.totalCost).toBe(1500); // 3 × 500
    expect(b.profit).toBe(500);
    expect(b.profitable).toBe(true);
    expect(b.status).toBe('profit');
    expect(b.effectiveDiscountPct).toBeCloseTo(33.33, 2);
    expect(b.perUnitPrice).toBeCloseTo(666.67, 2);
  });

  it('honours a custom bundle ratio', () => {
    const b = calcDiscount({ ...base, bundleBuyQty: 3, bundleFreeQty: 2 }).bundle;
    expect(b.itemsGiven).toBe(5);
    expect(b.effectiveDiscountPct).toBe(40); // 2 free of 5
  });

  it('includes packaging, fulfillment and operating cost in all profit checks', () => {
    const r = calcDiscount({ ...base, additionalCostPerUnit: 100 });
    expect(r.totalUnitCost).toBe(600);
    expect(r.profitAfterDiscount).toBe(100);
    expect(r.bundle.totalCost).toBe(1800);
    expect(r.bundle.profit).toBe(200);
    expect(r.comparisons.map((c) => c.profit)).toEqual([200, 100, 0]);
    expect(r.comparisons[2].status).toBe('break_even');
  });

  it('normalizes negative values, discount range and bundle quantities', () => {
    const r = calcDiscount({
      regularPrice: -1000,
      discountPct: 140,
      productCost: -500,
      additionalCostPerUnit: -100,
      bundleBuyQty: 0,
      bundleFreeQty: 1.8,
    });
    expect(r.discountedPrice).toBe(0);
    expect(r.totalUnitCost).toBe(0);
    expect(r.bundle.buyQty).toBe(1);
    expect(r.bundle.freeQty).toBe(1);
    expect(r.bundle.itemsGiven).toBe(2);
    expect(r.status).toBe('break_even');
  });
});
