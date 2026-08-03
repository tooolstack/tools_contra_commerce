'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Link2, MessageSquareText } from 'lucide-react';
import { buildWhatsappLink, type WhatsappInput, type WhatsappResult } from '../logic/whatsapp-link';
import {
  CopyField,
  CtaCard,
  InputCard,
  OutputBox,
  TextField,
  useResultTracking,
  type ToolProps,
} from './ui';

export type WhatsappLinkGeneratorProps = ToolProps & {
  onResult?: (result: WhatsappResult, input: WhatsappInput) => void;
};

export function WhatsappLinkGenerator({
  brand = 'Contra Commerce',
  ctaText = 'Take orders on autopilot with Contra Commerce',
  ctaUrl = '#',
  className = '',
  onResult,
}: WhatsappLinkGeneratorProps) {
  const [phone, setPhone] = useState('01712345678');
  const [product, setProduct] = useState('Premium Polo Shirt');
  const [price, setPrice] = useState('850');

  const input: WhatsappInput = useMemo(() => ({ phone, product, price }), [phone, product, price]);
  const result = useMemo(() => buildWhatsappLink(input), [input]);
  useEffect(() => onResult?.(result, input), [result, input, onResult]);
  useResultTracking('whatsapp-link', input);

  return (
    <div className={`space-y-5 ${className}`}>
      <InputCard title="Order details">
        <div className="grid gap-4 md:grid-cols-3">
          <TextField label="Your WhatsApp number" value={phone} onChange={setPhone} placeholder="01712345678" />
          <TextField label="Product name" value={product} onChange={setProduct} placeholder="Premium Polo Shirt" />
          <TextField label="Price (৳)" value={price} onChange={setPrice} placeholder="850" />
        </div>
        {!result.valid && <p className="mt-3 text-xs text-red-600">That doesn&apos;t look like a valid Bangladesh mobile number.</p>}
      </InputCard>

      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <OutputBox title={<span className="flex items-center gap-2"><Link2 aria-hidden="true" className="h-4 w-4"/>Your shareable order link</span>}>
          <CopyField value={result.link} />
          <a
            href={result.link}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!result.valid}
            onClick={(event)=>{if(!result.valid)event.preventDefault()}}
            className={`mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition ${result.valid?'bg-ink hover:bg-gray-800':'cursor-not-allowed bg-gray-400'}`}
          >
            Open in WhatsApp <ExternalLink aria-hidden="true" className="h-4 w-4"/>
          </a>
        </OutputBox>

        <OutputBox title={<span className="flex items-center gap-2"><MessageSquareText aria-hidden="true" className="h-4 w-4"/>Message preview</span>}>
          <pre className="min-h-28 whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">{result.message}</pre>
        </OutputBox>
      </div>

      <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
    </div>
  );
}
