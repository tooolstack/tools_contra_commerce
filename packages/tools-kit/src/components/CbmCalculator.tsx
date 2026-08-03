'use client';

import { useEffect, useMemo, useState } from 'react';
import { calcCbm, type CbmInput, type CbmResult } from '../logic/cbm';
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

export type CbmCalculatorProps = ToolProps & {
  onResult?: (result: CbmResult, input: CbmInput) => void;
};

const FIELDS: { key: keyof CbmInput; label: string; suffix?: string }[] = [
  { key: 'productPrice', label: 'Unit price (foreign)', suffix: '¥/$' },
  { key: 'exchangeRate', label: 'Exchange rate → ৳', suffix: '৳' },
  { key: 'quantity', label: 'Total quantity', suffix: 'pcs' },
  { key: 'unitsPerCarton', label: 'Units per carton', suffix: 'pcs' },
  { key: 'cartonLengthCm', label: 'Carton length', suffix: 'cm' },
  { key: 'cartonWidthCm', label: 'Carton width', suffix: 'cm' },
  { key: 'cartonHeightCm', label: 'Carton height', suffix: 'cm' },
  { key: 'shippingRatePerCbm', label: 'Freight rate / CBM', suffix: '৳' },
  { key: 'extraCost', label: 'Customs + agent (total)', suffix: '৳' },
];

const DEFAULTS: Record<keyof CbmInput, number> = {
  productPrice: 10,
  exchangeRate: 17,
  quantity: 1000,
  unitsPerCarton: 50,
  cartonLengthCm: 60,
  cartonWidthCm: 40,
  cartonHeightCm: 50,
  shippingRatePerCbm: 8000,
  extraCost: 20000,
  wholesaleMarkupPct: 30,
  retailMarkupPct: 80,
};

export function CbmCalculator({
  brand = 'Contra Commerce',
  ctaText = 'Manage import costs & pricing in Contra Commerce',
  ctaUrl = '#',
  className = '',
  onResult,
}: CbmCalculatorProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.key] = String(DEFAULTS[f.key]);
    return init;
  });

  const input: CbmInput = useMemo(() => {
    const n = (k: keyof CbmInput) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      productPrice: n('productPrice'),
      exchangeRate: n('exchangeRate'),
      quantity: n('quantity'),
      unitsPerCarton: n('unitsPerCarton'),
      cartonLengthCm: n('cartonLengthCm'),
      cartonWidthCm: n('cartonWidthCm'),
      cartonHeightCm: n('cartonHeightCm'),
      shippingRatePerCbm: n('shippingRatePerCbm'),
      extraCost: n('extraCost'),
    };
  }, [values]);

  const result = useMemo(() => calcCbm(input), [input]);
  useEffect(() => onResult?.(result, input), [result, input, onResult]);
  useResultTracking('cbm-calculator', input);

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
          label="Per-piece landed cost"
          value={bdt(result.perUnitLandedCostBdt)}
          sub={`Total landed ${bdt(result.totalLandedCostBdt)} · ${result.cartons} cartons`}
        />

        <StatGrid>
          <Stat label="Total CBM" value={`${dec(result.totalCbm, 3)} m³`} />
          <Stat label="Freight cost" value={bdt(result.shippingCostBdt)} />
          <Stat label="Goods cost" value={bdt(result.goodsCostBdt)} />
          <Stat label="CBM / carton" value={`${dec(result.cbmPerCarton, 3)} m³`} />
        </StatGrid>

        <Panel
          label="Suggested selling prices"
          value={`${bdt(result.suggestedWholesale)} — ${bdt(result.suggestedRetail)}`}
          sub="Wholesale (+30%) → Retail (+80%) on landed cost"
        />

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </CalculatorShell>
  );
}
