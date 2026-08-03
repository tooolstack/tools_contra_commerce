'use client';

import { useEffect, useMemo, useState } from 'react';
import { calcDeadStock, type DeadStockInput, type DeadStockResult } from '../logic/dead-stock';
import {
  bdt,
  CalculatorShell,
  CtaCard,
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

export type DeadStockCalculatorProps = ToolProps & {
  onResult?: (result: DeadStockResult, input: DeadStockInput) => void;
};

const FIELDS: { key: keyof DeadStockInput; label: string; suffix?: string }[] = [
  { key: 'stockQty', label: 'Stock quantity', suffix: 'pcs' },
  { key: 'purchasePrice', label: 'Purchase price / unit', suffix: '৳' },
  { key: 'currentSellingPrice', label: 'Current selling price', suffix: '৳' },
  { key: 'daysHeld', label: 'Days held', suffix: 'days' },
  { key: 'monthlyCarryingCostPct', label: 'Monthly carrying cost', suffix: '%' },
  { key: 'bundleSize', label: 'Bundle size', suffix: 'pcs' },
  { key: 'bundleDiscountPct', label: 'Bundle discount', suffix: '%' },
];

const DEFAULTS: Record<keyof DeadStockInput, number> = {
  stockQty: 100,
  purchasePrice: 200,
  currentSellingPrice: 300,
  daysHeld: 60,
  monthlyCarryingCostPct: 3,
  bundleSize: 3,
  bundleDiscountPct: 25,
};

export function DeadStockCalculator({
  brand = 'Contra Commerce',
  ctaText = 'Spot & clear dead stock in Contra Commerce',
  ctaUrl = '#',
  className = '',
  onResult,
}: DeadStockCalculatorProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.key] = String(DEFAULTS[f.key]);
    return init;
  });

  const input: DeadStockInput = useMemo(() => {
    const n = (k: keyof DeadStockInput) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      stockQty: n('stockQty'),
      purchasePrice: n('purchasePrice'),
      currentSellingPrice: n('currentSellingPrice'),
      daysHeld: n('daysHeld'),
      monthlyCarryingCostPct: n('monthlyCarryingCostPct'),
      bundleSize: n('bundleSize'),
      bundleDiscountPct: n('bundleDiscountPct'),
    };
  }, [values]);

  const result = useMemo(() => calcDeadStock(input), [input]);
  useEffect(() => onResult?.(result, input), [result, input, onResult]);
  useResultTracking('dead-stock', input);

  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  return (
    <CalculatorShell className={className}>
      <InputCard>
        {FIELDS.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            suffix={f.suffix}
            value={values[f.key]}
            onChange={(v) => set(f.key, v)}
          />
        ))}
      </InputCard>

      <ResultsColumn>
        <ResultHero
          label="Capital tied up in this stock"
          value={bdt(result.tiedCapital)}
          positive={false}
          sub={`Costing you ${bdt(result.monthlyCarryingCost)} / month to hold`}
        />

        <StatGrid>
          <Stat label="Carrying cost so far" value={bdt(result.carryingCostToDate)} tone="red" />
          <Stat label="Max safe discount" value={`${result.maxSafeDiscountPct.toFixed(0)}%`} tone="emerald" />
          <Stat label="Break-even (sell at cost)" value={bdt(result.breakEvenPrice)} />
          <Stat label="Quick liquidation price" value={bdt(result.suggestedLiquidationPrice)} />
        </StatGrid>

        <Panel
          label={`Bundle offer — ${result.bundle.size} pcs, ${result.bundle.discountPct}% off`}
          value={bdt(result.bundle.price)}
          sub={`${bdt(result.bundle.perUnit)} per unit — bundle to clear stock faster`}
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="mb-3 text-sm text-gray-600">Sell now vs. wait a month</p>
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-3 ${result.comparison.sellNowBetter ? 'bg-emerald-50' : 'bg-gray-50'}`}>
              <p className="text-xs text-gray-500">Sell now (liquidate)</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{bdt(result.comparison.sellNowValue)}</p>
            </div>
            <div className={`rounded-xl p-3 ${!result.comparison.sellNowBetter ? 'bg-emerald-50' : 'bg-gray-50'}`}>
              <p className="text-xs text-gray-500">Wait 1 month (full price)</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{bdt(result.comparison.waitOneMonthValue)}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {result.comparison.sellNowBetter
              ? '→ Liquidating now recovers more once carrying cost is counted.'
              : '→ Waiting can recover more if you actually sell at full price.'}
          </p>
        </div>

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </CalculatorShell>
  );
}
