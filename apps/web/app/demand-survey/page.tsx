import type { Metadata } from 'next';
import { DemandSurveyMaker } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Product Demand Survey Maker — Contra Commerce (Free)',
  description:
    'Build a shareable poll to test demand for a product before you stock it. Share on Facebook or WhatsApp — anyone can vote, no login. Free.',
  alternates: { canonical: getToolUrl('demand-survey') },
};

export default function DemandSurveyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Demand Survey Maker
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Product Demand Survey Maker</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Not sure what to stock? Build a quick poll, share the link on Facebook or WhatsApp, and
          let customers tell you what they want before you buy inventory.
        </p>
      </header>
      <DemandSurveyMaker
        brand="Contra Commerce"
        ctaText="Turn demand into pre-orders with Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
