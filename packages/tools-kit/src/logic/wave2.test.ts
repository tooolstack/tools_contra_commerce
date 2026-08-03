import { describe, it, expect } from 'vitest';
import { calcInvoice } from './invoice';
import { buildQrContent } from './qr';
import { buildCampaignOffer } from './campaign-offer';
import { compareCourierCharges } from './courier-charge';
import { parseAddress } from './address-formatter';

describe('calcInvoice', () => {
  it('computes line totals, subtotal and grand total', () => {
    const r = calcInvoice({
      items: [
        { name: 'A', qty: 2, price: 500 },
        { name: 'B', qty: 1, price: 300 },
      ],
      deliveryCharge: 70,
      discount: 100,
    });
    expect(r.subtotal).toBe(1300);
    expect(r.grandTotal).toBe(1270); // 1300 + 70 - 100
    expect(r.totalItems).toBe(3);
  });
});

describe('buildQrContent', () => {
  it('builds the right payload per type', () => {
    expect(buildQrContent({ type: 'url', value: 'contracommerce.com' })).toBe('https://contracommerce.com');
    expect(buildQrContent({ type: 'url', value: 'http://x.com' })).toBe('http://x.com');
    expect(buildQrContent({ type: 'whatsapp', value: '01712345678' })).toBe('https://wa.me/8801712345678');
    expect(buildQrContent({ type: 'phone', value: '01712345678' })).toBe('tel:01712345678');
    expect(buildQrContent({ type: 'payment', value: '01712345678' })).toBe('bKash/Nagad Personal: 01712345678');
    expect(buildQrContent({ type: 'text', value: 'hello' })).toBe('hello');
  });
});

describe('buildCampaignOffer', () => {
  it('builds offer price and copy', () => {
    const r = buildCampaignOffer({ goal: 'flash-sale', product: 'Polo', originalPrice: 1000, discountPct: 30 });
    expect(r.offerPrice).toBe(700);
    expect(r.saved).toBe(300);
    expect(r.headline).toContain('30% OFF Polo');
    expect(r.body).toContain('700');
  });
});

describe('compareCourierCharges', () => {
  it('quotes couriers and finds the cheapest', () => {
    const r = compareCourierCharges({ zone: 'inside-city', weightKg: 1.5, codAmount: 1000 });
    expect(r.quotes[0].courier).toBe('Paperfly');
    expect(r.quotes[0].total).toBe(90); // 70 + 15 extra weight + 5 COD
    expect(r.quotes[0].returnCharge).toBe(0);
    expect(r.quotes[0].returnTotal).toBe(85); // no additional return fee
    expect(r.cheapest).toBe('Paperfly');
  });
});

describe('parseAddress', () => {
  it('extracts name, phone and district', () => {
    const r = parseAddress({
      raw: 'Rahim Uddin, 01712345678, House 5, Road 3, Dhanmondi, Dhaka',
    });
    expect(r.phone).toBe('01712345678');
    expect(r.district).toBe('Dhaka');
    expect(r.name).toBe('Rahim Uddin');
    expect(r.area).toBe('Dhanmondi');
    expect(r.warnings).toHaveLength(0);
  });
  it('extracts thana and landmark when present', () => {
    const r = parseAddress({ raw: 'Karim, 01812345678, Road 1, Gulshan Thana, near City Bank, Dhaka' });
    expect(r.thana).toBe('Gulshan');
    expect(r.landmark.toLowerCase()).toContain('city bank');
  });
  it('warns about missing pieces', () => {
    const r = parseAddress({ raw: 'just some random text' });
    expect(r.warnings).toContain('No phone number found');
    expect(r.warnings).toContain('District not recognised');
  });
});
