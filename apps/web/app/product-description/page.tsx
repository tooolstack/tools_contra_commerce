import type { Metadata } from 'next';
import { ProductDescriptionGenerator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Product Description Generator — Contra Commerce (Free)',
  description:
    'Generate a product title, short and full descriptions, feature bullets and SEO meta — ready to publish to your store. Free tool.',
  alternates: { canonical: getToolUrl('product-description') },
};

export default function ProductDescriptionPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Product Description
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Product Description Generator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Enter your product and a few details — get a polished title, descriptions, features and
          SEO meta you can publish right away.
        </p>
      </header>
      <ProductDescriptionGenerator
        brand="Contra Commerce"
        ctaText="Publish straight to your Contra Commerce store"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
