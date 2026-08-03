import type { Metadata } from 'next';
import { PdfDocumentStudio } from '@contra/tools-kit';
import { getHubUrl, getToolUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'PDF & Document Studio — Merge, Split, Edit and Generate PDFs',
  description: 'A private browser-based PDF studio for merging, splitting, editing, signing, converting, comparing and generating professional documents.',
  alternates: { canonical: getToolUrl('pdf-document-studio') },
};

export default function PdfDocumentStudioPage() {
  return <main className="mx-auto max-w-7xl px-4 py-10"><nav className="mb-6 text-sm text-gray-500"><a href={getHubUrl()} className="hover:text-gray-900">Free Tools</a> / PDF & Document Studio</nav><header className="mb-8"><p className="text-sm font-medium text-blue-600">Free · Files stay on your device</p><h1 className="mt-1 text-3xl font-bold text-gray-950">PDF & Document Studio</h1><p className="mt-2 max-w-3xl text-gray-600">Merge, split, edit, convert, sign, clean, compare and generate professional PDF documents from one organized workspace.</p></header><PdfDocumentStudio invoiceUrl={getToolUrl('invoice-generator')}/></main>;
}
