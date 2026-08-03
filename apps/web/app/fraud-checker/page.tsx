import type { Metadata } from 'next';
import { FraudChecker } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'COD Order Risk Checker — Contra Commerce (Free)',
  description:
    "Check a customer's courier-wise delivery success, cancellation history and operational order risk before shipping a COD parcel.",
  alternates: { canonical: getToolUrl('fraud-checker') },
};

export default function FraudCheckerPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / COD Order Risk Checker
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">COD Order Risk Checker</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Check phone-based parcel receive score, courier-wise history and the recommended action
          for this order. This is an operational risk indicator—not proof of fraud.
        </p>
      </header>
      <FraudChecker
        brand="Contra Commerce"
        ctaText="Auto-verify every order with Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
