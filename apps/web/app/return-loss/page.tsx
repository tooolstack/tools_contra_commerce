import type { Metadata } from 'next';
import { ReturnLossCalculator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Courier Return Loss Calculator — Contra Commerce (Free)',
  description:
    'See exactly how much courier returns (RTO) cost your business per month and per year — and how much a 5 percentage-point delivery success lift would save. Free tool.',
  alternates: { canonical: getToolUrl('return-loss') },
};

export default function ReturnLossPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">
          Free Tools
        </a>{' '}
        / Courier Return Loss
      </nav>

      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Courier Return Loss Calculator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Every return costs you forward charge, return charge and packaging — with no sale to show
          for it. See the real monthly and yearly damage, and what a small success-rate lift saves.
        </p>
      </header>

      <ReturnLossCalculator
        brand="Contra Commerce"
        ctaText="Cut returns with order verification in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />

      <section className="mt-12 max-w-2xl text-sm leading-relaxed text-gray-600">
        <h2 className="text-lg font-semibold text-gray-900">How is it calculated?</h2>
        <p className="mt-2">
          Returned parcels = monthly parcels × (100% − success rate). Each one costs forward +
          return + packaging. The savings projection models an improvement of up to 5 percentage
          points—for example, from 80% to 85%—without exceeding a 100% success rate.
        </p>
      </section>
    </main>
  );
}
