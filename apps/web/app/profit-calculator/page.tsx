import type { Metadata } from 'next';
import { ProfitCalculator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'E-commerce Profit Calculator — Contra Commerce (Free)',
  description:
    'Find your real profit per order — including COD, returns, ads and courier charges. A completely free tool for Bangladeshi e-commerce businesses.',
  // The subdomain is this page's canonical URL — reduces duplicate-content risk.
  alternates: { canonical: getToolUrl('profit-calculator') },
};

export default function ProfitCalculatorPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        {/* The hub is a separate subdomain (tools.…), so an absolute link. */}
        <a href={getHubUrl()} className="hover:text-gray-900">
          Free Tools
        </a>{' '}
        / Profit Calculator
      </nav>

      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">E-commerce Profit Calculator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Factor in COD charges, return rate, ads and courier costs to see your real profit
          per delivered order — right now.
        </p>
      </header>

      <ProfitCalculator
        brand="Contra Commerce"
        ctaText="This isn't a spreadsheet — see it live in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />

      <section className="mt-12 max-w-2xl text-sm leading-relaxed text-gray-600">
        <h2 className="text-lg font-semibold text-gray-900">How is it calculated?</h2>
        <p className="mt-2">
          When an order is returned you still spend on ads, packaging and the courier&apos;s
          forward/return charges — even though there&apos;s no sale. So this tool spreads the
          cost of returns across your delivered orders to show your <em>real</em> profit —
          not just simple subtraction.
        </p>
        <p className="mt-2">
          By default it assumes returned products go back to sellable stock (so product cost
          is counted only on delivered orders). Turn off “Returned product can be resold” for
          perishable, damaged, or otherwise unsellable goods. Choose percentage or fixed COD
          charge to match your courier&apos;s billing method. Monthly return loss appears when
          monthly total orders is provided.
        </p>
      </section>
    </main>
  );
}
