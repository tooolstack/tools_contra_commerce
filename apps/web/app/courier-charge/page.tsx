import type { Metadata } from 'next';
import { CourierChargeComparison } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Courier Charge Comparison — Contra Commerce (Free)',
  description:
    'Compare estimated delivery and COD charges across Steadfast, Pathao, RedX and Paperfly by zone, weight and COD amount. Free comparison tool.',
  alternates: { canonical: getToolUrl('courier-charge') },
};

export default function CourierChargePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Courier Charge Comparison
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Courier Charge Comparison</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Enter the customer location, parcel weight and COD amount. We detect the rate zone,
          compare delivered and returned costs, and show where every estimate came from.
        </p>
      </header>
      <CourierChargeComparison
        brand="Contra Commerce"
        ctaText="Book the cheapest courier in one click"
        ctaUrl="https://app.contracommerce.com/login?next=%2Fcouriers%2Fbook"
        ratesEndpoint="/api/courier-rates"
        bookingStatusEndpoint="/api/courier-booking-status"
        bookingEndpoint="/api/courier-book"
      />
    </main>
  );
}
