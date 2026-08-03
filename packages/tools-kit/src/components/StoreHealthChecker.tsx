'use client';

import { useState } from 'react';
import {
  CtaCard,
  InputCard,
  OutputBox,
  ResultHero,
  ResultsColumn,
  TextField,
  type ToolProps,
} from './ui';

export type StoreHealthCheckerProps = ToolProps & {
  /** API endpoint (default: /api/store-health) */
  endpoint?: string;
};

type Check = { label: string; pass: boolean; detail: string };
type HealthResult = { url: string; reachable: boolean; score: number; passed?: number; total?: number; checks: Check[] };

export function StoreHealthChecker({
  brand = 'Contra Commerce',
  ctaText = 'Fix these issues automatically with Contra Commerce',
  ctaUrl = '#',
  className = '',
  endpoint = '/api/store-health',
}: StoreHealthCheckerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthResult | null>(null);

  const check = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      setResult((await res.json()) as HealthResult);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const good = (result?.score ?? 0) >= 60;

  return (
    <div className={`grid items-start gap-6 lg:grid-cols-2 ${className}`}>
      <InputCard title="Your store URL">
        <TextField label="Website" value={url} onChange={setUrl} placeholder="myshop.com" />
        <button
          type="button"
          onClick={check}
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Checking…' : 'Check my store'}
        </button>
        <p className="text-xs text-gray-400">We fetch your homepage and check common conversion &amp; SEO signals.</p>
      </InputCard>

      <ResultsColumn>
        {result ? (
          result.reachable ? (
            <>
              <ResultHero
                label="Store health score"
                value={`${result.score} / 100`}
                positive={good}
                sub={`${result.passed} of ${result.total} checks passed`}
              />
              <OutputBox title="Checklist">
                <div className="space-y-1.5">
                  {result.checks.map((c) => (
                    <div key={c.label} className="flex items-start gap-2 text-sm">
                      <span>{c.pass ? '✅' : '❌'}</span>
                      <span className="text-gray-700">
                        <b>{c.label}</b> — <span className="text-gray-500">{c.detail}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </OutputBox>
            </>
          ) : (
            <OutputBox title="Could not reach the site">
              <p className="py-6 text-center text-sm text-gray-500">
                We couldn&apos;t load that URL. Check the address and try again.
              </p>
            </OutputBox>
          )
        ) : (
          <OutputBox title="Store health score">
            <p className="py-8 text-center text-sm text-gray-400">Enter your store URL to run the check.</p>
          </OutputBox>
        )}
        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </div>
  );
}
