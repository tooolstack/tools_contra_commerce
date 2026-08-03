import { describe, it, expect } from 'vitest';
import { calcProfit, type ProfitInput } from './profit';

const base: ProfitInput = {
  productCost: 300,
  sellingPrice: 800,
  adCostPerOrder: 120,
  forwardCharge: 70,
  returnCharge: 70,
  packagingCost: 20,
  codChargePct: 1,
  returnRatePct: 20,
  monthlyOrders: 500,
};

describe('calcProfit', () => {
  it('absorbs return drag into net profit per delivered order', () => {
    const r = calcProfit(base);
    expect(r.deliveryRate).toBeCloseTo(0.8, 5);
    expect(r.netProfitPerDelivered).toBeCloseTo(212, 1);
  });

  it('computes break-even price and max acceptable ad cost', () => {
    const r = calcProfit(base);
    expect(r.breakEvenPrice).toBeCloseTo(585.86, 1);
    expect(r.maxAdCostPerOrder).toBeCloseTo(289.6, 1);
  });

  it('supports a fixed COD charge per delivered order', () => {
    const r = calcProfit({
      ...base,
      codChargeMode: 'fixed',
      codChargeFixed: 10,
    });
    expect(r.netProfitPerDelivered).toBeCloseTo(210, 1);
    expect(r.breakEvenPrice).toBeCloseTo(590, 1);
    expect(r.maxAdCostPerOrder).toBeCloseTo(288, 1);
  });

  it('defaults to percentage COD for backwards compatibility', () => {
    const legacy = calcProfit(base);
    const explicit = calcProfit({ ...base, codChargeMode: 'percentage' });
    expect(legacy).toEqual(explicit);
  });

  it('projects monthly profit and return loss when monthlyOrders is given', () => {
    const r = calcProfit(base);
    expect(r.monthly?.deliveredOrders).toBe(400);
    expect(r.monthly?.returnedOrders).toBe(100);
    expect(r.monthly?.netProfit).toBeCloseTo(84800, 0);
    expect(r.monthly?.returnLoss).toBeCloseTo(28000, 0);
  });

  it('omits monthly projections when monthlyOrders is absent', () => {
    const { monthlyOrders, ...noMonthly } = base;
    const r = calcProfit(noMonthly);
    expect(r.monthly).toBeUndefined();
  });

  it('flags a loss when ad cost is too high', () => {
    const r = calcProfit({ ...base, adCostPerOrder: 400 });
    expect(r.netProfitPerDelivered).toBeLessThan(0);
  });

  it('charges full product cost on returns for non-recoverable goods', () => {
    const recovered = calcProfit(base);
    const perishable = calcProfit({ ...base, productRecoveredOnReturn: false });
    expect(perishable.netProfitPerDelivered).toBeLessThan(
      recovered.netProfitPerDelivered,
    );
  });
});
