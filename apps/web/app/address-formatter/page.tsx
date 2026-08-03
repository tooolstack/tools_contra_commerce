import type { Metadata } from 'next';
import { AddressFormatter } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Bangladesh Address Formatter — Contra Commerce (Free)',
  description:
    'Paste a messy customer address and get clean, structured fields — name, phone, district and full address — with warnings for anything missing. Free tool.',
  alternates: { canonical: getToolUrl('address-formatter') },
};

export default function AddressFormatterPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Address Formatter
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Bangladesh Address Formatter</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Customers paste addresses any which way. Drop the mess in here and get clean name, phone,
          district and address fields — ready to copy into your courier panel.
        </p>
      </header>
      <AddressFormatter
        brand="Contra Commerce"
        ctaText="Clean every order address automatically in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
