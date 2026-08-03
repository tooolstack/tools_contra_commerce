'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  calcDiscount,
  type DiscountInput,
  type DiscountResult,
  type DiscountStatus,
} from '../logic/discount';
import {
  bdt,
  CalculatorShell,
  CtaCard,
  InputCard,
  NumberField,
  ResultHero,
  ResultsColumn,
  Stat,
  StatGrid,
  useResultTracking,
  type ToolProps,
} from './ui';

export type DiscountCalculatorProps = ToolProps & {
  onResult?: (result: DiscountResult, input: DiscountInput) => void;
};

const FIELDS: {
  key: keyof DiscountInput;
  label: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  help?: string;
}[] = [
  { key: 'regularPrice', label: 'Regular price', suffix: '৳' },
  {
    key: 'discountPct',
    label: 'Discount',
    suffix: '%',
    max: 100,
    help: 'Enter a value from 0% to 100%.',
  },
  { key: 'productCost', label: 'Product cost', suffix: '৳' },
  {
    key: 'additionalCostPerUnit',
    label: 'Other cost per item',
    suffix: '৳',
    help: 'Packaging + fulfillment + operating cost for each item.',
  },
  {
    key: 'bundleBuyQty',
    label: 'Bundle: Buy',
    suffix: 'pcs',
    min: 1,
    step: 1,
  },
  {
    key: 'bundleFreeQty',
    label: 'Bundle: Get free',
    suffix: 'pcs',
    min: 1,
    step: 1,
    help: 'Whole numbers only. Bundle payment uses regular price; the main discount is not stacked.',
  },
];

const DEFAULTS: Record<string, number> = {
  regularPrice: 1000,
  discountPct: 30,
  productCost: 500,
  additionalCostPerUnit: 0,
  bundleBuyQty: 2,
  bundleFreeQty: 1,
};

export function DiscountCalculator({
  brand = 'Contra Commerce',
  ctaText = 'Run profitable campaigns in Contra Commerce',
  ctaUrl = '#',
  className = '',
  onResult,
}: DiscountCalculatorProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.key] = String(DEFAULTS[f.key]);
    return init;
  });

  const input: DiscountInput = useMemo(() => {
    const n = (k: keyof DiscountInput) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      regularPrice: n('regularPrice'),
      discountPct: n('discountPct'),
      productCost: n('productCost'),
      additionalCostPerUnit: n('additionalCostPerUnit'),
      bundleBuyQty: n('bundleBuyQty'),
      bundleFreeQty: n('bundleFreeQty'),
    };
  }, [values]);

  const result = useMemo(() => calcDiscount(input), [input]);
  useEffect(() => onResult?.(result, input), [result, input, onResult]);
  useResultTracking('discount', input);

  const set = (k: keyof DiscountInput, v: string) => {
    let next = v;
    const parsed = Number.parseFloat(v);
    if (Number.isFinite(parsed)) {
      if (parsed < 0) next = '0';
      if (k === 'discountPct' && parsed > 100) next = '100';
      if (k === 'bundleBuyQty' || k === 'bundleFreeQty') {
        next = String(Math.max(1, Math.floor(parsed)));
      }
    }
    setValues((p) => ({ ...p, [k]: next }));
  };
  const b = result.bundle;
  const statusLabel = (status: DiscountStatus) =>
    status === 'profit' ? 'Profit' : status === 'break_even' ? 'Break-even' : 'Loss';
  const statusTone = (status: DiscountStatus): 'default' | 'red' | 'emerald' =>
    status === 'profit' ? 'emerald' : status === 'loss' ? 'red' : 'default';

  return (
    <CalculatorShell className={className}>
      <InputCard>
        {FIELDS.map((f) => (
          <div key={f.key}>
            <NumberField
              label={f.label}
              suffix={f.suffix}
              value={values[f.key]}
              min={f.min ?? 0}
              max={f.max}
              step={f.step}
              onChange={(v) => set(f.key, v)}
            />
            {f.help && <p className="mt-1 text-right text-xs text-gray-500">{f.help}</p>}
          </div>
        ))}
      </InputCard>

      <ResultsColumn>
        <ResultHero
          label="Discounted price"
          value={bdt(result.discountedPrice)}
          positive={result.status === 'profit'}
          neutral={result.status === 'break_even'}
          sub={`You save ${bdt(result.savedAmount)} · ${
            result.status === 'profit'
              ? 'still profitable'
              : result.status === 'break_even'
                ? 'break-even — no profit, no loss'
                : 'below total cost — loss!'
          }`}
        />

        <StatGrid>
          <Stat
            label="Profit after discount"
            value={bdt(result.profitAfterDiscount)}
            tone={statusTone(result.status)}
          />
          <Stat label="Margin after discount" value={`${result.profitMarginPct.toFixed(1)}%`} />
          <Stat label="Total cost per item" value={bdt(result.totalUnitCost)} />
          <Stat
            label="Offer status"
            value={statusLabel(result.status)}
            tone={statusTone(result.status)}
          />
        </StatGrid>

        {/* Buy X / Get Y bundle offer */}
        <div
          className={`rounded-2xl border p-5 ${
            b.status === 'profit'
              ? 'border-emerald-200 bg-emerald-50'
              : b.status === 'break_even'
                ? 'border-amber-200 bg-amber-50'
                : 'border-red-200 bg-red-50'
          }`}
        >
          <p className="text-sm text-gray-600">
            Bundle offer — Buy {b.buyQty} Get {b.freeQty} Free
          </p>
          <p
            className={`mt-1 text-2xl font-bold ${
              b.status === 'profit'
                ? 'text-emerald-700'
                : b.status === 'break_even'
                  ? 'text-amber-700'
                  : 'text-red-700'
            }`}
          >
            {b.status === 'profit'
              ? `${bdt(b.profit)} profit`
              : b.status === 'break_even'
                ? 'Break-even — no profit, no loss'
                : `${bdt(-b.profit)} loss`}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Customer pays {b.buyQty} × regular price = {bdt(b.customerPays)} for {b.itemsGiven}{' '}
            items · total product + other costs {bdt(b.totalCost)} · ≈
            {b.effectiveDiscountPct.toFixed(0)}% off ({bdt(b.perUnitPrice)}/item). The main
            discount is not stacked.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="mb-3 text-sm text-gray-600">Compare discounts</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400">
                <th className="pb-2 font-medium">Discount</th>
                <th className="pb-2 text-right font-medium">Price</th>
                <th className="pb-2 text-right font-medium">Margin</th>
                <th className="pb-2 text-right font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {result.comparisons.map((c) => (
                <tr key={c.discountPct} className="border-t border-gray-100">
                  <td className="py-2 text-gray-700">{c.discountPct}%</td>
                  <td className="py-2 text-right text-gray-900">{bdt(c.price)}</td>
                  <td className="py-2 text-right text-gray-700">{c.marginPct.toFixed(1)}%</td>
                  <td
                    className={`py-2 text-right font-medium ${
                      c.status === 'profit'
                        ? 'text-emerald-700'
                        : c.status === 'loss'
                          ? 'text-red-600'
                          : 'text-amber-700'
                    }`}
                  >
                    {c.status === 'profit'
                      ? `Profit ${bdt(c.profit)}`
                      : c.status === 'break_even'
                        ? 'Break-even'
                        : `Loss ${bdt(-c.profit)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </CalculatorShell>
  );
}
