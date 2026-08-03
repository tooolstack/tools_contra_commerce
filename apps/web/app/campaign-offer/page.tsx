import type { Metadata } from 'next';
import { CampaignOfferBuilder } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Campaign Offer Builder — Contra Commerce (Free)',
  description:
    'Pick a campaign goal and instantly get offer pricing plus ready-to-post headline, body and CTA copy. Free marketing tool for online sellers.',
  alternates: { canonical: getToolUrl('campaign-offer') },
};

export default function CampaignOfferPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Campaign Offer Builder
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Campaign Offer Builder</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Choose your goal — clearance, Eid, flash sale, bundle — and get the offer price plus
          ready-to-post promotional copy in one click.
        </p>
      </header>
      <CampaignOfferBuilder
        brand="Contra Commerce"
        ctaText="Launch campaigns in minutes with Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
