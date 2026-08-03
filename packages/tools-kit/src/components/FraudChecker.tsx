'use client';

import { useMemo, useState } from 'react';
import type {
  OperationalRiskLevel,
  OrderRiskAssessment,
} from '../logic/order-risk';
import {
  CalculatorShell,
  CtaCard,
  InputCard,
  OutputBox,
  ResultsColumn,
  Stat,
  StatGrid,
  TextArea,
  TextField,
  type ToolProps,
} from './ui';

export type FraudCheckerProps = ToolProps & {
  endpoint?: string;
};

type CourierHistory = {
  courier: string;
  total: number;
  delivered: number;
  failed: number;
  successRate: number | null;
  ratingBased?: boolean;
  rating?: string | number | null;
  riskLevel?: string | null;
};

type FraudResult = {
  demo: boolean;
  dataMode: 'live' | 'demo';
  fallbackReason?: string;
  orderReference?: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Insufficient data';
  riskLevelCode: OperationalRiskLevel;
  riskScore: number | null;
  confidence: 'low' | 'medium' | 'high';
  successRate: number | null;
  totalOrders: number;
  delivered: number;
  cancelled: number;
  repeatedAttempts: number;
  refused: number;
  unreachable: number;
  noShow: number;
  byCourier: CourierHistory[];
  sources: Array<{ courier: string; success: boolean; count?: number; provider?: string }>;
  served: string;
  cached: boolean;
  checkedAt: string;
  address: { checked: boolean; suspicious: boolean; reasons: string[] };
  assessment: OrderRiskAssessment;
  legalNote: string;
  note?: string;
};

const VERDICT_STYLE = {
  approve: {
    border: 'border-emerald-200 bg-emerald-50',
    text: 'text-emerald-800',
    badge: 'Normal risk',
  },
  verify: {
    border: 'border-amber-200 bg-amber-50',
    text: 'text-amber-800',
    badge: 'Verify',
  },
  hold: {
    border: 'border-red-200 bg-red-50',
    text: 'text-red-800',
    badge: 'Hold',
  },
  insufficient_data: {
    border: 'border-gray-200 bg-gray-50',
    text: 'text-gray-800',
    badge: 'Not enough data',
  },
} as const;

export function FraudChecker({
  brand = 'Contra Commerce',
  ctaText = 'Auto-verify every order with Contra Commerce',
  ctaUrl = '#',
  className = '',
  endpoint = '/api/fraud-check',
}: FraudCheckerProps) {
  const [orderReference, setOrderReference] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [consent, setConsent] = useState(false);
  const [freshLookup, setFreshLookup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudResult | null>(null);
  const [error, setError] = useState('');

  const validPhone = useMemo(() => {
    const digits = phone.replace(/\D/g, '');
    return /^(?:88)?01\d{9}$/.test(digits);
  }, [phone]);

  const check = async () => {
    if (!validPhone || !consent) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          orderReference,
          phone,
          address,
          consent,
          refresh: freshLookup,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setResult(null);
        setError(
          payload.error === 'rate_limited'
            ? 'Free check limit reached. Please try again later.'
            : payload.error === 'consent_required'
              ? 'Please confirm permission to check this number.'
              : 'Enter a valid Bangladesh mobile number.',
        );
        return;
      }
      setResult(payload as FraudResult);
    } catch {
      setResult(null);
      setError('Could not reach the risk checker. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const style = result ? VERDICT_STYLE[result.assessment.verdict] : null;

  return (
    <CalculatorShell className={className}>
      <InputCard title="Check a COD order">
        <TextField
          label="Order ID / invoice (optional)"
          value={orderReference}
          onChange={setOrderReference}
          placeholder="e.g. CC-10482"
        />
        <TextField
          label="Customer mobile number"
          value={phone}
          onChange={setPhone}
          placeholder="017XXXXXXXX"
        />
        {phone && !validPhone && (
          <p className="text-xs text-red-600">Enter an 11-digit Bangladesh mobile number.</p>
        )}
        <TextArea
          label="Delivery address (optional)"
          value={address}
          onChange={setAddress}
          rows={3}
          placeholder="House, Road, Area, District"
        />
        <label className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <span className="text-xs leading-relaxed text-gray-600">
            I am authorised to check this customer number for order fulfilment and accept the{' '}
            <a href="/privacy" target="_blank" className="font-medium text-blue-600 hover:underline">
              privacy notice
            </a>
            .
          </span>
        </label>
        <label className="flex items-start gap-2 px-1">
          <input
            type="checkbox"
            checked={freshLookup}
            onChange={(event) => setFreshLookup(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <span className="text-xs leading-relaxed text-gray-500">
            Request a fresh connected-source lookup instead of using cached history. This may use
            courier or aggregator quota.
          </span>
        </label>
        <button
          type="button"
          onClick={check}
          disabled={loading || !validPhone || !consent}
          className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Checking courier history…' : 'Check delivery risk'}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <p className="text-xs leading-relaxed text-gray-400">
          Results support fulfilment decisions; they do not prove fraud or criminal intent.
        </p>
      </InputCard>

      <ResultsColumn>
        {result && style ? (
          <>
            {result.demo && (
              <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-900">
                  ⚠ Simulated numbers — not this customer&rsquo;s real history
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-900">
                  No courier account is connected, so the figures below are generated from the
                  phone number itself for demonstration. They are not a delivery record. Do not
                  accept, reject or hold a real order based on this result.
                </p>
                <p className="mt-2 text-xs font-medium text-amber-900">
                  Connect a courier account to check the customer&rsquo;s actual parcel history.
                </p>
              </div>
            )}
            <div className={`rounded-2xl border p-5 ${style.border}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {result.orderReference
                    ? `Order ${result.orderReference}`
                    : 'Current order assessment'}
                </p>
                <div className="flex gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      result.demo
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {result.demo
                      ? 'Simulated — not real data'
                      : result.cached || result.served === 'cache'
                        ? 'Connected · cached'
                        : /courier|aggregator|history/.test(result.served)
                          ? 'Connected · fresh lookup'
                          : 'Connected · own history'}
                  </span>
                  <span className={`rounded-full bg-white px-2.5 py-1 text-xs font-semibold ${style.text}`}>
                    {style.badge}
                  </span>
                </div>
              </div>
              <p className={`mt-2 text-xl font-bold ${style.text}`}>
                {result.assessment.heading}
              </p>
              <p className="mt-1 text-sm text-gray-700">{result.assessment.recommendation}</p>
              {result.assessment.reasons.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-gray-600">
                  {result.assessment.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )}
            </div>

            {result.fallbackReason && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                {result.fallbackReason}
              </p>
            )}

            <StatGrid>
              <Stat
                label="Parcel receive score"
                value={result.successRate == null ? 'No data' : `${result.successRate}%`}
                tone={
                  result.successRate == null
                    ? 'default'
                    : result.successRate >= 75
                      ? 'emerald'
                      : 'red'
                }
              />
              <Stat
                label="Operational risk score"
                value={result.riskScore == null ? 'No data' : `${result.riskScore}/100`}
                tone={
                  result.riskScore == null
                    ? 'default'
                    : result.riskScore >= 70
                      ? 'red'
                      : 'emerald'
                }
              />
              <Stat label="Previous delivered" value={String(result.delivered)} tone="emerald" />
              <Stat label="Cancelled / returned" value={String(result.cancelled)} tone="red" />
              <Stat label="Repeated failed attempts" value={String(result.repeatedAttempts)} />
              <Stat label="Confidence" value={result.confidence} />
            </StatGrid>

            <OutputBox title="Courier-wise parcel history">
              {result.byCourier.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400">
                        <th className="pb-2 font-medium">Courier</th>
                        <th className="pb-2 text-right font-medium">Orders</th>
                        <th className="pb-2 text-right font-medium">Delivered</th>
                        <th className="pb-2 text-right font-medium">Failed</th>
                        <th className="pb-2 text-right font-medium">Receive score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.byCourier.map((courier) => (
                        <tr key={courier.courier} className="border-t border-gray-100">
                          <td className="py-2 font-medium capitalize text-gray-800">
                            {courier.courier}
                            {courier.ratingBased && (
                              <span className="block text-[10px] font-normal text-gray-400">
                                rating-based
                              </span>
                            )}
                          </td>
                          <td className="py-2 text-right text-gray-600">{courier.total}</td>
                          <td className="py-2 text-right text-emerald-700">{courier.delivered}</td>
                          <td className="py-2 text-right text-red-600">{courier.failed}</td>
                          <td className="py-2 text-right font-semibold text-gray-900">
                            {courier.successRate == null
                              ? courier.rating ?? 'No data'
                              : `${courier.successRate}%`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-gray-400">
                  No courier-specific history was returned.
                </p>
              )}
            </OutputBox>

            <OutputBox title="Data quality & source">
              <dl className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between gap-3">
                  <dt>Response source</dt>
                  <dd className="font-medium">{result.served}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Checked at</dt>
                  <dd className="font-medium">
                    {new Date(result.checkedAt).toLocaleString('en-BD')}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Cache</dt>
                  <dd className="font-medium">{result.cached ? 'Cached' : 'Fresh response'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Connected sources</dt>
                  <dd className="text-right font-medium">
                    {result.sources
                      .map((source) => `${source.courier}${source.success ? '' : ' (failed)'}`)
                      .join(', ') || 'None'}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">
                {result.legalNote}
              </p>
            </OutputBox>
          </>
        ) : (
          <OutputBox title="Order risk result">
            <p className="py-8 text-center text-sm text-gray-400">
              Enter an authorised customer number to see connected courier history and an
              actionable fulfilment recommendation.
            </p>
          </OutputBox>
        )}
        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </CalculatorShell>
  );
}
