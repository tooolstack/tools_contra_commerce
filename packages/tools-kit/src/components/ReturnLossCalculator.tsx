'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  calcReturnLoss,
  type ReturnLossInput,
  type ReturnLossResult,
} from '../logic/return-loss';
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

export type ReturnLossCalculatorProps = ToolProps & {
  onResult?: (result: ReturnLossResult, input: ReturnLossInput) => void;
};

const FIELDS: {
  key: keyof ReturnLossInput;
  label: string;
  suffix?: string;
  max?: number;
  step?: number;
  help?: string;
}[] = [
  { key: 'monthlyParcels', label: 'Monthly parcels', suffix: 'pcs', step: 1 },
  {
    key: 'successRatePct',
    label: 'Delivery success rate',
    suffix: '%',
    max: 100,
    help: 'Enter a value from 0% to 100%.',
  },
  { key: 'forwardCharge', label: 'Forward charge', suffix: '৳' },
  { key: 'returnCharge', label: 'Return charge', suffix: '৳' },
  { key: 'packagingCost', label: 'Packaging cost', suffix: '৳' },
];

const DEFAULTS: Record<keyof ReturnLossInput, number> = {
  monthlyParcels: 1000,
  successRatePct: 80,
  forwardCharge: 70,
  returnCharge: 70,
  packagingCost: 20,
  improvementPct: 5,
};

export function ReturnLossCalculator({
  brand = 'Contra Commerce',
  ctaText = 'Cut returns with order verification in Contra Commerce',
  ctaUrl = '#',
  className = '',
  onResult,
}: ReturnLossCalculatorProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.key] = String(DEFAULTS[f.key]);
    return init;
  });

  const input: ReturnLossInput = useMemo(() => {
    const n = (k: keyof ReturnLossInput) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      monthlyParcels: n('monthlyParcels'),
      successRatePct: n('successRatePct'),
      forwardCharge: n('forwardCharge'),
      returnCharge: n('returnCharge'),
      packagingCost: n('packagingCost'),
    };
  }, [values]);

  const result = useMemo(() => calcReturnLoss(input), [input]);
  useEffect(() => onResult?.(result, input), [result, input, onResult]);
  useResultTracking('return-loss', input);

  const set = (k: keyof ReturnLossInput, v: string) => {
    let next = v;
    const parsed = Number.parseFloat(v);
    if (Number.isFinite(parsed)) {
      if (parsed < 0) next = '0';
      if (k === 'successRatePct' && parsed > 100) next = '100';
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
              step={f.step}
              onChange={(v) => set(f.key, v)}
            />
            {f.help && <p className="mt-1 text-right text-xs text-gray-500">{f.help}</p>}
          </div>
        ))}
      </InputCard>

      <ResultsColumn>
        <ResultHero
          label="Yearly loss from returns"
          value={bdt(result.yearlyLoss)}
          positive={false}
          sub={`${bdt(result.monthlyLoss)} / month · ${result.returnedParcels} returns / month`}
        />

        <StatGrid>
          <Stat label="Return rate" value={`${result.returnRatePct.toFixed(0)}%`} tone="red" />
          <Stat label="Loss per return" value={bdt(result.lossPerReturn)} />
          <Stat label="Returned parcels / mo" value={String(result.returnedParcels)} />
          <Stat label="Monthly loss" value={bdt(result.monthlyLoss)} tone="red" />
        </StatGrid>

        <Panel
          label={`If success rate improves by up to ${result.improvement.points} percentage points`}
          value={`${bdt(result.improvement.yearlySaving)} saved / year`}
          sub={`${bdt(result.improvement.monthlySaving)} back in your pocket every month`}
        />

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </CalculatorShell>
  );
}
