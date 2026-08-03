'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  calcCodSettlement,
  parseStatement,
  type CodSettlementInput,
  type CodSettlementResult,
} from '../logic/cod-settlement';
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
  TextArea,
  useResultTracking,
  type ToolProps,
} from './ui';

export type CodSettlementCalculatorProps = ToolProps & {
  onResult?: (result: CodSettlementResult, input: CodSettlementInput) => void;
};

const FIELDS: { key: keyof CodSettlementInput; label: string; suffix?: string }[] = [
  { key: 'totalCollected', label: 'Total COD collected', suffix: '৳' },
  { key: 'codChargePct', label: 'COD charge', suffix: '%' },
  { key: 'deliveredParcels', label: 'Delivered parcels', suffix: 'pcs' },
  { key: 'deliveryChargePerParcel', label: 'Delivery charge / parcel', suffix: '৳' },
  { key: 'returnedParcels', label: 'Returned parcels', suffix: 'pcs' },
  { key: 'returnChargePerParcel', label: 'Return charge / parcel', suffix: '৳' },
  { key: 'adjustments', label: 'Adjustments (+/−)', suffix: '৳' },
];

const DEFAULTS: Record<keyof CodSettlementInput, number> = {
  totalCollected: 100000,
  codChargePct: 1,
  deliveredParcels: 200,
  deliveryChargePerParcel: 70,
  returnedParcels: 20,
  returnChargePerParcel: 50,
  adjustments: 0,
};

export function CodSettlementCalculator({
  brand = 'Contra Commerce',
  ctaText = 'Reconcile every courier payout in Contra Commerce',
  ctaUrl = '#',
  className = '',
  onResult,
}: CodSettlementCalculatorProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.key] = String(DEFAULTS[f.key]);
    return init;
  });

  const input: CodSettlementInput = useMemo(() => {
    const n = (k: keyof CodSettlementInput) => {
      const v = Number.parseFloat(values[k]);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      totalCollected: n('totalCollected'),
      codChargePct: n('codChargePct'),
      deliveredParcels: n('deliveredParcels'),
      deliveryChargePerParcel: n('deliveryChargePerParcel'),
      returnedParcels: n('returnedParcels'),
      returnChargePerParcel: n('returnChargePerParcel'),
      adjustments: n('adjustments'),
    };
  }, [values]);

  const result = useMemo(() => calcCodSettlement(input), [input]);
  useEffect(() => onResult?.(result, input), [result, input, onResult]);
  useResultTracking('cod-settlement', input);

  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const [paste, setPaste] = useState('');
  const parseAndFill = () => {
    const parsed = parseStatement(paste);
    setValues((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(parsed)) next[k] = String(v);
      return next;
    });
  };

  return (
    <CalculatorShell className={className}>
      <InputCard>
        <div className="rounded-xl border border-dashed border-gray-300 p-3">
          <TextArea
            label="Paste your courier statement (optional)"
            value={paste}
            onChange={setPaste}
            rows={3}
            placeholder="Paste the statement text — we'll auto-fill the fields below."
          />
          <button
            type="button"
            onClick={parseAndFill}
            className="mt-2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-700"
          >
            Auto-fill from statement
          </button>
        </div>
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
          label="You actually receive"
          value={bdt(result.netPayable)}
          sub={`After ${bdt(result.totalDeductions)} in charges (${result.effectiveChargePct.toFixed(1)}% of collected)`}
        />

        <StatGrid>
          <Stat label="COD charge" value={bdt(result.codCharge)} tone="red" />
          <Stat label="Delivery charges" value={bdt(result.deliveryCharges)} tone="red" />
          <Stat label="Return charges" value={bdt(result.returnCharges)} tone="red" />
          <Stat label="Total deductions" value={bdt(result.totalDeductions)} tone="red" />
        </StatGrid>

        <Panel
          label="Net payable to you"
          value={bdt(result.netPayable)}
          sub="Check this against what the courier actually deposits."
        />

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </CalculatorShell>
  );
}
