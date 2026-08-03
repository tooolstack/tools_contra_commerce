import type { Metadata } from 'next';
import { CodSettlementCalculator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'COD Settlement Calculator — Contra Commerce (Free)',
  description:
    'Work out exactly how much you receive from your courier after COD fees, delivery charges, return charges and adjustments. Free reconciliation tool.',
  alternates: { canonical: getToolUrl('cod-settlement') },
};

export default function CodSettlementPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / COD Settlement
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">COD Settlement Calculator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Enter the numbers from your courier statement and see your true net payout — so you can
          check it against what actually lands in your account.
        </p>
      </header>
      <CodSettlementCalculator
        brand="Contra Commerce"
        ctaText="Reconcile every courier payout in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
