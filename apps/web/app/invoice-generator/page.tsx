import type { Metadata } from 'next';
import { InvoiceGenerator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Free Invoice Generator & PDF Maker — Contra Commerce',
  description:
    'Create branded international invoices, packing slips and thermal receipts with automatic tax, discounts and totals. Save drafts and export PDF free.',
  alternates: { canonical: getToolUrl('invoice-generator') },
};

export default function InvoiceGeneratorPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Invoice Generator
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free · Private · No signup</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Professional Invoice Generator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Build a polished, branded invoice in any major currency. Your draft stays on this device,
          and you can print it, save it as PDF, or create a packing slip in one click.
        </p>
      </header>
      <InvoiceGenerator
        brand="Contra Commerce"
        ctaText="Ready to automate invoices for every order?"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
