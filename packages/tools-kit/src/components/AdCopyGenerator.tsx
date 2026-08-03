'use client';

import { useState } from 'react';
import {
  CopyField,
  CtaCard,
  InputCard,
  OutputBox,
  ResultsColumn,
  TextField,
  type ToolProps,
} from './ui';

export type AdCopyGeneratorProps = ToolProps & {
  /** API endpoint that returns the generated copy (default: /api/ad-copy) */
  endpoint?: string;
};

type AdCopy = {
  demo?: boolean;
  headline: string;
  primaryText: string;
  cta: string;
  caption: string;
  offerCopy?: string;
  retargetingCopy?: string;
  videoHook?: string;
};

const DAILY_LIMIT = 10;

export function AdCopyGenerator({
  brand = 'Contra Commerce',
  ctaText = 'Generate unlimited ad copy inside Contra Commerce',
  ctaUrl = '#',
  className = '',
  endpoint = '/api/ad-copy',
}: AdCopyGeneratorProps) {
  const [product, setProduct] = useState('Premium Polo Shirt');
  const [audience, setAudience] = useState('Young men, 18–30');
  const [offer, setOffer] = useState('20% off this week');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdCopy | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  const generate = async () => {
    // Free daily limit — a light client-side guard.
    const key = `contra-adcopy-${new Date().toISOString().slice(0, 10)}`;
    const used = Number((typeof localStorage !== 'undefined' && localStorage.getItem(key)) || '0');
    if (used >= DAILY_LIMIT) {
      setLimitReached(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ product, audience, offer }),
      });
      setResult((await res.json()) as AdCopy);
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, String(used + 1));
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`grid items-start gap-6 lg:grid-cols-2 ${className}`}>
      <InputCard title="Product details">
        <TextField label="Product" value={product} onChange={setProduct} />
        <TextField label="Target audience" value={audience} onChange={setAudience} />
        <TextField label="Offer" value={offer} onChange={setOffer} />
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Generating…' : '✨ Generate ad copy'}
        </button>
        {limitReached && (
          <p className="text-xs text-amber-600">
            You've hit today's free limit ({DAILY_LIMIT}). Unlimited generations are available in {brand}.
          </p>
        )}
      </InputCard>

      <ResultsColumn>
        {result ? (
          <OutputBox title={result.demo ? 'Generated copy (demo)' : 'Generated copy'}>
            {result.demo && (
              <p className="mb-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                Demo output — connect an AI key for tailored copy.
              </p>
            )}
            <div className="space-y-2">
              <CopyField label="Headline" value={result.headline} />
              <CopyField label="Primary text" value={result.primaryText} />
              <CopyField label="Call to action" value={result.cta} />
              <CopyField label="Caption" value={result.caption} />
              {result.offerCopy && <CopyField label="Offer copy" value={result.offerCopy} />}
              {result.retargetingCopy && <CopyField label="Retargeting copy" value={result.retargetingCopy} />}
              {result.videoHook && <CopyField label="Video hook" value={result.videoHook} />}
            </div>
          </OutputBox>
        ) : (
          <OutputBox title="Generated copy">
            <p className="py-8 text-center text-sm text-gray-400">
              Fill in the details and hit generate.
            </p>
          </OutputBox>
        )}
        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </div>
  );
}
