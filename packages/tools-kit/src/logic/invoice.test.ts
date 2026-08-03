import { describe, expect, it } from 'vitest';
import { calcInvoice } from './invoice';

describe('calcInvoice', () => {
  it('calculates fixed discounts, tax, and delivery in accounting order', () => {
    expect(calcInvoice({
      items: [{ name: 'Design', qty: 2, price: 100 }],
      discount: 20,
      taxRate: 10,
      deliveryCharge: 5,
    })).toMatchObject({ subtotal: 200, discount: 20, taxableAmount: 180, tax: 18, grandTotal: 203 });
  });

  it('supports percentage discounts and clamps unsafe inputs', () => {
    expect(calcInvoice({
      items: [{ name: 'Service', qty: 1, price: 400 }],
      discount: 150,
      discountType: 'percent',
      taxRate: -5,
      deliveryCharge: -10,
    })).toMatchObject({ subtotal: 400, discount: 400, tax: 0, grandTotal: 0 });
  });
});
