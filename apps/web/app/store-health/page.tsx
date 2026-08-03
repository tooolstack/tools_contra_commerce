import type { Metadata } from 'next';
import { StoreHealthChecker } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Free Store Health Checker — Contra Commerce',
  description:
    'Enter your store URL and get a health score across HTTPS, mobile, SEO, trust signals and conversion basics — with a fix-it checklist. Free.',
  alternates: { canonical: getToolUrl('store-health') },
};

export default function StoreHealthPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Store Health Checker
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Free Store Health Checker</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Enter your store URL and get an instant score on the conversion and SEO signals that
          matter — plus a checklist of what to fix.
        </p>
      </header>
      <StoreHealthChecker
        brand="Contra Commerce"
        ctaText="Fix these issues automatically with Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
