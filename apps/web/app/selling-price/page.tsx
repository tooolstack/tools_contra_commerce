import type { Metadata } from 'next';
import { SellingPriceCalculator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Product Selling Price Calculator — Contra Commerce (Free)',
  description:
    'Work out your break-even, target, wholesale and retail prices from cost, overhead and target margin — plus how deep a discount stays safe. Free pricing tool.',
  alternates: { canonical: getToolUrl('selling-price') },
};

export default function SellingPricePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">
          Free Tools
        </a>{' '}
        / Selling Price
      </nav>

      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Product Selling Price Calculator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Enter your cost, overhead and the profit margin you want. Get your break-even, wholesale,
          retail price and the maximum discount you can run without losing money.
        </p>
      </header>

      <SellingPriceCalculator
        brand="Contra Commerce"
        ctaText="Set prices and track margins live in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />

      <section className="mt-12 max-w-2xl text-sm leading-relaxed text-gray-600">
        <h2 className="text-lg font-semibold text-gray-900">How is it calculated?</h2>
        <p className="mt-2">
          Cost with overhead sets your floor. The target price is cost ÷ (1 − margin), so a 30%
          margin means the price must be high enough that profit is 30% of it — not just 30% added
          on top. Wholesale markup is different: it is added directly on top of product plus
          operating cost. VAT is then added to the applicable prices and shown separately in the
          breakdown.
        </p>
      </section>
    </main>
  );
}
