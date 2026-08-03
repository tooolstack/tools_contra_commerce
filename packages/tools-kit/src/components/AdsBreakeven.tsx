'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  calcAdsBreakeven,
  type AdsInput,
  type AdsResult,
  type AdsVerdict,
} from '../logic/ads-breakeven';
import {
  bdt,
  CalculatorShell,
  CtaCard,
  dec,
  InputCard,
  NumberField,
  Panel,
  ResultHero,
  ResultsColumn,
  Stat,
  StatGrid,
  useResultTracking,
  type ToolProps,
} from './ui';

export type AdsBreakevenProps = ToolProps & {
  onResult?: (result: AdsResult, input: AdsInput) => void;
};

const FIELDS: {
  key: keyof AdsInput;
  label: string;
  suffix?: string;
  max?: number;
  help?: string;
}[] = [
  { key: 'sellingPrice', label: 'Selling price', suffix: '৳' },
  { key: 'productCost', label: 'Product cost', suffix: '৳' },
  { key: 'fulfillmentCost', label: 'Fulfillment cost / order', suffix: '৳' },
  {
    key: 'returnRatePct',
    label: 'Return rate',
    suffix: '%',
    max: 100,
    help: 'Enter a value from 0% to 100%.',
  },
  { key: 'returnCostPerReturn', label: 'Cost per return', suffix: '৳' },
  {
    key: 'currentCpp',
    label: 'Current cost / purchase (optional)',
    suffix: '৳',
    help: 'Add this to see actual ROAS, profit per order, and campaign verdict.',
  },
  {
    key: 'dailyAdBudget',
    label: 'Daily ad budget (optional)',
    suffix: '৳',
    help: 'Add this to see the purchases/orders needed per day.',
  },
];

const DEFAULTS: Record<keyof AdsInput, number> = {
  sellingPrice: 800,
  productCost: 300,
  fulfillmentCost: 110,
  returnRatePct: 20,
  returnCostPerReturn: 90,
  currentCpp: 150,
  dailyAdBudget: 5000,
};

const roas = (n: number) => (Number.isFinite(n) ? `${dec(n, 2)}x` : '—');

const VERDICT: Record<
  AdsVerdict,
  { stat: string; heading: string; tone: 'default' | 'red' | 'emerald' }
> = {
  keep_running: {
    stat: 'Keep running',
    heading: 'Campaign has a healthy profit buffer',
    tone: 'emerald',
  },
  optimize: {
    stat: 'Optimize',
    heading: 'Profitable, but close to break-even',
    tone: 'default',
  },
  break_even: {
    stat: 'Break-even',
    heading: 'Campaign is at break-even',
    tone: 'default',
  },
  stop: {
    stat: 'Stop ads',
    heading: 'Stop or fix before spending more',
    tone: 'red',
  },
};

export function AdsBreakeven({
  brand = 'Contra Commerce',
  ctaText = 'Track real ROAS after returns in Contra Commerce',
  ctaUrl = '#',
  className = '',
  onResult,
}: AdsBreakevenProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.key] = String(DEFAULTS[f.key]);
    return init;
  });

  const input: AdsInput = useMemo(() => {
    const n = (k: keyof AdsInput) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    const cpp = Number.parseFloat(values.currentCpp);
    const budget = Number.parseFloat(values.dailyAdBudget);
    return {
      sellingPrice: n('sellingPrice'),
      productCost: n('productCost'),
      fulfillmentCost: n('fulfillmentCost'),
      returnRatePct: n('returnRatePct'),
      returnCostPerReturn: n('returnCostPerReturn'),
      currentCpp: Number.isFinite(cpp) && cpp > 0 ? cpp : undefined,
      dailyAdBudget: Number.isFinite(budget) && budget > 0 ? budget : undefined,
    };
  }, [values]);

  const result = useMemo(() => calcAdsBreakeven(input), [input]);
  useEffect(() => onResult?.(result, input), [result, input, onResult]);
  useResultTracking('ads-breakeven', input);

  const set = (k: keyof AdsInput, v: string) => {
    let next = v;
    const parsed = Number.parseFloat(v);
    if (Number.isFinite(parsed)) {
      if (parsed < 0) next = '0';
      if (k === 'returnRatePct' && parsed > 100) next = '100';
    }
    setValues((p) => ({ ...p, [k]: next }));
  };
  const viable = result.maxCpp > 0;
  const currentVerdict = result.current ? VERDICT[result.current.verdict] : undefined;

  return (
    <CalculatorShell className={className}>
      <InputCard>
        {FIELDS.map((f) => (
          <div key={f.key}>
            <NumberField
              label={f.label}
              suffix={f.suffix}
              value={values[f.key]}
              min={0}
              max={f.max}
              onChange={(v) => set(f.key, v)}
            />
            {f.help && <p className="mt-1 text-right text-xs text-gray-500">{f.help}</p>}
          </div>
        ))}
      </InputCard>

      <ResultsColumn>
        <ResultHero
          label="Max cost per purchase (break-even)"
          value={bdt(result.maxCpp)}
          positive={viable}
          sub={`Break-even ROAS ${roas(result.breakEvenRoas)} · margin/order ${bdt(
            result.marginPerDelivered,
          )}`}
        />

        {result.breakEvenSalesPerDay != null && (
          <Panel
            label="Purchases/day needed to break even"
            value={`${result.breakEvenSalesPerDay} orders placed/day`}
            sub="Facebook purchases (orders placed), not delivered orders. Expected return losses are already included in the break-even CPP."
          />
        )}

        {result.current && (
          <>
            <StatGrid>
              <Stat
                label="Profit / order at current CPP"
                value={bdt(result.current.profitPerOrder)}
                tone={result.current.profitable ? 'emerald' : 'red'}
              />
              <Stat label="Actual ROAS (after returns)" value={roas(result.current.actualRoas)} />
              <Stat label="Reported ROAS" value={roas(result.current.reportedRoas)} />
              <Stat
                label="Verdict"
                value={currentVerdict?.stat ?? '—'}
                tone={currentVerdict?.tone}
              />
            </StatGrid>
            <Panel
              label={currentVerdict?.heading ?? 'Campaign verdict'}
              value={
                result.current.profitPerOrder > 0
                  ? `${bdt(result.current.profitPerOrder)} profit per order`
                  : result.current.profitPerOrder < 0
                    ? `${bdt(-result.current.profitPerOrder)} loss per order`
                    : '৳0 profit per order'
              }
              sub={
                result.current.verdict === 'keep_running'
                  ? `Keep monitoring and keep CPP below ${bdt(result.maxCpp)}.`
                  : result.current.verdict === 'optimize'
                    ? `Reduce CPP to build a safer buffer; ${bdt(result.maxCpp)} is the hard ceiling.`
                    : result.current.verdict === 'break_even'
                      ? `Any sustained CPP above ${bdt(result.maxCpp)} will move the campaign into loss.`
                      : `Current CPP is above the ${bdt(result.maxCpp)} break-even ceiling.`
              }
            />
          </>
        )}

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </CalculatorShell>
  );
}
