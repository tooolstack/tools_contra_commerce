/**
 * Import Landing Cost & CBM Calculator — pure logic.
 *
 * For Bangladeshi importers shipping from China/abroad by volume (CBM). Works
 * out total shipment volume, freight cost, per-piece landed cost, and suggested
 * wholesale/retail prices.
 */

export type CbmInput = {
  /** Unit price in the foreign currency (RMB/USD) */
  productPrice: number;
  /** Exchange rate: 1 foreign unit = X BDT */
  exchangeRate: number;
  /** Total quantity of pieces */
  quantity: number;
  /** How many pieces fit in one carton */
  unitsPerCarton: number;
  /** Carton dimensions in centimetres */
  cartonLengthCm: number;
  cartonWidthCm: number;
  cartonHeightCm: number;
  /** Freight rate in BDT per CBM (m³) */
  shippingRatePerCbm: number;
  /** Customs + agent + misc costs, total in BDT */
  extraCost: number;

  /** Optional markups for the suggested prices (defaults: 30% / 80%) */
  wholesaleMarkupPct?: number;
  retailMarkupPct?: number;
};

export type CbmResult = {
  cartons: number;
  cbmPerCarton: number;
  totalCbm: number;
  goodsCostBdt: number;
  shippingCostBdt: number;
  totalLandedCostBdt: number;
  perUnitLandedCostBdt: number;
  suggestedWholesale: number;
  suggestedRetail: number;
};

const money = (n: number) => Math.round(n * 100) / 100;
const cbm4 = (n: number) => Math.round(n * 10000) / 10000;

export function calcCbm(input: CbmInput): CbmResult {
  const {
    productPrice,
    exchangeRate,
    quantity,
    unitsPerCarton,
    cartonLengthCm,
    cartonWidthCm,
    cartonHeightCm,
    shippingRatePerCbm,
    extraCost,
    wholesaleMarkupPct = 30,
    retailMarkupPct = 80,
  } = input;

  const cartons =
    unitsPerCarton > 0 ? Math.ceil(quantity / unitsPerCarton) : 0;

  // cm³ → m³
  const cbmPerCarton =
    (cartonLengthCm * cartonWidthCm * cartonHeightCm) / 1_000_000;
  const totalCbm = cbmPerCarton * cartons;

  const goodsCostBdt = productPrice * exchangeRate * quantity;
  const shippingCostBdt = totalCbm * shippingRatePerCbm;
  const totalLandedCostBdt = goodsCostBdt + shippingCostBdt + extraCost;
  const perUnitLandedCostBdt =
    quantity > 0 ? totalLandedCostBdt / quantity : 0;

  return {
    cartons,
    cbmPerCarton: cbm4(cbmPerCarton),
    totalCbm: cbm4(totalCbm),
    goodsCostBdt: money(goodsCostBdt),
    shippingCostBdt: money(shippingCostBdt),
    totalLandedCostBdt: money(totalLandedCostBdt),
    perUnitLandedCostBdt: money(perUnitLandedCostBdt),
    suggestedWholesale: money(perUnitLandedCostBdt * (1 + wholesaleMarkupPct / 100)),
    suggestedRetail: money(perUnitLandedCostBdt * (1 + retailMarkupPct / 100)),
  };
}
