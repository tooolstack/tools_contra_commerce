import type { Metadata } from 'next';
import { QrGenerator } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Business QR Code Generator — Contra Commerce (Free)',
  description:
    'Generate QR codes for your website, product, WhatsApp, phone or payment and download them as PNG. Free QR tool for businesses.',
  alternates: { canonical: getToolUrl('qr-generator') },
};

export default function QrGeneratorPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / QR Code Generator
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Free Tool</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Business QR Code Generator</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Turn your website, WhatsApp, phone or any text into a scannable QR code — download it as a
          PNG and print it on packaging, cards or ads.
        </p>
      </header>
      <QrGenerator
        brand="Contra Commerce"
        ctaText="Generate branded QR codes in Contra Commerce"
        ctaUrl="https://app.contracommerce.com/signup"
      />
    </main>
  );
}
