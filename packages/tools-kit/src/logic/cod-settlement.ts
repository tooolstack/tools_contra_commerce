/**
 * COD Settlement Calculator — pure logic.
 *
 * From a courier statement's numbers, works out exactly how much the merchant
 * actually receives after COD fees, delivery charges, return charges and any
 * manual adjustments.
 */

export type CodSettlementInput = {
  /** Total COD amount collected from customers (৳) */
  totalCollected: number;
  /** COD fee as a percentage of the collected amount (e.g. 1) */
  codChargePct: number;
  /** Number of delivered parcels */
  deliveredParcels: number;
  /** Delivery charge per delivered parcel (৳) */
  deliveryChargePerParcel: number;
  /** Number of returned parcels */
  returnedParcels: number;
  /** Return charge per returned parcel (৳) */
  returnChargePerParcel: number;
  /** Other adjustments — positive or negative (৳) */
  adjustments: number;
};

export type CodSettlementResult = {
  codCharge: number;
  deliveryCharges: number;
  returnCharges: number;
  totalDeductions: number;
  netPayable: number;
  /** Total deductions as a % of the collected amount */
  effectiveChargePct: number;
};

const money = (n: number) => Math.round(n * 100) / 100;

/**
 * Best-effort parse of a pasted courier statement into input fields. Courier
 * formats vary, so this reads labelled amounts and returns whatever it finds.
 */
export function parseStatement(text: string): Partial<CodSettlementInput> {
  const t = text || '';
  const num = (re: RegExp): number | undefined => {
    const m = t.match(re);
    return m ? Number(m[1].replace(/,/g, '')) : undefined;
  };
  const out: Partial<CodSettlementInput> = {
    totalCollected: num(/(?:total\s*collected|collected\s*amount|cod\s*collected|total\s*cod)[^\d]*([\d,]+)/i),
    codChargePct: num(/cod\s*(?:charge|fee|%)[^\d]*([\d.]+)\s*%/i),
    deliveredParcels: num(/delivered[^\d]*([\d,]+)/i),
    deliveryChargePerParcel: num(/delivery\s*charge[^\d]*([\d,]+)/i),
    returnedParcels: num(/return(?:ed)?[^\d]*([\d,]+)/i),
    returnChargePerParcel: num(/return\s*charge[^\d]*([\d,]+)/i),
    adjustments: num(/adjust\w*[^\d-]*(-?[\d,]+)/i),
  };
  // Drop keys we couldn't find so they don't overwrite existing values.
  (Object.keys(out) as (keyof CodSettlementInput)[]).forEach((k) => {
    if (out[k] === undefined || Number.isNaN(out[k])) delete out[k];
  });
  return out;
}

export function calcCodSettlement(input: CodSettlementInput): CodSettlementResult {
  const {
    totalCollected,
    codChargePct,
    deliveredParcels,
    deliveryChargePerParcel,
    returnedParcels,
    returnChargePerParcel,
    adjustments,
  } = input;

  const codCharge = totalCollected * (codChargePct / 100);
  const deliveryCharges = deliveredParcels * deliveryChargePerParcel;
  const returnCharges = returnedParcels * returnChargePerParcel;
  const totalDeductions = codCharge + deliveryCharges + returnCharges;
  const netPayable = totalCollected - totalDeductions + adjustments;

  return {
    codCharge: money(codCharge),
    deliveryCharges: money(deliveryCharges),
    returnCharges: money(returnCharges),
    totalDeductions: money(totalDeductions),
    netPayable: money(netPayable),
    effectiveChargePct:
      totalCollected > 0 ? money((totalDeductions / totalCollected) * 100) : 0,
  };
}
