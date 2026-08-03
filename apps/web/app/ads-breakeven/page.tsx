import type { Metadata } from 'next';
import { AdsBreakeven } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Facebook Ads Break-even Calculator — Contra Commerce (Free)',
  description:
    'Find your maximum cost per purchase, break-even ROAS, and your real ROAS after returns. A free tool for Bangladeshi e-commerce advertisers.',
  alternates: { canonical: getToolUrl('ads-breakeven') },
};

export default function AdsBreakevenPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">
          Free Tools
        </a>{' '}
        / Facebook Ads Break-even
      </nav>

      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Facebook Ads Break-even Calculator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          How much can you pay per purchase and still profit? What ROAS breaks even? And what is
          your <em>real</em> ROAS once returns are counted? Find out below.
        </p>
      </header>

      <AdsBreakeven
        brand="Contra Commerce"
        ctaText="Track real ROAS after returns automatically in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />

      <section className="mt-12 max-w-2xl text-sm leading-relaxed text-gray-600">
        <h2 className="text-lg font-semibold text-gray-900">How is it calculated?</h2>
        <p className="mt-2">
          A Facebook &quot;purchase&quot; is an order placed — but some orders get returned. So the
          money you can afford to pay per purchase must absorb that return drag. Keep your cost per
          purchase below the break-even figure and every extra order is profit. The daily target is
          therefore purchases/orders placed—not delivered orders—and the return drag is already
          included. Add current CPP for actual ROAS and a campaign verdict; add daily budget for the
          purchases-per-day target.
        </p>
      </section>
    </main>
  );
}
