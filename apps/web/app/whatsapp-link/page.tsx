import type { Metadata } from 'next';
import { WhatsappLinkGenerator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'WhatsApp Order Link Generator — Contra Commerce (Free)',
  description:
    'Create a wa.me link that opens WhatsApp with a pre-filled order message. Share it on Facebook, your page or ads. Free tool for Bangladeshi sellers.',
  alternates: { canonical: getToolUrl('whatsapp-link') },
};

export default function WhatsappLinkPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / WhatsApp Order Link
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">WhatsApp Order Link Generator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Turn any product into a one-tap order link. When customers click, WhatsApp opens with the
          order message already written — they just fill in size, colour and address.
        </p>
      </header>
      <WhatsappLinkGenerator
        brand="Contra Commerce"
        ctaText="Take orders on autopilot with Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
