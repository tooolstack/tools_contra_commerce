import { describe, it, expect } from 'vitest';
import { calcDeadStock } from './dead-stock';
import { calcSizeRatio, SIZE_PRESETS } from './size-ratio';
import { calcCodSettlement } from './cod-settlement';
import { buildWhatsappLink, normalizeBdPhone } from './whatsapp-link';

describe('calcDeadStock', () => {
  const r = calcDeadStock({
    stockQty: 100,
    purchasePrice: 200,
    currentSellingPrice: 300,
    daysHeld: 60,
    monthlyCarryingCostPct: 3,
  });
  it('computes tied capital and carrying cost', () => {
    expect(r.tiedCapital).toBe(20000);
    expect(r.monthlyCarryingCost).toBe(600);
    expect(r.carryingCostToDate).toBe(1200); // 600 * 60/30
  });
  it('computes safe discount and liquidation price', () => {
    expect(r.maxSafeDiscountPct).toBeCloseTo(33.33, 2);
    expect(r.suggestedLiquidationPrice).toBe(180);
  });
  it('computes bundle price and sell-now vs wait', () => {
    // defaults: bundle size 3, 25% off; price 300, so bundle = 3×300×0.75
    expect(r.bundle.price).toBe(675);
    expect(r.bundle.perUnit).toBe(225);
    expect(r.comparison.sellNowValue).toBe(18000); // 100 × 180
    expect(typeof r.comparison.sellNowBetter).toBe('boolean');
  });
});

describe('calcSizeRatio', () => {
  it("splits exactly with a men's t-shirt preset", () => {
    const r = calcSizeRatio({ totalQty: 100, ratio: SIZE_PRESETS['men-tshirt'].ratio });
    expect(r.rows.map((x) => x.qty)).toEqual([10, 30, 30, 20, 10]);
    expect(r.total).toBe(100);
  });
  it('always sums back to the total (largest remainder)', () => {
    const r = calcSizeRatio({
      totalQty: 7,
      ratio: [
        { size: 'A', weight: 1 },
        { size: 'B', weight: 1 },
        { size: 'C', weight: 1 },
      ],
    });
    expect(r.total).toBe(7);
  });
});

describe('calcCodSettlement', () => {
  const r = calcCodSettlement({
    totalCollected: 100000,
    codChargePct: 1,
    deliveredParcels: 200,
    deliveryChargePerParcel: 70,
    returnedParcels: 20,
    returnChargePerParcel: 50,
    adjustments: -500,
  });
  it('computes deductions and net payable', () => {
    expect(r.codCharge).toBe(1000);
    expect(r.deliveryCharges).toBe(14000);
    expect(r.returnCharges).toBe(1000);
    expect(r.totalDeductions).toBe(16000);
    expect(r.netPayable).toBe(83500); // 100000 - 16000 - 500
    expect(r.effectiveChargePct).toBe(16);
  });
});

describe('whatsapp-link', () => {
  it('normalises BD numbers to international format', () => {
    expect(normalizeBdPhone('01712345678')).toBe('8801712345678');
    expect(normalizeBdPhone('+8801712345678')).toBe('8801712345678');
    expect(normalizeBdPhone('8801712345678')).toBe('8801712345678');
  });
  it('builds a valid wa.me link with a prefilled message', () => {
    const r = buildWhatsappLink({ phone: '01712345678', product: 'Polo Shirt', price: '850' });
    expect(r.valid).toBe(true);
    expect(r.link.startsWith('https://wa.me/8801712345678?text=')).toBe(true);
    expect(r.message).toContain('Polo Shirt');
  });
  it('flags an invalid number', () => {
    expect(buildWhatsappLink({ phone: '12345', product: 'x' }).valid).toBe(false);
  });
});
