import type { Metadata } from 'next';
import { NameChecker } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Business Name & Domain Checker — Contra Commerce (Free)',
  description:
    'Generate brand name ideas and slogans from your keyword and check .com domain availability live. Free naming tool for new businesses.',
  alternates: { canonical: getToolUrl('name-checker') },
};

export default function NameCheckerPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Name &amp; Domain Checker
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Business Name &amp; Domain Checker</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Enter your niche and get brand name ideas, slogans and live domain availability — all in
          one place.
        </p>
      </header>
      <NameChecker
        brand="Contra Commerce"
        ctaText="Found a name? Launch your free store on Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
