import type { Metadata } from 'next';
import { DeadStockCalculator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Dead Stock Recovery Calculator — Contra Commerce (Free)',
  description:
    'See how much capital is trapped in slow-moving stock, what it costs to keep holding it, and how deep a discount still recovers your cost. Free tool.',
  alternates: { canonical: getToolUrl('dead-stock') },
};

export default function DeadStockPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Dead Stock Recovery
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Dead Stock Recovery Calculator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Slow-moving stock quietly eats capital. See how much is tied up, what holding it costs
          each month, and the safe discount to move it fast.
        </p>
      </header>
      <DeadStockCalculator
        brand="Contra Commerce"
        ctaText="Spot and clear dead stock in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
