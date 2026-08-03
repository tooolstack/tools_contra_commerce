import { describe, expect, it } from 'vitest';
import {
  compareCourierCharges,
  detectCourierZone,
} from './courier-charge';

describe('detectCourierZone', () => {
  it('detects a same-district shipment as inside city', () => {
    expect(
      detectCourierZone({
        pickupDistrict: 'Dhaka',
        destinationDistrict: 'Dhaka',
        destinationArea: 'Dhanmondi',
      }),
    ).toBe('inside-city');
  });

  it('detects nearby Dhaka areas and districts as sub-city', () => {
    expect(
      detectCourierZone({
        pickupDistrict: 'Dhaka',
        destinationDistrict: 'Dhaka',
        destinationArea: 'Savar',
      }),
    ).toBe('sub-city');
    expect(
      detectCourierZone({
        pickupDistrict: 'Dhaka',
        destinationDistrict: 'Gazipur',
        destinationArea: 'Tongi',
      }),
    ).toBe('sub-city');
  });

  it('detects a different non-nearby district as outside city', () => {
    expect(
      detectCourierZone({
        pickupDistrict: 'Dhaka',
        destinationDistrict: 'Chattogram',
        destinationArea: 'Pahartali',
      }),
    ).toBe('outside-city');
  });
});

describe('compareCourierCharges', () => {
  it('uses Pathao weight tiers, inside-city COD, and no same-city return fee', () => {
    const result = compareCourierCharges({
      zone: 'inside-city',
      weightKg: 1.5,
      codAmount: 1000,
    });
    const pathao = result.quotes.find((quote) => quote.courier === 'Pathao');

    expect(pathao).toMatchObject({
      deliveryCharge: 90,
      codCharge: 5,
      deliveredTotal: 95,
      returnCharge: 0,
      returnTotal: 90,
    });
  });

  it('adds extra weight and 50% return charge for an outside-city Pathao parcel', () => {
    const result = compareCourierCharges({
      zone: 'outside-city',
      weightKg: 2.2,
      codAmount: 1000,
    });
    const pathao = result.quotes.find((quote) => quote.courier === 'Pathao');

    expect(pathao).toMatchObject({
      deliveryCharge: 195,
      codCharge: 10,
      deliveredTotal: 205,
      returnCharge: 97.5,
      returnTotal: 292.5,
    });
  });

  it('does not invent an additional Paperfly return charge', () => {
    const result = compareCourierCharges({
      zone: 'outside-city',
      weightKg: 1.5,
      codAmount: 1000,
    });
    const paperfly = result.quotes.find((quote) => quote.courier === 'Paperfly');

    expect(paperfly).toMatchObject({
      deliveryCharge: 160,
      codCharge: 10,
      deliveredTotal: 170,
      returnCharge: 0,
      returnTotal: 160,
    });
  });

  it('normalises negative weight and COD values defensively', () => {
    const result = compareCourierCharges({
      zone: 'inside-city',
      weightKg: -2,
      codAmount: -500,
    });

    expect(result.weightKg).toBe(0.1);
    expect(result.codAmount).toBe(0);
    expect(result.quotes.every((quote) => quote.codCharge === 0)).toBe(true);
    expect(result.quotes.every((quote) => quote.deliveryCharge >= 0)).toBe(true);
  });

  it('sorts by delivered total and exposes source/review metadata', () => {
    const result = compareCourierCharges({
      zone: 'outside-city',
      weightKg: 1,
      codAmount: 1000,
    });

    expect(result.quotes[0].courier).toBe('RedX');
    expect(result.cheapest).toBe('RedX');
    expect(
      result.quotes.every(
        (quote) => quote.sourceLabel && quote.sourceUrl && quote.asOf,
      ),
    ).toBe(true);
  });
});
