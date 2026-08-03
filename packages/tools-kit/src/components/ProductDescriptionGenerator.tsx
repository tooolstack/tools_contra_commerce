'use client';

import { useState } from 'react';
import {
  CopyField,
  CtaCard,
  InputCard,
  OutputBox,
  ResultsColumn,
  TextArea,
  TextField,
  type ToolProps,
} from './ui';

export type ProductDescriptionGeneratorProps = ToolProps & {
  /** API endpoint (default: /api/product-description) */
  endpoint?: string;
};

type ProductDesc = {
  demo?: boolean;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  seoTitle: string;
  metaDescription: string;
  facebookCaption?: string;
};

export function ProductDescriptionGenerator({
  brand = 'Contra Commerce',
  ctaText = 'Publish straight to your Contra Commerce store',
  ctaUrl = '#',
  className = '',
  endpoint = '/api/product-description',
}: ProductDescriptionGeneratorProps) {
  const [product, setProduct] = useState('Premium Polo Shirt');
  const [details, setDetails] = useState('100% cotton, 5 colours, sizes S–XXL');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductDesc | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(f);
  };

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ product, details, image }),
      });
      setResult((await res.json()) as ProductDesc);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`grid items-start gap-6 lg:grid-cols-2 ${className}`}>
      <InputCard title="Product details">
        <TextField label="Product name" value={product} onChange={setProduct} />
        <TextArea label="Details / features" value={details} onChange={setDetails} rows={4} />
        <label className="block">
          <span className="mb-1 block text-sm text-gray-700">Product image (optional)</span>
          <input type="file" accept="image/*" onChange={onFile} className="block w-full text-xs text-gray-500" />
        </label>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="Product" className="max-h-28 rounded-lg border border-gray-200" />
        )}
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Generating…' : '✨ Generate description'}
        </button>
      </InputCard>

      <ResultsColumn>
        {result ? (
          <OutputBox title={result.demo ? 'Generated content (demo)' : 'Generated content'}>
            {result.demo && (
              <p className="mb-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                Demo output — connect an AI key for tailored content (and image reading).
              </p>
            )}
            <div className="space-y-2">
              <CopyField label="Title" value={result.title} />
              <CopyField label="Short description" value={result.shortDescription} />
              <CopyField label="Full description" value={result.fullDescription} />
              <CopyField label="Features" value={result.features.map((f) => `• ${f}`).join('\n')} />
              <CopyField label="SEO title" value={result.seoTitle} />
              <CopyField label="Meta description" value={result.metaDescription} />
              {result.facebookCaption && <CopyField label="Facebook caption" value={result.facebookCaption} />}
            </div>
            <a
              href={ctaUrl}
              className="mt-3 block rounded-xl bg-ink p-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Publish to {brand} store →
            </a>
          </OutputBox>
        ) : (
          <OutputBox title="Generated content">
            <p className="py-8 text-center text-sm text-gray-400">
              Enter your product (or upload an image) and hit generate.
            </p>
          </OutputBox>
        )}
        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </div>
  );
}
