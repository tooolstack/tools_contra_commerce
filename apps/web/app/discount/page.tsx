import type { Metadata } from 'next';
import { DiscountCalculator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Discount Calculator — Contra Commerce (Free)',
  description:
    'See your discounted price, how much you save, whether it is still profitable, and a 20/30/40% comparison so a discount never tips into a loss. Free tool.',
  alternates: { canonical: getToolUrl('discount') },
};

export default function DiscountPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">
          Free Tools
        </a>{' '}
        / Discount Calculator
      </nav>

      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Discount Calculator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Planning an offer? Check the discounted price, your profit after the discount, and compare
          20/30/40% side by side so you never discount your way into a loss.
        </p>
      </header>

      <DiscountCalculator
        brand="Contra Commerce"
        ctaText="Run profitable campaigns in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />

      <section className="mt-12 max-w-2xl text-sm leading-relaxed text-gray-600">
        <h2 className="text-lg font-semibold text-gray-900">How is it calculated?</h2>
        <p className="mt-2">
          Discounted price = regular price × (1 − discount%). Profit is that price minus product,
          packaging, fulfillment and operating cost per item. Buy X/Get Y uses the regular price
          for the paid items—the main percentage discount is not stacked on top. The comparison
          table shows margin and a clear Profit, Break-even or Loss status.
        </p>
      </section>
    </main>
  );
}
