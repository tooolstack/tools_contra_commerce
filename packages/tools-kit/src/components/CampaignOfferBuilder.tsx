'use client';

import { useMemo, useState } from 'react';
import {
  buildCampaignOffer,
  CAMPAIGN_GOALS,
  type CampaignGoal,
} from '../logic/campaign-offer';
import {
  bdt,
  CopyField,
  CtaCard,
  InputCard,
  NumberField,
  OutputBox,
  ResultsColumn,
  SelectField,
  Stat,
  StatGrid,
  TextField,
  useResultTracking,
  type ToolProps,
} from './ui';

export type CampaignOfferBuilderProps = ToolProps;

export function CampaignOfferBuilder({
  brand = 'Contra Commerce',
  ctaText = 'Launch campaigns in minutes with Contra Commerce',
  ctaUrl = '#',
  className = '',
}: CampaignOfferBuilderProps) {
  const [goal, setGoal] = useState<CampaignGoal>('flash-sale');
  const [product, setProduct] = useState('Premium Polo Shirt');
  const [price, setPrice] = useState('1000');
  const [discount, setDiscount] = useState('30');

  const result = useMemo(
    () =>
      buildCampaignOffer({
        goal,
        product,
        originalPrice: Number.parseFloat(price) || 0,
        discountPct: Number.parseFloat(discount) || 0,
      }),
    [goal, product, price, discount],
  );

  useResultTracking('campaign-offer', { goal, product });

  return (
    <div className={`grid items-start gap-6 lg:grid-cols-2 ${className}`}>
      <InputCard title="Campaign setup">
        <SelectField label="Goal" value={goal} options={CAMPAIGN_GOALS} onChange={(v) => setGoal(v as CampaignGoal)} />
        <TextField label="Product" value={product} onChange={setProduct} />
        <NumberField label="Original price" suffix="৳" value={price} onChange={setPrice} />
        <NumberField label="Discount" suffix="%" value={discount} onChange={setDiscount} />
      </InputCard>

      <ResultsColumn>
        <StatGrid>
          <Stat label="Offer price" value={bdt(result.offerPrice)} tone="emerald" />
          <Stat label="Customer saves" value={bdt(result.saved)} />
        </StatGrid>

        <OutputBox title="Ready-to-post copy">
          <div className="space-y-2">
            <CopyField label="Headline" value={result.headline} />
            <CopyField label="Body" value={result.body} />
            <CopyField label="Call to action" value={result.cta} />
          </div>
        </OutputBox>

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </div>
  );
}
