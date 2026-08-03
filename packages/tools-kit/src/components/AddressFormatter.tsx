'use client';

import { useMemo, useState } from 'react';
import { parseAddress } from '../logic/address-formatter';
import {
  CopyField,
  CtaCard,
  InputCard,
  OutputBox,
  ResultsColumn,
  TextArea,
  useResultTracking,
  type ToolProps,
} from './ui';

export type AddressFormatterProps = ToolProps;

const SAMPLE = 'Rahim Uddin 01712345678 House 5, Road 3, Dhanmondi, Dhaka';

export function AddressFormatter({
  brand = 'Contra Commerce',
  ctaText = 'Clean every order address automatically in Contra Commerce',
  ctaUrl = '#',
  className = '',
}: AddressFormatterProps) {
  const [raw, setRaw] = useState(SAMPLE);
  const result = useMemo(() => parseAddress({ raw }), [raw]);
  useResultTracking('address-formatter', { warnings: result.warnings.length });

  const formatted = [
    result.name && `Name: ${result.name}`,
    result.phone && `Phone: ${result.phone}`,
    result.area && `Area: ${result.area}`,
    result.thana && `Thana/Upazila: ${result.thana}`,
    result.district && `District: ${result.district}`,
    result.landmark && `Landmark: ${result.landmark}`,
    result.address && `Address: ${result.address}`,
  ]
    .filter(Boolean)
    .join('\n');

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between gap-3 border-b border-gray-100 py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span
        className="text-right font-medium text-gray-900"
        suppressHydrationWarning
        translate="no"
      >
        {value || '—'}
      </span>
    </div>
  );

  return (
    <div className={`grid items-start gap-6 lg:grid-cols-2 ${className}`}>
      <InputCard title="Paste the messy address">
        <TextArea label="Customer address" value={raw} onChange={setRaw} rows={6} placeholder={SAMPLE} />
      </InputCard>

      <ResultsColumn>
        <OutputBox title="Cleaned & structured">
          <Field label="Name" value={result.name} />
          <Field label="Phone" value={result.phone} />
          <Field label="Area" value={result.area} />
          <Field label="Thana / Upazila" value={result.thana} />
          <Field label="District" value={result.district} />
          <Field label="Landmark" value={result.landmark} />
          <Field label="Address" value={result.address} />

          {result.warnings.length > 0 && (
            <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
              ⚠️ {result.warnings.join(' · ')}
            </div>
          )}
        </OutputBox>

        {formatted && <CopyField label="Copy formatted" value={formatted} />}

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </div>
  );
}
