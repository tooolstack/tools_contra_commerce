import { describe, expect, it } from 'vitest';
import { calcDemandPlan, calcSizeRatio } from './size-ratio';

describe('size allocation',()=>{
  it('uses largest remainders and preserves the exact total',()=>{
    expect(calcSizeRatio({totalQty:7,ratio:[{size:'S',weight:1},{size:'M',weight:1},{size:'L',weight:1}]}).rows.map(r=>r.qty)).toEqual([3,2,2]);
  });
  it('corrects demand for stockout days and subtracts available inventory',()=>{
    const result=calcDemandPlan({totalQty:20,forecastDays:30,growthPct:0,safetyPct:0,history:[
      {size:'S',delivered:10,sizeReturns:0,inStockDays:30,periodDays:30,currentStock:0,incomingStock:0},
      {size:'M',delivered:10,sizeReturns:0,inStockDays:15,periodDays:30,currentStock:10,incomingStock:0},
    ]});
    expect(result.total).toBe(20);
    expect(result.rows.map(r=>r.qty)).toEqual([10,10]);
    expect(result.rows[1].forecastDemand).toBe(20);
  });
});
