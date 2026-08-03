'use client';

import { useState } from 'react';
import {
  CtaCard,
  InputCard,
  OutputBox,
  ResultsColumn,
  TextArea,
  type ToolProps,
} from './ui';

export type ParcelTrackingProps = ToolProps & {
  /** API endpoint (default: /api/track) */
  endpoint?: string;
};

type TrackResult = { tracking: string; status: string; lastUpdate: string; courier: string };
type TrackingResponse = {
  demo: boolean;
  results: TrackResult[];
  fallbackReason?: string;
  error?: string;
};

const STATUS_TONE: Record<string, string> = {
  Delivered: 'text-emerald-700 bg-emerald-50',
  'Out for Delivery': 'text-info bg-info/10',
  'In Transit': 'text-gray-700 bg-gray-100',
  'On Hold': 'text-amber-700 bg-amber-50',
  Returning: 'text-red-700 bg-red-50',
};

export function ParcelTracking({
  brand = 'Contra Commerce',
  ctaText = 'Auto-track every parcel & notify customers with Contra Commerce',
  ctaUrl = '#',
  className = '',
  endpoint = '/api/track',
}: ParcelTrackingProps) {
  const [input, setInput] = useState('CS123456\nPTH987654\nRDX555111');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrackResult[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState('');

  const track = async () => {
    const trackingNumbers = input.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    if (!trackingNumbers.length) {
      setResults(null);
      setError('Enter at least one tracking number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ trackingNumbers }),
      });
      const data = (await res.json()) as TrackingResponse;
      if (!res.ok) throw new Error(data.error || 'tracking_failed');
      setResults(data.results);
      setDemo(data.demo);
    } catch {
      setResults(null);
      setDemo(false);
      setError('Tracking is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`grid items-start gap-6 lg:grid-cols-2 ${className}`}>
      <InputCard title="Tracking numbers">
        <TextArea
          label="One per line"
          value={input}
          onChange={setInput}
          rows={6}
          placeholder="CS123456"
        />
        <button
          type="button"
          onClick={track}
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Tracking…' : 'Track parcels'}
        </button>
        {error && <p className="text-xs text-red-700">{error}</p>}
      </InputCard>

      <ResultsColumn>
        <OutputBox title="Parcel status">
          {results && results.length > 0 ? (
            <div className="space-y-2">
              <div
                className={`rounded-lg px-3 py-2 text-xs ${
                  demo
                    ? 'border border-amber-200 bg-amber-50 text-amber-800'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                }`}
              >
                {demo
                  ? 'Demo data — connect the courier backend for live parcel statuses.'
                  : 'Live courier data'}
              </div>
              {results.map((r) => (
                <div key={r.tracking} className="flex items-center justify-between gap-2 border-b border-gray-100 py-2 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{r.tracking}</p>
                    <p className="text-xs text-gray-400">{r.courier} · {r.lastUpdate}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_TONE[r.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">Paste tracking numbers and hit track.</p>
          )}
        </OutputBox>
        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </div>
  );
}
