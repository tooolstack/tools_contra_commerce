'use client';

// Shared UI primitives for every tool. Keeps each calculator small and visually
// consistent. Tailwind classes here are picked up by the same content globs as
// the tools (host app must include the package in its Tailwind `content`).

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';

/**
 * Debounced usage tracking. Posts `{ tool, payload }` to the tracking endpoint
 * ~2.5s after the user stops changing inputs. The endpoint defaults to
 * NEXT_PUBLIC_TRACK_ENDPOINT — set on the marketing site, unset (and therefore
 * a no-op) in a host app like the boss's SaaS. Never throws.
 */
export function useResultTracking(
  tool: string,
  payload: unknown,
  endpoint: string | undefined = typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_TRACK_ENDPOINT
    : undefined,
): void {
  const serialized = JSON.stringify(payload ?? null);
  useEffect(() => {
    if (!endpoint) return;
    const t = setTimeout(() => {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tool, payload: JSON.parse(serialized) }),
        keepalive: true,
      }).catch(() => {});
    }, 2500);
    return () => clearTimeout(t);
  }, [tool, serialized, endpoint]);
}

// --- formatters ---
export const bdt = (n: number) =>
  '৳' +
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    Math.round(Number.isFinite(n) ? n : 0),
  );

export const pct = (n: number, places = 1) =>
  `${(Number.isFinite(n) ? n : 0).toFixed(places)}%`;

export const dec = (n: number, places = 2) =>
  (Number.isFinite(n) ? n : 0).toFixed(places);

export const num = (n: number) =>
  new Intl.NumberFormat('en-IN').format(Math.round(Number.isFinite(n) ? n : 0));

// --- shared props every tool component accepts ---
export type ToolProps = {
  brand?: string;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
};

// --- layout ---
export function CalculatorShell({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`grid min-w-0 items-start gap-6 lg:grid-cols-2 ${className}`}>{children}</div>;
}

export function InputCard({
  title = 'Enter your numbers',
  children,
}: {
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 self-start rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function ResultsColumn({ children }: { children: ReactNode }) {
  return <div className="min-w-0 flex flex-col gap-5">{children}</div>;
}

// --- inputs ---
export function NumberField({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step = 'any',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number | 'any';
}) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          className="w-32 rounded-lg border border-gray-300 px-3 py-2 pr-7 text-right text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {suffix}
          </span>
        )}
      </span>
    </label>
  );
}

// --- results ---
export function ResultHero({
  label,
  value,
  positive = true,
  neutral = false,
  sub,
}: {
  label: string;
  value: string;
  positive?: boolean;
  neutral?: boolean;
  sub?: ReactNode;
}) {
  const containerColor = neutral
    ? 'border-amber-200 bg-amber-50'
    : positive
      ? 'border-emerald-200 bg-emerald-50'
      : 'border-red-200 bg-red-50';
  const valueColor = neutral
    ? 'text-amber-700'
    : positive
      ? 'text-emerald-700'
      : 'text-red-700';
  return (
    <div className={`rounded-2xl border p-6 ${containerColor}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`mt-1 text-4xl font-bold ${valueColor}`}>{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function Stat({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'red' | 'emerald';
}) {
  const color =
    tone === 'red'
      ? 'text-red-600'
      : tone === 'emerald'
        ? 'text-emerald-700'
        : 'text-gray-900';
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}

export function Panel({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

// --- text / select inputs (for generator tools) ---
export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-700">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-700">{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray-700">{label}</span>
      <DropdownControl
        value={value}
        onChange={onChange}
        options={options}
        ariaLabel={label}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export type DropdownOption = { value: string; label: string; disabled?: boolean };

/** Accessible product-wide replacement for native selects, including the tray. */
export function DropdownControl({value,onChange,options,className='',ariaLabel='Choose an option',disabled=false}:{
  value:string;
  onChange:(value:string)=>void;
  options:Array<string|DropdownOption>;
  className?:string;
  ariaLabel?:string;
  disabled?:boolean;
}) {
  const items=options.map(option=>typeof option==='string'?{value:option,label:option}:option);
  const selectedIndex=Math.max(0,items.findIndex(item=>item.value===value));
  const[open,setOpen]=useState(false);
  const[active,setActive]=useState(selectedIndex);
  const root=useRef<HTMLDivElement>(null);
  const listId=`dropdown-${useId().replace(/:/g,'')}`;
  useEffect(()=>setActive(selectedIndex),[selectedIndex]);
  useEffect(()=>{const close=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)};document.addEventListener('pointerdown',close);return()=>document.removeEventListener('pointerdown',close)},[]);
  const choose=(index:number)=>{const item=items[index];if(!item||item.disabled)return;onChange(item.value);setActive(index);setOpen(false)};
  const nextEnabled=(from:number,direction:1|-1)=>{for(let step=1;step<=items.length;step++){const index=(from+direction*step+items.length)%items.length;if(!items[index]?.disabled)return index}return from};
  const keys=(event:KeyboardEvent<HTMLButtonElement>)=>{
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();const direction=event.key==='ArrowDown'?1:-1;setOpen(true);setActive(index=>nextEnabled(index,direction));return}
    if(event.key==='Enter'||event.key===' '){event.preventDefault();if(open)choose(active);else setOpen(true);return}
    if(event.key==='Escape'){event.preventDefault();setOpen(false);return}
    if(event.key==='Home'){event.preventDefault();setOpen(true);setActive(nextEnabled(-1,1));return}
    if(event.key==='End'){event.preventDefault();setOpen(true);setActive(nextEnabled(0,-1))}
  };
  return <div ref={root} className="relative min-w-0">
    <button type="button" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-activedescendant={open?`${listId}-${active}`:undefined} disabled={disabled} onClick={()=>setOpen(value=>!value)} onKeyDown={keys} className={`${className} flex min-h-10 items-center justify-between gap-3 pr-3 text-left disabled:cursor-not-allowed disabled:opacity-60`}>
      <span className="min-w-0 flex-1 truncate">{items[selectedIndex]?.label||value||'Select…'}</span><ChevronDown aria-hidden="true" className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${open?'rotate-180':''}`}/>
    </button>
    <span className="sr-only" aria-hidden="true">{items.map(item=>item.label).join(' ')}</span>
    {open&&<div id={listId} role="listbox" aria-label={ariaLabel} aria-activedescendant={`${listId}-${active}`} className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,.16)]">
      {items.map((item,index)=><button id={`${listId}-${index}`} key={`${item.value}-${index}`} type="button" role="option" aria-selected={item.value===value} disabled={item.disabled} onMouseEnter={()=>setActive(index)} onClick={()=>choose(index)} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${index===active?'bg-gray-100 text-gray-950':'text-gray-700 hover:bg-gray-50'} ${item.disabled?'cursor-not-allowed opacity-40':''}`}><span>{item.label}</span>{item.value===value&&<Check aria-hidden="true" className="h-4 w-4 shrink-0"/>}</button>)}
    </div>}
  </div>;
}

/** A read-only output block with a copy button. */
export function CopyField({ label, value }: { label?: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3">
      {label && <p className="mb-1 text-xs text-gray-500">{label}</p>}
      <div className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-start">
        <code className="min-w-0 flex-1 break-all text-sm leading-6 text-gray-800">{value}</code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 self-end rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-700 sm:self-start"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

/** Generic titled output container. */
export function OutputBox({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {title && <p className="mb-3 text-sm font-semibold text-gray-900">{title}</p>}
      {children}
    </div>
  );
}

// --- CTA (the marketing hook back to the SaaS) ---
export function CtaCard({
  href = '#',
  text,
  brand = 'Contra Commerce',
}: {
  href?: string;
  text: string;
  brand?: string;
}) {
  const trackAndAttribute = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') return;
    const tool =
      window.location.hostname.split('.')[0] ||
      window.location.pathname.split('/').filter(Boolean)[0] ||
      'tools-hub';
    const endpoint =
      typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TRACK_ENDPOINT : undefined;
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tool, payload: { action: 'cta_click', href } }),
        keepalive: true,
      }).catch(() => {});
    }
    if (href && !href.startsWith('#')) {
      try {
        const url = new URL(href, window.location.href);
        url.searchParams.set('utm_source', 'contra_free_tools');
        url.searchParams.set('utm_medium', 'result_cta');
        url.searchParams.set('utm_campaign', tool);
        event.currentTarget.href = url.toString();
      } catch {
        // Keep the original href if the host supplied a non-standard URL.
      }
    }
  };

  return (
    <a
      href={href}
      onClick={trackAndAttribute}
      className="group relative block w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 px-5 py-5 text-white shadow-sm transition hover:border-gray-700 hover:bg-gray-900 sm:px-6"
    >
      <span
        className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full border border-white/10 transition-transform duration-500 group-hover:scale-110"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -bottom-16 right-10 h-28 w-28 rounded-full border border-white/5"
        aria-hidden="true"
      />
      <span className="relative flex min-w-0 items-center justify-between gap-5">
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-5 text-white sm:text-base">{text}</span>
          <span className="mt-1 block text-xs leading-5 text-gray-300">
            See it live with {brand}
          </span>
        </span>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-lg transition duration-300 group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-gray-950" aria-hidden="true">
          <ArrowRight className="h-4 w-4" strokeWidth={2}/>
        </span>
      </span>
    </a>
  );
}
