import type { Metadata } from 'next';
import { SizeRatioCalculator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Sales-Based Size Ratio Calculator — Contra Commerce',
  description:
    'Forecast a size-level purchase using delivered sales, fit-related returns, stockout days and current inventory—or enter your own transparent ratio.',
  alternates: { canonical: getToolUrl('size-ratio') },
};

export default function SizeRatioPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Size Ratio
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Sales-Based Size Ratio Calculator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Turn your delivered sales, size-related returns, stock availability and current inventory
          into an explainable purchase plan that always adds up to your supplier order.
        </p>
      </header>
      <SizeRatioCalculator
        brand="Contra Commerce"
        ctaText="Plan your inventory in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
