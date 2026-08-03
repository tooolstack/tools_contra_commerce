import type { Metadata } from 'next';
import { AdCopyGenerator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Facebook Ad Copy Generator — Contra Commerce (Free)',
  description:
    'Generate ready-to-post Facebook ad copy — headline, primary text, CTA and caption — for your products. Free tool for Bangladeshi sellers.',
  alternates: { canonical: getToolUrl('ad-copy') },
};

export default function AdCopyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Ad Copy Generator
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Facebook Ad Copy Generator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Describe your product and offer — get a complete Facebook ad you can copy and post in
          seconds.
        </p>
      </header>
      <AdCopyGenerator
        brand="Contra Commerce"
        ctaText="Generate unlimited ad copy inside Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
