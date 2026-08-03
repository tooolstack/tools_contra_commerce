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
  /**
   * Where to send a user who has no courier connected yet. Pass an absolute URL
   * when tools are served from per-tool subdomains.
   */
  settingsUrl?: string;
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
  settingsUrl = '/courier-settings',
}: ParcelTrackingProps) {
  const [input, setInput] = useState('CS123456\nPTH987654\nRDX555111');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrackResult[] | null>(null);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState('');
  const [needsConnection, setNeedsConnection] = useState(false);

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
      setNeedsConnection(false);
    } catch (cause) {
      setResults(null);
      setDemo(false);
      // A missing courier connection is a setup step, not an outage — telling the
      // user to "try again" would send them into a loop that can never succeed.
      const connectionMissing =
        cause instanceof Error && cause.message === 'courier_connection_required';
      setNeedsConnection(connectionMissing);
      setError(
        connectionMissing ? '' : 'Tracking is temporarily unavailable. Please try again.',
      );
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
        {needsConnection && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-900">
              Connect a courier account first
            </p>
            <p className="mt-1 text-xs leading-relaxed text-amber-900">
              Live parcel status comes from your own courier account, so there is nothing to
              track until one is connected. This is a one-time setup — it is not a temporary
              outage.
            </p>
            <a
              href={settingsUrl}
              className="mt-2 inline-block rounded-lg bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Open courier settings
            </a>
          </div>
        )}
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
