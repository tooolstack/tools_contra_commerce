/** Transparent size allocation and demand-planning logic. */

export type SizeWeight = { size: string; weight: number };
export type SizeRatioInput = { totalQty: number; ratio: SizeWeight[] };
export type SizeRatioRow = { size: string; qty: number; pct: number };
export type SizeRatioResult = { rows: SizeRatioRow[]; total: number };

export type SizeHistory = {
  size: string;
  delivered: number;
  sizeReturns: number;
  inStockDays: number;
  periodDays: number;
  currentStock: number;
  incomingStock: number;
};

export type DemandPlanInput = {
  totalQty: number;
  forecastDays: number;
  growthPct: number;
  safetyPct: number;
  history: SizeHistory[];
};

export type DemandPlanRow = SizeRatioRow & {
  effectiveDemand: number;
  forecastDemand: number;
  availableStock: number;
  netNeed: number;
  confidence: 'Low' | 'Medium' | 'High';
  reason: string;
};

export type DemandPlanResult = {
  rows: DemandPlanRow[];
  total: number;
  confidence: 'Low' | 'Medium' | 'High';
  warnings: string[];
};

/** Example presets only. They are not claims about verified market demand. */
export const SIZE_PRESETS: Record<string, { label: string; ratio: SizeWeight[] }> = {
  'men-tshirt': { label: "Men's T-shirt (S–XXL)", ratio: [{size:'S',weight:1},{size:'M',weight:3},{size:'L',weight:3},{size:'XL',weight:2},{size:'XXL',weight:1}] },
  'women-tshirt': { label: "Women's T-shirt (S–XL)", ratio: [{size:'S',weight:2},{size:'M',weight:3},{size:'L',weight:3},{size:'XL',weight:2}] },
  kids: { label: 'Kids (2–9y)', ratio: [{size:'2-3y',weight:2},{size:'4-5y',weight:3},{size:'6-7y',weight:3},{size:'8-9y',weight:2}] },
  'shoes-men': { label: "Men's shoes (39–44)", ratio: [{size:'39',weight:1},{size:'40',weight:2},{size:'41',weight:3},{size:'42',weight:3},{size:'43',weight:2},{size:'44',weight:1}] },
};

const clean = (n: number) => Number.isFinite(n) ? Math.max(0, n) : 0;

/** Largest-remainder allocation: integer quantities always add up to totalQty. */
export function calcSizeRatio(input: SizeRatioInput): SizeRatioResult {
  const totalQty = Math.max(0, Math.floor(clean(input.totalQty)));
  const ratio = input.ratio.map(r => ({...r, weight: clean(r.weight)}));
  const sumW = ratio.reduce((s,r)=>s+r.weight,0);
  if (!sumW || !totalQty) return {rows:ratio.map(r=>({size:r.size,qty:0,pct:0})),total:0};
  const allocated = ratio.map((r,index)=>{
    const exact=totalQty*r.weight/sumW;
    return {size:r.size,index,qty:Math.floor(exact),rem:exact-Math.floor(exact)};
  });
  let remaining=totalQty-allocated.reduce((s,r)=>s+r.qty,0);
  [...allocated].sort((a,b)=>b.rem-a.rem||a.index-b.index).forEach(r=>{if(remaining>0){r.qty++;remaining--}});
  const rows=allocated.sort((a,b)=>a.index-b.index).map(r=>({size:r.size,qty:r.qty,pct:Math.round(r.qty/totalQty*1000)/10}));
  return {rows,total:rows.reduce((s,r)=>s+r.qty,0)};
}

export function calcDemandPlan(input: DemandPlanInput): DemandPlanResult {
  const forecastDays=Math.max(1,clean(input.forecastDays));
  const growth=1+Math.max(-100,input.growthPct||0)/100;
  const safety=1+clean(input.safetyPct)/100;
  const metrics=input.history.map(h=>{
    const periodDays=Math.max(1,clean(h.periodDays));
    const inStockDays=Math.min(periodDays,Math.max(1,clean(h.inStockDays)));
    const effective=Math.max(0,clean(h.delivered)-clean(h.sizeReturns));
    const forecast=effective/inStockDays*forecastDays*growth*safety;
    const available=clean(h.currentStock)+clean(h.incomingStock);
    const need=Math.max(0,forecast-available);
    const confidence: DemandPlanRow['confidence']=effective>=50&&inStockDays/periodDays>=.8?'High':effective>=15&&inStockDays/periodDays>=.5?'Medium':'Low';
    return {h,effective,forecast,available,need,confidence,inStockDays,periodDays};
  });
  const hasNeed=metrics.some(m=>m.need>0);
  const allocation=calcSizeRatio({totalQty:input.totalQty,ratio:metrics.map(m=>({size:m.h.size,weight:hasNeed?m.need:m.effective}))});
  const warnings:string[]=[];
  if(!metrics.some(m=>m.effective>0)) warnings.push('No usable delivered-sales history. Enter data or use a custom ratio.');
  if(metrics.some(m=>m.inStockDays<m.periodDays*.5)) warnings.push('Some sizes were in stock for less than half the period; those forecasts have low confidence.');
  if(metrics.some(m=>clean(m.h.sizeReturns)>clean(m.h.delivered))) warnings.push('A size has more size-related returns than delivered units; check the inputs.');
  const rows=allocation.rows.map(a=>{
    const m=metrics.find(x=>x.h.size===a.size)!;
    return {...a,effectiveDemand:m.effective,forecastDemand:m.forecast,availableStock:m.available,netNeed:m.need,confidence:m.confidence,
      reason:`${m.effective.toFixed(0)} net delivered across ${m.inStockDays}/${m.periodDays} in-stock days; ${m.available.toFixed(0)} already available.`};
  });
  const rank={Low:0,Medium:1,High:2};
  const confidence=rows.length?rows.reduce((lowest,r)=>rank[r.confidence]<rank[lowest]?r.confidence:lowest,'High' as DemandPlanRow['confidence']):'Low';
  return {rows,total:allocation.total,confidence,warnings};
}
