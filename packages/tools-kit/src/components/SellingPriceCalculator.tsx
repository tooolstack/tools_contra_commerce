'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  calcSellingPrice,
  type SellingPriceInput,
  type SellingPriceResult,
} from '../logic/selling-price';
import {
  bdt,
  CalculatorShell,
  CtaCard,
  InputCard,
  NumberField,
  OutputBox,
  Panel,
  ResultHero,
  ResultsColumn,
  Stat,
  StatGrid,
  useResultTracking,
  type ToolProps,
} from './ui';

export type SellingPriceCalculatorProps = ToolProps & {
  onResult?: (result: SellingPriceResult, input: SellingPriceInput) => void;
};

const FIELDS: {
  key: keyof SellingPriceInput;
  label: string;
  suffix?: string;
  max?: number;
  help?: string;
}[] = [
  { key: 'productCost', label: 'Product cost', suffix: '৳' },
  {
    key: 'overheadPct',
    label: 'Operating cost',
    suffix: '%',
    help: 'Added as a percentage of product cost.',
  },
  {
    key: 'targetMarginPct',
    label: 'Target profit margin',
    suffix: '%',
    max: 99.9,
    help: 'Profit as a percentage of the final selling price (0–99.9%).',
  },
  {
    key: 'wholesaleMarginPct',
    label: 'Wholesale markup',
    suffix: '%',
    help: 'Amount added on top of product + operating cost.',
  },
  {
    key: 'retailMarginPct',
    label: 'Retail (MRP) profit margin',
    suffix: '%',
    max: 99.9,
    help: 'Profit as a percentage of the retail selling price (0–99.9%).',
  },
  {
    key: 'vatPct',
    label: 'VAT (optional)',
    suffix: '%',
    help: 'Added on top and shown separately in the breakdown.',
  },
];

const DEFAULTS: Record<keyof SellingPriceInput, number> = {
  productCost: 300,
  overheadPct: 10,
  targetMarginPct: 30,
  retailMarginPct: 50,
  vatPct: 0,
  wholesaleMarginPct: 15,
};

export function SellingPriceCalculator({
  brand = 'Contra Commerce',
  ctaText = 'Set prices & track margins live in Contra Commerce',
  ctaUrl = '#',
  className = '',
  onResult,
}: SellingPriceCalculatorProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.key] = String(DEFAULTS[f.key]);
    return init;
  });

  const input: SellingPriceInput = useMemo(() => {
    const n = (k: keyof SellingPriceInput) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      productCost: n('productCost'),
      overheadPct: n('overheadPct'),
      targetMarginPct: n('targetMarginPct'),
      retailMarginPct: n('retailMarginPct'),
      vatPct: n('vatPct'),
      wholesaleMarginPct: n('wholesaleMarginPct'),
    };
  }, [values]);

  const result = useMemo(() => calcSellingPrice(input), [input]);
  useEffect(() => onResult?.(result, input), [result, input, onResult]);
  useResultTracking('selling-price', input);

  const set = (k: keyof SellingPriceInput, v: string) => {
    let next = v;
    const parsed = Number.parseFloat(v);
    if (Number.isFinite(parsed)) {
      if (parsed < 0) next = '0';
      if (
        (k === 'targetMarginPct' || k === 'retailMarginPct') &&
        parsed >= 100
      ) {
        next = '99.9';
      }
    }
    setValues((p) => ({ ...p, [k]: next }));
  };

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
          label="Recommended selling price"
          value={bdt(result.targetPrice)}
          sub={`${bdt(result.profitAtTarget)} profit per unit at your target margin`}
        />

        <StatGrid>
          <Stat label="Break-even (minimum)" value={bdt(result.breakEvenPrice)} />
          <Stat label="Wholesale price" value={bdt(result.wholesalePrice)} />
          <Stat label="Retail (MRP) price" value={bdt(result.retailPrice)} />
          <Stat label="Max safe discount" value={`${result.maxDiscountPct.toFixed(0)}%`} tone="emerald" />
        </StatGrid>

        <OutputBox title="VAT & operating cost breakdown">
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Product cost</dt>
              <dd className="font-medium text-gray-900">{bdt(input.productCost)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Operating cost ({input.overheadPct}%)</dt>
              <dd className="font-medium text-gray-900">{bdt(result.operatingCostAmount)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2">
              <dt className="text-gray-600">Cost including operations</dt>
              <dd className="font-semibold text-gray-900">{bdt(result.costWithOverhead)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Target price before VAT</dt>
              <dd className="font-medium text-gray-900">{bdt(result.targetPriceExVat)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">VAT ({input.vatPct ?? 0}%)</dt>
              <dd className="font-medium text-gray-900">{bdt(result.vatAmount)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2">
              <dt className="font-medium text-gray-700">Final target price including VAT</dt>
              <dd className="text-base font-bold text-gray-900">{bdt(result.targetPrice)}</dd>
            </div>
          </dl>
        </OutputBox>

        <Panel
          label="Never sell below"
          value={bdt(result.breakEvenPrice)}
          sub={`Margin is profit ÷ selling price. Markup is profit ÷ cost. You can discount up to ${result.maxDiscountPct.toFixed(0)}% before losing money.`}
        />

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </CalculatorShell>
  );
}
