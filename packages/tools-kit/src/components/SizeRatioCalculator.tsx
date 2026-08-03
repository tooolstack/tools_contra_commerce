'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, BadgeCheck, ClipboardList, HelpCircle, PackageCheck, SlidersHorizontal, Sparkles } from 'lucide-react';
import { calcDemandPlan, calcSizeRatio, SIZE_PRESETS, type SizeHistory, type SizeRatioInput, type SizeRatioResult, type SizeWeight } from '../logic/size-ratio';
import { CtaCard, DropdownControl, useResultTracking, type ToolProps } from './ui';

type Mode='history'|'custom'|'starter';
export type SizeRatioCalculatorProps=ToolProps&{onResult?:(result:SizeRatioResult,input:SizeRatioInput)=>void};
const n=(value:string|number)=>{const parsed=Number(value);return Number.isFinite(parsed)?parsed:0};
const inputClass='w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const initialHistory=(preset:string):SizeHistory[]=>SIZE_PRESETS[preset].ratio.map(({size},i)=>({size,delivered:[12,36,40,24,10,6][i]||10,sizeReturns:i===1?2:1,inStockDays:i===2?24:30,periodDays:30,currentStock:[3,7,5,4,2,1][i]||2,incomingStock:0}));

export function SizeRatioCalculator({brand='Contra Commerce',ctaText='Plan your inventory in Contra Commerce',ctaUrl='#',className='',onResult}:SizeRatioCalculatorProps){
  const[mode,setMode]=useState<Mode>('history');
  const[total,setTotal]=useState('100');
  const[preset,setPreset]=useState('men-tshirt');
  const[forecastDays,setForecastDays]=useState('30');
  const[growth,setGrowth]=useState('0');
  const[safety,setSafety]=useState('10');
  const[history,setHistory]=useState<SizeHistory[]>(()=>initialHistory('men-tshirt'));
  const[custom,setCustom]=useState<SizeWeight[]>(()=>SIZE_PRESETS['men-tshirt'].ratio.map(x=>({...x})));
  const changePreset=(value:string)=>{setPreset(value);setHistory(initialHistory(value));setCustom(SIZE_PRESETS[value].ratio.map(x=>({...x})))};
  const simple=useMemo(()=>calcSizeRatio({totalQty:n(total),ratio:mode==='starter'?SIZE_PRESETS[preset].ratio:custom}),[total,mode,preset,custom]);
  const plan=useMemo(()=>calcDemandPlan({totalQty:n(total),forecastDays:n(forecastDays),growthPct:n(growth),safetyPct:n(safety),history}),[total,forecastDays,growth,safety,history]);
  const result:SizeRatioResult=mode==='history'?plan:simple;
  const ratio=mode==='history'?plan.rows.map(r=>({size:r.size,weight:r.netNeed})):mode==='starter'?SIZE_PRESETS[preset].ratio:custom;
  useEffect(()=>onResult?.(result,{totalQty:n(total),ratio}),[result,total,ratio,onResult]);
  useResultTracking('size-ratio',{mode,totalQty:n(total),preset,forecastDays:n(forecastDays),growthPct:n(growth),safetyPct:n(safety)});
  const updateHistory=(i:number,key:keyof SizeHistory,value:string)=>setHistory(old=>old.map((row,index)=>index===i?{...row,[key]:key==='size'?value:n(value)}:row));
  const confidence=mode==='history'?plan.confidence:mode==='custom'?'User-defined':'Low';
  const tone=confidence==='High'?'bg-emerald-50 text-emerald-700 border-emerald-200':confidence==='Medium'||confidence==='User-defined'?'bg-blue-50 text-blue-700 border-blue-200':'bg-amber-50 text-amber-800 border-amber-200';

  return <div className={`space-y-6 ${className}`}>
    <section className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
      <div className="grid gap-2 sm:grid-cols-3">{([
        ['history','Use sales history','Best when you have order data'],['custom','Custom ratio','Use your own experience'],['starter','Starter example','No data — low confidence'],
      ] as const).map(([id,title,desc])=>{const Icon=id==='history'?BarChart3:id==='custom'?SlidersHorizontal:Sparkles;return <button key={id} type="button" onClick={()=>setMode(id)} className={`rounded-xl border p-4 text-left transition ${mode===id?'border-gray-950 bg-gray-950 text-white shadow-sm':'border-transparent text-gray-700 hover:bg-gray-50'}`}><span className="flex items-center gap-2 text-sm font-semibold"><Icon aria-hidden="true" className="h-4 w-4"/>{title}</span><span className={`mt-1 block pl-6 text-xs ${mode===id?'text-gray-300':'text-gray-500'}`}>{desc}</span></button>})}</div>
    </section>

    <div className="min-w-0 space-y-6">
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.16em] text-blue-600"><ClipboardList aria-hidden="true" className="h-4 w-4"/>Recommendation inputs</p><h2 className="mt-1 text-xl font-bold text-gray-950">{mode==='history'?'Forecast from real sales':mode==='custom'?'Set your size weights':'Transparent starter example'}</h2></div><span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}><BadgeCheck aria-hidden="true" className="h-3.5 w-3.5"/>{confidence} confidence</span></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Purchase quantity" value={total} set={setTotal} suffix="pcs"/>
          <label><span className="mb-1.5 block text-sm font-medium text-gray-700">Size set / category</span><DropdownControl className={inputClass} ariaLabel="Size set / category" value={preset} onChange={changePreset} options={Object.entries(SIZE_PRESETS).map(([value,p])=>({value,label:p.label}))}/></label>
        </div>

        {mode==='history'&&<>
          <div className="mt-5 grid gap-3 sm:grid-cols-3"><Field label="Forecast period" value={forecastDays} set={setForecastDays} suffix="days"/><Field label="Expected growth" value={growth} set={setGrowth} suffix="%"/><Field label="Safety stock" value={safety} set={setSafety} suffix="%"/></div>
          <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200"><table className="w-full min-w-[760px] text-sm"><thead className="bg-gray-50 text-left text-xs text-gray-500"><tr>{['Size','Delivered','Size returns','In-stock days','Period days','On hand','Incoming'].map(x=><th key={x} className="px-3 py-3 font-medium">{x}</th>)}</tr></thead><tbody>{history.map((row,i)=><tr key={row.size} className="border-t border-gray-100">{(['size','delivered','sizeReturns','inStockDays','periodDays','currentStock','incomingStock'] as const).map(key=><td key={key} className="p-2"><input aria-label={`${row.size} ${key}`} className={`${inputClass} min-w-20 py-1.5`} type={key==='size'?'text':'number'} min="0" value={row[key]} onChange={e=>updateHistory(i,key,e.target.value)}/></td>)}</tr>)}</tbody></table></div>
          <p className="mt-3 text-xs leading-5 text-gray-500">Enter delivered units only. “Size returns” means returns caused by incorrect fit—not courier failures or damaged products. In-stock days lets the system estimate demand hidden by stockouts.</p>
        </>}

        {mode==='custom'&&<div className="mt-5 space-y-2"><div className="grid grid-cols-[1fr_130px] gap-3 px-2 text-xs font-medium text-gray-500"><span>Size</span><span>Demand weight</span></div>{custom.map((row,i)=><div key={`${row.size}-${i}`} className="grid grid-cols-[1fr_130px] gap-3"><input className={inputClass} value={row.size} onChange={e=>setCustom(old=>old.map((x,j)=>j===i?{...x,size:e.target.value}:x))}/><input className={inputClass} type="number" min="0" value={row.weight} onChange={e=>setCustom(old=>old.map((x,j)=>j===i?{...x,weight:n(e.target.value)}:x))}/></div>)}<p className="pt-2 text-xs text-gray-500">Weights are relative. For example, 1 : 3 : 3 allocates 1/7, 3/7 and 3/7 of the purchase.</p></div>}

        {mode==='starter'&&<div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0"/><p><b>Example only—not market research.</b> This preset is a neutral starting assumption and is not based on your customers, location or sales history. Use it only when no better data exists, then replace it with actual results.</p></div>}
      </section>

      <div className="min-w-0 space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.16em] text-gray-500"><PackageCheck aria-hidden="true" className="h-4 w-4"/>Purchase recommendation</p><h2 className="mt-1 text-xl font-bold text-gray-950">Order by size</h2></div><span className="text-sm font-semibold text-gray-700">{result.total} pcs total</span></div>
          {plan.warnings.length>0&&mode==='history'&&<div className="mt-4 space-y-2">{plan.warnings.map(w=><p key={w} className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900"><AlertTriangle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0"/>{w}</p>)}</div>}
          <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[390px] text-sm"><thead><tr className="border-b text-left text-xs text-gray-400"><th className="pb-2 font-medium">Size</th>{mode==='history'&&<th className="pb-2 text-right font-medium">Forecast</th>}<th className="pb-2 text-right font-medium">Order</th><th className="pb-2 text-right font-medium">Share</th></tr></thead><tbody>{result.rows.map(row=>{const detail=mode==='history'?plan.rows.find(r=>r.size===row.size):undefined;return <tr key={row.size} className="border-b border-gray-100"><td className="py-3 font-semibold text-gray-800">{row.size}</td>{detail&&<td className="py-3 text-right text-gray-500">{Math.round(detail.forecastDemand)}</td>}<td className="py-3 text-right font-bold text-gray-950">{row.qty}</td><td className="py-3 text-right text-gray-500">{row.pct}%</td></tr>})}</tbody></table></div>
        </section>
        {mode==='history'&&<section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"><h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900"><HelpCircle aria-hidden="true" className="h-4 w-4 text-blue-600"/>Why these quantities?</h3><div className="mt-3 grid gap-3 md:grid-cols-2">{plan.rows.map(row=><div key={row.size} className="rounded-xl bg-gray-50 p-3"><div className="flex justify-between gap-3"><b className="text-sm">{row.size}: {row.qty} pcs</b><span className={`text-xs font-semibold ${row.confidence==='High'?'text-emerald-700':row.confidence==='Medium'?'text-blue-700':'text-amber-700'}`}>{row.confidence}</span></div><p className="mt-1 text-xs leading-5 text-gray-600">{row.reason} Forecast need after stock: {Math.round(row.netNeed)}.</p></div>)}</div></section>}
        <CtaCard href={ctaUrl} text={ctaText} brand={brand}/>
      </div>
    </div>
  </div>;
}

function Field({label,value,set,suffix}:{label:string;value:string;set:(v:string)=>void;suffix?:string}){return <label><span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span><div className="relative"><input className={`${inputClass} ${suffix?'pr-14':''}`} type="number" value={value} onChange={e=>set(e.target.value)}/>{suffix&&<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>}</div></label>}
