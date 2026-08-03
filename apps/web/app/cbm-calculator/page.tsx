import type { Metadata } from 'next';
import { CbmCalculator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Import Landing Cost & CBM Calculator — Contra Commerce (Free)',
  description:
    'Calculate total CBM, freight cost, per-piece landed cost and suggested wholesale/retail prices for imports into Bangladesh. Free tool for importers.',
  alternates: { canonical: getToolUrl('cbm-calculator') },
};

export default function CbmCalculatorPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">
          Free Tools
        </a>{' '}
        / Import CBM Calculator
      </nav>

      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Import Landing Cost &amp; CBM Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Shipping from China or abroad? Work out total shipment volume (CBM), freight, your true
          per-piece landed cost, and where to set wholesale and retail prices.
        </p>
      </header>

      <CbmCalculator
        brand="Contra Commerce"
        ctaText="Manage import costs and pricing in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />

      <section className="mt-12 max-w-2xl text-sm leading-relaxed text-gray-600">
        <h2 className="text-lg font-semibold text-gray-900">How is it calculated?</h2>
        <p className="mt-2">
          CBM = carton length × width × height (in metres) × number of cartons. Freight is charged
          per CBM, so your landed cost per piece is goods + freight + customs/agent, divided across
          all units.
        </p>
      </section>
    </main>
  );
}
