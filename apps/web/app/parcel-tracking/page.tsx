import type { Metadata } from 'next';
import { ParcelTracking } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Courier Parcel Tracking Hub — Contra Commerce (Free)',
  description:
    'Track parcels from multiple Bangladesh couriers in one place. Paste your tracking numbers and see every status together. Free tool.',
  alternates: { canonical: getToolUrl('parcel-tracking') },
};

export default function ParcelTrackingPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / Parcel Tracking Hub
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Courier Parcel Tracking Hub</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Paste tracking numbers from any courier and see all your parcel statuses in one place —
          no more juggling five different tracking pages.
        </p>
      </header>
      <ParcelTracking
        brand="Contra Commerce"
        ctaText="Auto-track every parcel and notify customers with Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
        settingsUrl={`${getHubUrl()}/courier-settings`}
      />
    </main>
  );
}
