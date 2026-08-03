'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildQrContent, QR_TYPE_OPTIONS, type QrType } from '../logic/qr';
import {
  CtaCard,
  InputCard,
  OutputBox,
  ResultsColumn,
  SelectField,
  TextField,
  useResultTracking,
  type ToolProps,
} from './ui';

export type QrGeneratorProps = ToolProps;

export function QrGenerator({
  brand = 'Contra Commerce',
  ctaText = 'Generate branded QR codes in Contra Commerce',
  ctaUrl = '#',
  className = '',
}: QrGeneratorProps) {
  const [type, setType] = useState<QrType>('url');
  const [value, setValue] = useState('contracommerce.com');
  const [dataUrl, setDataUrl] = useState('');

  const content = useMemo(() => buildQrContent({ type, value }), [type, value]);
  const placeholder = QR_TYPE_OPTIONS.find((o) => o.value === type)?.placeholder;
  useResultTracking('qr-generator', { type });

  useEffect(() => {
    let cancelled = false;
    if (!content) {
      setDataUrl('');
      return;
    }
    // Dynamic import keeps the QR library client-only and code-split.
    import('qrcode')
      .then((mod) => mod.toDataURL(content, { width: 320, margin: 2 }))
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [content]);

  // Download the QR with a "Powered by <brand>" caption composited below it.
  const download = () => {
    if (!dataUrl || typeof document === 'undefined') return;
    const img = new Image();
    img.onload = () => {
      const pad = 16;
      const cap = 44;
      const size = img.width;
      const canvas = document.createElement('canvas');
      canvas.width = size + pad * 2;
      canvas.height = size + pad + cap;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, pad, pad, size, size);
      ctx.fillStyle = '#6b7280';
      ctx.font = '600 16px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Powered by ${brand}`, canvas.width / 2, size + pad + 28);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'qr-code.png';
      a.click();
    };
    img.src = dataUrl;
  };

  return (
    <div className={`grid items-start gap-6 lg:grid-cols-2 ${className}`}>
      <InputCard title="What should the QR link to?">
        <SelectField
          label="Type"
          value={type}
          options={QR_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(v) => setType(v as QrType)}
        />
        <TextField label="Value" value={value} onChange={setValue} placeholder={placeholder} />
        {content && <p className="break-all text-xs text-gray-400">Encodes: {content}</p>}
      </InputCard>

      <ResultsColumn>
        <OutputBox title="Your QR code">
          {dataUrl ? (
            <div className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUrl} alt="QR code" width={220} height={220} className="rounded-lg border border-gray-200" />
              <button
                type="button"
                onClick={download}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Download branded PNG
              </button>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">Enter a value to generate a QR code.</p>
          )}
        </OutputBox>

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </div>
  );
}
