'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  calcProfit,
  type CodChargeMode,
  type ProfitInput,
  type ProfitResult,
} from '../logic/profit';
import {
  bdt,
  CalculatorShell,
  CtaCard,
  InputCard,
  NumberField,
  Panel,
  ResultHero,
  ResultsColumn,
  SelectField,
  Stat,
  StatGrid,
  useResultTracking,
  type ToolProps,
} from './ui';

export type ProfitCalculatorProps = ToolProps & {
  /** Fires on every valid recalculation — hook this to lead capture / analytics */
  onResult?: (result: ProfitResult, input: ProfitInput) => void;
};

type FieldKey =
  | 'productCost'
  | 'sellingPrice'
  | 'adCostPerOrder'
  | 'forwardCharge'
  | 'returnCharge'
  | 'packagingCost'
  | 'returnRatePct'
  | 'monthlyOrders';

const COST_FIELDS: { key: FieldKey; label: string; suffix?: string }[] = [
  { key: 'productCost', label: 'Product cost', suffix: '৳' },
  { key: 'sellingPrice', label: 'Selling price', suffix: '৳' },
  { key: 'adCostPerOrder', label: 'Ad cost per order', suffix: '৳' },
  { key: 'forwardCharge', label: 'Delivery charge (courier)', suffix: '৳' },
  { key: 'returnCharge', label: 'Return charge (courier)', suffix: '৳' },
  { key: 'packagingCost', label: 'Packaging cost', suffix: '৳' },
];

const PROJECTION_FIELDS: { key: FieldKey; label: string; suffix?: string }[] = [
  { key: 'returnRatePct', label: 'Return rate', suffix: '%' },
  { key: 'monthlyOrders', label: 'Monthly total orders (optional)' },
];

const DEFAULTS: ProfitInput = {
  productCost: 300,
  sellingPrice: 800,
  adCostPerOrder: 120,
  forwardCharge: 70,
  returnCharge: 70,
  packagingCost: 20,
  codChargePct: 1,
  codChargeMode: 'percentage',
  codChargeFixed: 10,
  returnRatePct: 20,
  monthlyOrders: 500,
  productRecoveredOnReturn: true,
};

export function ProfitCalculator({
  brand = 'Contra Commerce',
  ctaText = 'Auto-calculate profit for every order',
  ctaUrl = '#',
  className = '',
  onResult,
}: ProfitCalculatorProps) {
  const [values, setValues] = useState<Record<FieldKey, string>>(() => {
    const init = {} as Record<FieldKey, string>;
    for (const f of [...COST_FIELDS, ...PROJECTION_FIELDS]) {
      init[f.key] = String(DEFAULTS[f.key] ?? '');
    }
    return init;
  });
  const [codChargeMode, setCodChargeMode] = useState<CodChargeMode>('percentage');
  const [codChargePct, setCodChargePct] = useState(String(DEFAULTS.codChargePct));
  const [codChargeFixed, setCodChargeFixed] = useState(String(DEFAULTS.codChargeFixed));
  const [productRecoveredOnReturn, setProductRecoveredOnReturn] = useState(true);

  const input: ProfitInput = useMemo(() => {
    const num = (k: FieldKey) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    const monthly = Number.parseFloat(values.monthlyOrders);
    return {
      productCost: num('productCost'),
      sellingPrice: num('sellingPrice'),
      adCostPerOrder: num('adCostPerOrder'),
      forwardCharge: num('forwardCharge'),
      returnCharge: num('returnCharge'),
      packagingCost: num('packagingCost'),
      codChargePct: Number.parseFloat(codChargePct) || 0,
      codChargeMode,
      codChargeFixed: Number.parseFloat(codChargeFixed) || 0,
      returnRatePct: num('returnRatePct'),
      monthlyOrders: Number.isFinite(monthly) && monthly > 0 ? monthly : undefined,
      productRecoveredOnReturn,
    };
  }, [
    values,
    codChargeMode,
    codChargePct,
    codChargeFixed,
    productRecoveredOnReturn,
  ]);

  const result = useMemo(() => calcProfit(input), [input]);

  useEffect(() => {
    onResult?.(result, input);
  }, [result, input, onResult]);
  useResultTracking('profit-calculator', input);

  const profitPositive = result.netProfitPerDelivered >= 0;
  const set = (k: FieldKey, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <CalculatorShell className={className}>
      <InputCard>
        {COST_FIELDS.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            suffix={f.suffix}
            value={values[f.key]}
            min={0}
            onChange={(v) => set(f.key, v)}
          />
        ))}

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <SelectField
            label="COD charge type"
            value={codChargeMode}
            options={[
              { value: 'percentage', label: 'Percentage of collected amount (%)' },
              { value: 'fixed', label: 'Fixed amount per delivered order (৳)' },
            ]}
            onChange={(v) => setCodChargeMode(v as CodChargeMode)}
          />
          <div className="mt-3">
            <NumberField
              label={codChargeMode === 'percentage' ? 'COD charge rate' : 'Fixed COD charge'}
              suffix={codChargeMode === 'percentage' ? '%' : '৳'}
              value={codChargeMode === 'percentage' ? codChargePct : codChargeFixed}
              min={0}
              onChange={
                codChargeMode === 'percentage' ? setCodChargePct : setCodChargeFixed
              }
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            Charged only on delivered orders where payment is collected.
          </p>
        </div>

        {PROJECTION_FIELDS.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            suffix={f.suffix}
            value={values[f.key]}
            min={0}
            max={f.key === 'returnRatePct' ? 100 : undefined}
            onChange={(v) => set(f.key, v)}
          />
        ))}

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <input
            type="checkbox"
            checked={productRecoveredOnReturn}
            onChange={(e) => setProductRecoveredOnReturn(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>
            <span className="block text-sm font-medium text-gray-800">
              Returned product can be resold
            </span>
            <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">
              Turn this off for damaged, perishable, or otherwise unsellable returns.
            </span>
          </span>
        </label>
      </InputCard>

      <ResultsColumn>
        <ResultHero
          label="Real profit per delivered order"
          value={bdt(result.netProfitPerDelivered)}
          positive={profitPositive}
          sub={`Margin ${result.profitMarginPct.toFixed(1)}% · Delivery rate ${(
            result.deliveryRate * 100
          ).toFixed(0)}%`}
        />

        <StatGrid>
          <Stat label="Break-even selling price" value={bdt(result.breakEvenPrice)} />
          <Stat label="Max acceptable ad cost / order" value={bdt(result.maxAdCostPerOrder)} />
          <Stat label="Loss per return" value={bdt(result.returnLossPerReturned)} />
          {result.monthly && (
            <Stat
              label="Monthly loss from returns"
              value={bdt(result.monthly.returnLoss)}
              tone="red"
            />
          )}
        </StatGrid>

        {result.monthly && (
          <Panel
            label="Monthly net profit (est.)"
            value={bdt(result.monthly.netProfit)}
            sub={`${result.monthly.deliveredOrders} delivered · ${result.monthly.returnedOrders} returned`}
          />
        )}

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </CalculatorShell>
  );
}
