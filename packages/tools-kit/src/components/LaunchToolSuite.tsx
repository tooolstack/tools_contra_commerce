'use client';

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { DropdownControl } from './ui';
import type { SocialMediaToolSlug } from './SocialMediaToolSuite';

const SocialMediaToolSuite = lazy(() => import('./SocialMediaToolSuite').then((module) => ({ default: module.SocialMediaToolSuite })));
const DeveloperToolsStudio = lazy(() => import('./DeveloperToolsStudio').then((module) => ({ default: module.DeveloperToolsStudio })));
const WebsiteSeoStudio = lazy(() => import('./WebsiteSeoStudio').then((module) => ({ default: module.WebsiteSeoStudio })));
const CalculatorToolsStudio = lazy(() => import('./CalculatorToolsStudio').then((module) => ({ default: module.CalculatorToolsStudio })));
const ProductivityToolsStudio = lazy(() => import('./ProductivityToolsStudio').then((module) => ({ default: module.ProductivityToolsStudio })));
const EducationToolsStudio = lazy(() => import('./EducationToolsStudio').then((module) => ({ default: module.EducationToolsStudio })));
const CareerToolsStudio = lazy(() => import('./CareerToolsStudio').then((module) => ({ default: module.CareerToolsStudio })));
const HealthToolsStudio = lazy(() => import('./HealthToolsStudio').then((module) => ({ default: module.HealthToolsStudio })));
const TravelToolsStudio = lazy(() => import('./TravelToolsStudio').then((module) => ({ default: module.TravelToolsStudio })));
const CreatorToolsStudio = lazy(() => import('./CreatorToolsStudio').then((module) => ({ default: module.CreatorToolsStudio })));
const TextUtilityStudio = lazy(() => import('./TextUtilityStudio').then((module) => ({ default: module.TextUtilityStudio })));
const HomeToolsStudio = lazy(() => import('./HomeToolsStudio').then((module) => ({ default: module.HomeToolsStudio })));
const ImageToolsStudio = lazy(() => import('./ImageToolsStudio').then((module) => ({ default: module.ImageToolsStudio })));

export type LaunchToolSlug = SocialMediaToolSlug
  | 'developer-tools' | 'website-seo-tools' | 'calculator-tools' | 'productivity-tools' | 'education-tools' | 'career-job-tools' | 'health-tools' | 'travel-tools' | 'creator-tools' | 'text-utility-tools' | 'home-everyday-tools' | 'image-tools' | 'moq-decision' | 'client-profitability' | 'professional-message' | 'whatsapp-reply-generator' | 'supplier-message'
  | 'video-script-timer' | 'teleprompter' | 'caption-formatter' | 'product-photo-cleaner'
  | 'social-image-resizer' | 'passport-photo-maker' | 'utm-builder'
  | 'social-share-preview' | 'job-offer-comparison' | 'study-hours-planner'
  | 'room-paint-calculator';

export function LaunchToolSuite({ tool }: { tool: LaunchToolSlug }) {
  if (tool === 'developer-tools') return studio(tool, <DeveloperToolsStudio />);
  if (tool === 'website-seo-tools') return studio(tool, <WebsiteSeoStudio />);
  if (tool === 'calculator-tools') return studio(tool, <CalculatorToolsStudio />);
  if (tool === 'productivity-tools') return studio(tool, <ProductivityToolsStudio />);
  if (tool === 'education-tools') return studio(tool, <EducationToolsStudio />);
  if (tool === 'career-job-tools') return studio(tool, <CareerToolsStudio />);
  if (tool === 'health-tools') return studio(tool, <HealthToolsStudio />);
  if (tool === 'travel-tools') return studio(tool, <TravelToolsStudio />);
  if (tool === 'creator-tools') return studio(tool, <CreatorToolsStudio />);
  if (tool === 'text-utility-tools') return studio(tool, <TextUtilityStudio />);
  if (tool === 'home-everyday-tools') return studio(tool, <HomeToolsStudio />);
  if (tool === 'image-tools') return studio(tool, <ImageToolsStudio />);
  if (['social-media-tools','instagram-bio-generator','hashtag-cleaner','youtube-timestamp-generator','thumbnail-title-checker','facebook-ad-formatter','linkedin-post-formatter','twitter-thread-splitter','engagement-rate-calculator','influencer-rate-calculator','giveaway-winner-picker','social-username-checker'].includes(tool)) return studio(tool, <SocialMediaToolSuite tool={tool as SocialMediaToolSlug} />);
  if (tool === 'professional-message') return <MessageRewriter />;
  if (tool === 'whatsapp-reply-generator') return <WhatsAppReplyGenerator />;
  if (tool === 'supplier-message') return <SupplierMessage />;
  if (tool === 'video-script-timer') return <ScriptTimer />;
  if (tool === 'teleprompter') return <Teleprompter />;
  if (tool === 'caption-formatter') return <CaptionFormatter />;
  if (tool === 'utm-builder') return <UtmBuilder />;
  if (tool === 'social-share-preview') return <SocialPreview />;
  if (tool === 'product-photo-cleaner' || tool === 'social-image-resizer' || tool === 'passport-photo-maker') return <ImageTool tool={tool} />;
  return <Calculator tool={tool as CalcSlug} />;
}

function studio(tool: string, content: React.ReactNode) {
  return (
    <Suspense fallback={<div className="flex min-h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-500">Loading tool workspace…</div>}>
      <StudioWorkspace tool={tool}>{content}</StudioWorkspace>
    </Suspense>
  );
}

type DraftControl = { index: number; tag: 'input' | 'select' | 'textarea'; type: string; value: string; checked?: boolean };

function StudioWorkspace({ tool, children }: { tool: string; children: React.ReactNode }) {
  const workspace = useRef<HTMLDivElement>(null);
  const [draftStatus, setDraftStatus] = useState('Drafts stay only on this device.');
  const storageKey = `contra-studio-draft:${tool}`;

  const readControls = () => Array.from(workspace.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type="file"]), select, textarea') || [])
    .map((element, index): DraftControl => ({
      index,
      tag: element.tagName.toLowerCase() as DraftControl['tag'],
      type: element instanceof HTMLInputElement ? element.type : '',
      value: element.value,
      checked: element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type) ? element.checked : undefined,
    }));

  const saveDraft = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, tool, savedAt: new Date().toISOString(), controls: readControls() }));
      setDraftStatus('Draft saved on this device.');
    } catch {
      setDraftStatus('This browser could not save the draft.');
    }
  };

  const restoreDraft = () => {
    try {
      const draft = JSON.parse(localStorage.getItem(storageKey) || 'null') as { controls?: DraftControl[] } | null;
      if (!draft?.controls?.length) return setDraftStatus('No saved draft exists for this studio.');
      const elements = Array.from(workspace.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type="file"]), select, textarea') || []);
      draft.controls.forEach((saved) => {
        const element = elements[saved.index];
        if (!element || element.tagName.toLowerCase() !== saved.tag) return;
        if (element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type)) {
          Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked')?.set?.call(element, Boolean(saved.checked));
          element.dispatchEvent(new Event('change', { bubbles: true }));
          return;
        }
        const prototype = element instanceof HTMLInputElement ? HTMLInputElement.prototype : element instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLTextAreaElement.prototype;
        Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(element, saved.value);
        element.dispatchEvent(new Event(element instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }));
      });
      setDraftStatus('Saved draft restored. File uploads must be selected again.');
    } catch {
      setDraftStatus('The saved draft is invalid and could not be restored.');
    }
  };

  const exportDraft = () => {
    const payload = JSON.stringify({ version: 1, tool, exportedAt: new Date().toISOString(), controls: readControls() }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tool}-draft.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    setDraftStatus('Draft exported as JSON.');
  };

  return <div ref={workspace} className="space-y-4">
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-sm font-semibold text-gray-950">Workspace draft</p><p className="text-xs text-gray-500" aria-live="polite">{draftStatus}</p></div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={saveDraft} className="rounded-xl bg-gray-950 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800">Save draft</button>
        <button type="button" onClick={restoreDraft} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50">Restore</button>
        <button type="button" onClick={exportDraft} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50">Export JSON</button>
      </div>
    </div>
    {children}
  </div>;
}

const n = (value: string) => Number(value) || 0;
const money = (value: number) => `৳${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0)}`;
const fieldClass = 'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100';
const buttonClass = 'rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50';

function Shell({ inputs, result }: { inputs: React.ReactNode; result: React.ReactNode }) {
  return <div className="grid gap-5 lg:grid-cols-2"><section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">{inputs}</section><section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">{result}</section></div>;
}
function ResultFirstShell({ inputs, result, resultColumns = 2 }: { inputs: React.ReactNode; result: React.ReactNode; resultColumns?: 2 | 3 }) {
  return <div className="space-y-5">
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className={`grid items-stretch gap-4 md:grid-cols-2 ${resultColumns===3?'lg:grid-cols-3':''}`}>{result}</div></section>
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{inputs}</div></section>
  </div>;
}
function Field({ label, value, onChange, type = 'number', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">{label}</span><input className={fieldClass} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></label>;
}
function Area({ label, value, onChange, rows = 7, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">{label}</span><textarea className={fieldClass} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></label>;
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">{label}</span><DropdownControl className={fieldClass} ariaLabel={label} value={value} onChange={onChange} options={options}/></label>;
}
function Result({ title, value, note }: { title: string; value: string; note?: string }) {
  return <div className="rounded-xl border border-gray-200 bg-gray-50 p-4"><p className="text-xs font-medium uppercase tracking-wider text-gray-500">{title}</p><p className="mt-1 text-2xl font-bold text-gray-950">{value}</p>{note && <p className="mt-1 text-sm text-gray-500">{note}</p>}</div>;
}
function Copy({ text }: { text: string }) { const [done, setDone] = useState(false); return <button className={buttonClass} onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1200); }}>{done ? 'Copied' : 'Copy result'}</button>; }

type CalcSlug = Exclude<LaunchToolSlug, SocialMediaToolSlug | 'developer-tools' | 'website-seo-tools' | 'calculator-tools' | 'productivity-tools' | 'education-tools' | 'career-job-tools' | 'health-tools' | 'travel-tools' | 'creator-tools' | 'text-utility-tools' | 'home-everyday-tools' | 'image-tools' | 'professional-message' | 'whatsapp-reply-generator' | 'supplier-message' | 'video-script-timer' | 'teleprompter' | 'caption-formatter' | 'product-photo-cleaner' | 'social-image-resizer' | 'passport-photo-maker' | 'utm-builder' | 'social-share-preview'>;
function Calculator({ tool }: { tool: CalcSlug }) {
  const [v, setV] = useState<Record<string, string>>(() => ({
    'moq-decision': { a: '500', b: '250', c: '30000', d: '500', e: '0', f: '0' },
    'client-profitability': { a: '100000', b: '80', c: '15000', d: '1000', e: '0', f: '0' },
    'job-offer-comparison': { a: '1200000', b: '10000', c: '300', d: '22', e: '1350000', f: '5000' },
    'study-hours-planner': { a: '80', b: '30', c: '50', d: '0', e: '0', f: '0' },
    'room-paint-calculator': { a: '20', b: '2.8', c: '2', d: '10', e: '1', f: '2' },
  }[tool]));
  const set = (key: string) => (value: string) => setV((old) => ({ ...old, [key]: value }));
  if (tool === 'moq-decision') {
    const investment = n(v.a) * n(v.b), landed = investment + n(v.c), profit = n(v.a) * n(v.d) - landed, breakEven = n(v.d) ? Math.ceil(landed / n(v.d)) : 0;
    return <Shell inputs={<><Field label="MOQ quantity" value={v.a} onChange={set('a')} /><Field label="Unit purchase cost" value={v.b} onChange={set('b')} /><Field label="Freight and import cost" value={v.c} onChange={set('c')} /><Field label="Expected selling price per unit" value={v.d} onChange={set('d')} /></>} result={<><Result title="Cash required" value={money(landed)} /><Result title="Expected order profit" value={money(profit)} note={profit >= 0 ? 'The order can recover its cost at your expected price.' : 'Price or order economics need revision.'} /><Result title="Units needed to break even" value={`${breakEven} of ${n(v.a)}`} /></>} />;
  }
  if (tool === 'client-profitability') {
    const revenue=n(v.a), hours=n(v.b), expenses=n(v.c), target=n(v.d), profit=revenue-expenses, hourly=hours?profit/hours:0;
    return <Shell inputs={<><Field label="Client revenue" value={v.a} onChange={set('a')} /><Field label="Hours spent" value={v.b} onChange={set('b')} /><Field label="Direct expenses" value={v.c} onChange={set('c')} /><Field label="Target hourly rate" value={v.d} onChange={set('d')} /></>} result={<><Result title="Net client profit" value={money(profit)} /><Result title="Effective hourly rate" value={money(hourly)} note={hourly >= target ? 'Meets your target rate.' : `Below target by ${money(target-hourly)} per hour.`} /><Result title="Profit margin" value={`${revenue ? (profit/revenue*100).toFixed(1) : 0}%`} /></>} />;
  }
  if (tool === 'job-offer-comparison') {
    const scoreA=n(v.a)+n(v.b)*12-n(v.c)*n(v.d), scoreB=n(v.e)+n(v.f)*12-n(v.c)*n(v.d);
    return <ResultFirstShell resultColumns={3} inputs={<><Field label="Offer A annual salary" value={v.a} onChange={set('a')} /><Field label="Offer A monthly benefits" value={v.b} onChange={set('b')} /><Field label="Offer B annual salary" value={v.e} onChange={set('e')} /><Field label="Offer B monthly benefits" value={v.f} onChange={set('f')} /><Field label="Daily commuting cost" value={v.c} onChange={set('c')} /><Field label="Workdays per month" value={v.d} onChange={set('d')} /></>} result={<><Result title="Offer A adjusted value" value={money(scoreA)} /><Result title="Offer B adjusted value" value={money(scoreB)} /><Result title="Financially stronger offer" value={scoreA === scoreB ? 'Equal' : scoreA > scoreB ? 'Offer A' : 'Offer B'} note="Also compare culture, growth, stability, leave, and flexibility before deciding." /></>} />;
  }
  if (tool === 'study-hours-planner') {
    const total=n(v.a), days=Math.max(1,n(v.b)), confidence=Math.min(100,n(v.c)), daily=total/days*(1+(100-confidence)/100);
    return <ResultFirstShell resultColumns={3} inputs={<><Field label="Syllabus study hours" value={v.a} onChange={set('a')} /><Field label="Days remaining" value={v.b} onChange={set('b')} /><Field label="Current confidence (%)" value={v.c} onChange={set('c')} /></>} result={<><Result title="Recommended daily study" value={`${daily.toFixed(1)} hours`} /><Result title="Weekly target" value={`${(daily*7).toFixed(1)} hours`} /><Result title="Session plan" value={`${Math.ceil(daily*2)} × 30 min`} note="Use short focused sessions and reserve the final 20% for revision." /></>} />;
  }
  const area=n(v.a)*n(v.b), coats=Math.max(1,n(v.c)), coverage=Math.max(1,n(v.d)), doors=n(v.e), windows=n(v.f), paint=Math.max(0,(area-doors*1.9-windows*1.4)*coats/coverage);
  return <ResultFirstShell inputs={<><Field label="Room perimeter (metres)" value={v.a} onChange={set('a')} /><Field label="Wall height (metres)" value={v.b} onChange={set('b')} /><Field label="Number of coats" value={v.c} onChange={set('c')} /><Field label="Coverage per litre (m²)" value={v.d} onChange={set('d')} /><Field label="Doors" value={v.e} onChange={set('e')} /><Field label="Windows" value={v.f} onChange={set('f')} /></>} result={<><Result title="Paint required" value={`${(paint*1.1).toFixed(1)} litres`} note="Includes a 10% allowance for waste and touch-ups." /><Result title="Paintable wall area" value={`${Math.max(0, area-doors*1.9-windows*1.4).toFixed(1)} m²`} /></>} />;
}

function MessageRewriter() {
  const [text,setText]=useState('Send this today. You are already late and this is causing problems.');
  const [workflow,setWorkflow]=useState('Angry Message to Professional Message');
  const [tone,setTone]=useState('Professional');
  const [recipient,setRecipient]=useState('');
  const [goal,setGoal]=useState('Confirm the delivery time');
  const output=useMemo(()=>{
    let clean=text.trim()
      .replace(/\b(asap|immediately|right now)\b/gi,'as soon as practical')
      .replace(/you (?:are|'re) (?:already )?late/gi,'the expected timeline has passed')
      .replace(/this is (?:causing|creating) problems/gi,'this is affecting the schedule')
      .replace(/this is (?:ridiculous|unacceptable|terrible)/gi,'this situation needs prompt attention')
      .replace(/you (?:never|always)/gi,'there have been occasions when')
      .replace(/\bfix it\b/gi,'please help resolve it')
      .replace(/!+/g,'.').replace(/\s+/g,' ').trim();
    if(!clean)return '';
    clean=clean.charAt(0).toUpperCase()+clean.slice(1);
    const name=recipient.trim()?` ${recipient.trim()}`:'';
    const greeting=workflow==='Polite Email Rewriter'?`Subject: ${goal.trim()||'Follow-up'}\n\nDear${name||' Sir/Madam'},`:`Assalamu Alaikum${name},`;
    const context=workflow==='Angry Message to Professional Message'?'I’m writing to address this constructively. ':'';
    const request=goal.trim()?` Could you please ${goal.trim().replace(/^[A-Z]/,c=>c.toLowerCase())}?`:tone==='Firm'?' Please confirm the next step and completion time.':' Please let me know how we can move forward.';
    const close=tone==='Firm'?'I would appreciate a clear update by the agreed deadline.':'Thank you for your time and assistance.';
    return `${greeting}\n\n${context}${clean}${request}\n\n${close}\n\nRegards`;
  },[text,workflow,tone,recipient,goal]);
  return <Shell inputs={<><Select label="Rewriter workflow" value={workflow} onChange={setWorkflow} options={['Polite Email Rewriter','Angry Message to Professional Message','General Professional Rewrite']}/><Area label="Original message" value={text} onChange={setText}/><div className="grid gap-3 sm:grid-cols-2"><Field label="Recipient name (optional)" value={recipient} onChange={setRecipient} type="text"/><Select label="Tone" value={tone} onChange={setTone} options={['Professional','Polite','Firm']}/></div><Field label="Desired outcome" value={goal} onChange={setGoal} type="text"/><p className="text-xs leading-5 text-gray-500">The rewriter softens hostile phrasing while preserving the factual request. Review names, dates and commitments before sending.</p></>} result={<><Area label="Rewritten professional message" value={output} onChange={()=>{}} rows={13}/><Copy text={output}/></>} />;
}
function WhatsAppReplyGenerator() {
  const [incoming, setIncoming] = useState('Hi, is this product available and how much does it cost?');
  const [context, setContext] = useState('Customer enquiry');
  const [tone, setTone] = useState('Friendly professional');
  const [length, setLength] = useState('Short');
  const [language, setLanguage] = useState('English');
  const [details, setDetails] = useState('The product is available. Price: ৳1,250. Delivery takes 2–3 working days.');
  const [customer, setCustomer] = useState('');
  const [product, setProduct] = useState('');
  const [phone, setPhone] = useState('');
  const [business, setBusiness] = useState('');
  const [signature, setSignature] = useState('');
  const [activePreset, setActivePreset] = useState('in-stock');
  const [reply, setReply] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [storageReady, setStorageReady] = useState(false);

  const presets = [
    { id: 'in-stock', label: 'In stock', labelBn: 'স্টকে আছে', type: 'Price or availability', en: 'The product is currently available. Price: [add price]. Delivery takes [add delivery time].', bn: 'পণ্যটি বর্তমানে স্টকে আছে। মূল্য: [মূল্য লিখুন]। ডেলিভারি হতে [সময় লিখুন] সময় লাগবে।' },
    { id: 'out-of-stock', label: 'Out of stock', labelBn: 'স্টক শেষ', type: 'Price or availability', en: 'This product is currently out of stock. Expected restock: [add date]. I can notify you when it becomes available.', bn: 'পণ্যটি বর্তমানে স্টকে নেই। সম্ভাব্য পুনরায় স্টকে আসার তারিখ: [তারিখ লিখুন]। পণ্যটি পাওয়া গেলে আমরা আপনাকে জানাতে পারি।' },
    { id: 'confirmed', label: 'Order confirmed', labelBn: 'অর্ডার নিশ্চিত', type: 'Order confirmation', en: 'Your order has been confirmed. Order number: [add number]. Expected delivery: [add date].', bn: 'আপনার অর্ডারটি নিশ্চিত হয়েছে। অর্ডার নম্বর: [নম্বর লিখুন]। সম্ভাব্য ডেলিভারির তারিখ: [তারিখ লিখুন]।' },
    { id: 'on-way', label: 'On the way', labelBn: 'ডেলিভারি চলছে', type: 'Delivery update', en: 'Your order is on the way. Tracking information: [add tracking link or number].', bn: 'আপনার অর্ডারটি ডেলিভারির পথে রয়েছে। ট্র্যাকিং তথ্য: [ট্র্যাকিং লিংক বা নম্বর লিখুন]।' },
    { id: 'payment', label: 'Payment details', labelBn: 'পেমেন্টের তথ্য', type: 'Customer enquiry', en: 'You can pay using [add payment method]. Payment details: [add account or instructions].', bn: 'আপনি [পেমেন্ট পদ্ধতি লিখুন]-এর মাধ্যমে পেমেন্ট করতে পারবেন। পেমেন্টের তথ্য: [অ্যাকাউন্ট বা নির্দেশনা লিখুন]।' },
    { id: 'complaint', label: 'Resolve complaint', labelBn: 'অভিযোগ সমাধান', type: 'Complaint response', en: 'I’m sorry about this experience. Please share your order number and a photo or video of the issue so we can resolve it quickly.', bn: 'এই অভিজ্ঞতার জন্য আমরা আন্তরিকভাবে দুঃখিত। দ্রুত সমাধানের জন্য অনুগ্রহ করে আপনার অর্ডার নম্বর এবং সমস্যাটির একটি ছবি বা ভিডিও পাঠান।' },
  ];

  useEffect(() => {
    if (!activePreset) return;
    const preset = presets.find((item) => item.id === activePreset);
    if (preset) setDetails(language === 'বাংলা' ? preset.bn : preset.en);
  }, [language, activePreset]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('contra-whatsapp-reply') || '{}') as { business?: string; signature?: string; language?: string; recent?: string[] };
      if (saved.business) setBusiness(saved.business);
      if (saved.signature) setSignature(saved.signature);
      if (saved.language) setLanguage(saved.language);
      if (Array.isArray(saved.recent)) setRecent(saved.recent.slice(0, 5));
    } catch { /* Ignore invalid local-only preferences. */ }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem('contra-whatsapp-reply', JSON.stringify({ business, signature, language, recent }));
  }, [business, signature, language, recent, storageReady]);

  const generated = useMemo(() => {
    if (!incoming.trim()) return '';
    const isBn = language === 'বাংলা';
    const namedCustomer = customer.trim() ? ` ${customer.trim()}` : '';
    const open = isBn
      ? tone === 'Warm' ? `আসসালামু আলাইকুম${namedCustomer}! যোগাযোগ করার জন্য ধন্যবাদ।` : tone === 'Direct' ? `আসসালামু আলাইকুম${namedCustomer}।` : `আসসালামু আলাইকুম${namedCustomer}, আপনার বার্তার জন্য ধন্যবাদ।`
      : tone === 'Warm' ? `Assalamu Alaikum${namedCustomer}! Thanks so much for reaching out.` : tone === 'Direct' ? `Assalamu Alaikum${namedCustomer}.` : `Assalamu Alaikum${namedCustomer}, thank you for your message.`;
    const supplied = details.trim();
    const fallback: Record<string, [string, string]> = {
      'Customer enquiry': ['I’d be happy to help with your enquiry.', 'আপনার প্রশ্নের বিষয়ে সাহায্য করতে পেরে আনন্দিত হব।'],
      'Price or availability': ['I’ll confirm the latest price and availability for you.', 'আমি আপনার জন্য সর্বশেষ মূল্য ও স্টকের তথ্য নিশ্চিত করছি।'],
      'Order confirmation': ['Your order details have been received and are being confirmed.', 'আপনার অর্ডারের তথ্য পাওয়া গেছে এবং নিশ্চিত করা হচ্ছে।'],
      'Delivery update': ['I’m checking the delivery status and will update you shortly.', 'আমি ডেলিভারির অবস্থা যাচাই করছি এবং শিগগিরই জানাচ্ছি।'],
      'Complaint response': ['I’m sorry about this experience. We’re reviewing the issue and will help resolve it.', 'এই অভিজ্ঞতার জন্য আমরা দুঃখিত। বিষয়টি যাচাই করে সমাধানে সহায়তা করছি।'],
      'Supplier reply': ['Thank you for the update. Please share the relevant price, lead time, and shipping details.', 'আপডেটের জন্য ধন্যবাদ। অনুগ্রহ করে মূল্য, প্রস্তুতির সময় ও শিপিংয়ের তথ্য দিন।'],
      'Delayed reply': ['Sorry for the delayed response, and thank you for your patience.', 'দেরিতে উত্তর দেওয়ার জন্য দুঃখিত এবং অপেক্ষা করার জন্য ধন্যবাদ।'],
      'General reply': ['Thank you for the information.', 'তথ্য দেওয়ার জন্য ধন্যবাদ।'],
    };
    const mainText = supplied || fallback[context]?.[isBn ? 1 : 0] || fallback['General reply'][isBn ? 1 : 0];
    const productLine = product.trim() ? (isBn ? `পণ্য: ${product.trim()}।` : `Product: ${product.trim()}.`) : '';
    const main = [productLine, mainText].filter(Boolean).join(' ');
    const close = isBn
      ? tone === 'Direct' ? 'প্রয়োজনে আরও তথ্য জানান।' : 'আর কোনো প্রশ্ন থাকলে নির্দ্বিধায় জানাবেন। ধন্যবাদ।'
      : tone === 'Direct' ? 'Let me know if you need anything else.' : 'Please let me know if you have any other questions. Thank you!';
    const signOff = [signature.trim(), business.trim()].filter(Boolean).join(isBn ? '\n' : '\n');
    if (length === 'Very short') return `${open} ${main}${signOff ? `\n${signOff}` : ''}`;
    if (length === 'Detailed') {
      const reassurance = isBn ? 'আপনার প্রয়োজন অনুযায়ী পরবর্তী পদক্ষেপে আমরা সহায়তা করব।' : 'We’ll be happy to help with the next step based on what you need.';
      return `${open}\n\n${main}\n\n${reassurance}\n\n${close}${signOff ? `\n\n${signOff}` : ''}`;
    }
    return `${open}\n\n${main}\n\n${close}${signOff ? `\n\n${signOff}` : ''}`;
  }, [incoming, context, tone, length, language, details, customer, product, business, signature]);

  useEffect(() => setReply(generated), [generated]);

  const remember = (text: string) => {
    if (!text.trim()) return;
    setRecent((old) => [text, ...old.filter((item) => item !== text)].slice(0, 5));
  };
  const copyReply = async () => {
    if (!reply.trim()) return;
    await navigator.clipboard.writeText(reply);
    remember(reply);
    setNotice('Reply copied');
    setTimeout(() => setNotice(''), 1400);
  };
  const openWhatsApp = async () => {
    if (!reply.trim()) return;
    await navigator.clipboard.writeText(reply);
    remember(reply);
    const digits = phone.replace(/\D/g, '');
    window.open(digits ? `https://wa.me/${digits}?text=${encodeURIComponent(reply)}` : `https://wa.me/?text=${encodeURIComponent(reply)}`, '_blank', 'noopener,noreferrer');
  };

  return <Shell inputs={<>
    <div><p className="mb-2 text-sm font-medium text-gray-700">Quick replies</p><div className="flex flex-wrap gap-2">{presets.map((preset) => <button key={preset.id} type="button" className={`rounded-full border px-3 py-1.5 text-xs font-medium hover:border-gray-900 hover:text-gray-950 ${activePreset === preset.id ? 'border-gray-900 bg-gray-950 text-white' : 'border-gray-300 bg-white text-gray-700'}`} onClick={() => { setActivePreset(preset.id); setContext(preset.type); setDetails(language === 'বাংলা' ? preset.bn : preset.en); }}>{language === 'বাংলা' ? preset.labelBn : preset.label}</button>)}</div></div>
    <Area label="Message you received" value={incoming} onChange={setIncoming} rows={5} placeholder="Paste the WhatsApp message here" />
    <Select label="Reply type" value={context} onChange={setContext} options={['Customer enquiry','Price or availability','Order confirmation','Delivery update','Complaint response','Supplier reply','Delayed reply','General reply']} />
    <div className="grid gap-3 sm:grid-cols-2"><Field type="text" label="Customer name (optional)" value={customer} onChange={setCustomer} /><Field type="text" label="Product or order (optional)" value={product} onChange={setProduct} /></div>
    <Area label="Facts to include" value={details} onChange={(value) => { setActivePreset(''); setDetails(value); }} rows={4} placeholder={language === 'বাংলা' ? 'সঠিক মূল্য, স্টক, তারিখ, নীতি বা পরবর্তী পদক্ষেপ লিখুন' : 'Add the correct price, availability, date, policy, or next step'} />
    <div className="grid gap-3 sm:grid-cols-2"><Select label="Tone" value={tone} onChange={setTone} options={['Friendly professional','Warm','Direct']} /><Select label="Length" value={length} onChange={setLength} options={['Very short','Short','Detailed']} /></div>
    <Select label="Reply language" value={language} onChange={setLanguage} options={['English','বাংলা']} />
    <details className="rounded-xl border border-gray-200 bg-gray-50 p-4"><summary className="cursor-pointer text-sm font-semibold text-gray-900">Saved business defaults</summary><div className="mt-4 space-y-3"><Field type="text" label="Business name" value={business} onChange={setBusiness} placeholder="Added to replies automatically" /><Field type="text" label="Your name or signature" value={signature} onChange={setSignature} placeholder="For example: Nirob, Customer Support" /><Field type="tel" label="Customer WhatsApp number (optional)" value={phone} onChange={setPhone} placeholder="Include country code, for example 8801…" /><p className="text-xs text-gray-500">Business name, signature and language are saved on this device. Customer numbers are never saved.</p></div></details>
    <p className="text-xs leading-5 text-gray-500">Your message stays in this browser. Review prices, dates and promises before sending.</p>
  </>} result={<>
    <Area label="Edit your WhatsApp-ready reply" value={reply} onChange={setReply} rows={10} />
    <div className="rounded-2xl rounded-tl-sm bg-[#e7ffdb] p-4 text-sm leading-6 text-gray-900 shadow-sm whitespace-pre-wrap">{reply || 'Your reply will appear here.'}</div>
    <div className="flex flex-wrap gap-2"><button className={buttonClass} disabled={!reply.trim()} onClick={copyReply}>{notice || 'Copy reply'}</button><button className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50" disabled={!reply.trim()} onClick={openWhatsApp}>Copy &amp; open WhatsApp</button></div>
    {recent.length > 0 && <div className="border-t border-gray-200 pt-4"><div className="mb-2 flex items-center justify-between"><p className="text-sm font-semibold text-gray-900">Recent replies</p><button className="text-xs font-medium text-gray-500 hover:text-gray-900" onClick={() => setRecent([])}>Clear</button></div><div className="space-y-2">{recent.map((item, index) => <button key={`${item}-${index}`} type="button" className="block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-left text-xs leading-5 text-gray-600 hover:border-gray-400" onClick={() => setReply(item)}>{item.length > 150 ? `${item.slice(0, 150)}…` : item}</button>)}</div></div>}
  </>} />;
}
function SupplierMessage() {
  const [product,setProduct]=useState('Stainless steel water bottle'); const [qty,setQty]=useState('500'); const [purpose,setPurpose]=useState('Quotation request');
  const output=`Hello,\n\nWe are interested in ${product} for an initial order of ${qty} units. ${purpose==='Quotation request'?'Please share your best unit price, MOQ, production lead time, packaging details, sample cost, and available shipping terms.':purpose==='Sample request'?'Please confirm sample availability, sample cost, courier charge, specifications, and delivery time.':'Please provide the current production and shipping status, including the expected completion date.'}\n\nPlease also send recent product photos and applicable certifications.\n\nThank you.`;
  return <Shell inputs={<><Field type="text" label="Product" value={product} onChange={setProduct}/><Field label="Quantity" value={qty} onChange={setQty}/><Select label="Message purpose" value={purpose} onChange={setPurpose} options={['Quotation request','Sample request','Order follow-up']}/></>} result={<><Area label="Supplier-ready message" value={output} onChange={()=>{}}/><Copy text={output}/></>} />;
}
function ScriptTimer() { const [text,setText]=useState('Paste your video script here to calculate its speaking time.'); const [wpm,setWpm]=useState('135'); const words=text.trim()?text.trim().split(/\s+/).length:0, seconds=wpm?Math.round(words/n(wpm)*60):0; return <Shell inputs={<><Area label="Video script" value={text} onChange={setText} rows={12}/><Field label="Speaking speed (words/minute)" value={wpm} onChange={setWpm}/></>} result={<><Result title="Estimated duration" value={`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`} /><Result title="Word count" value={`${words}`} /><Result title="Recommended scene count" value={`${Math.max(1,Math.ceil(seconds/8))}`} note="Based on a visual change approximately every eight seconds." /></>} />; }
function CaptionFormatter() { const [text,setText]=useState('New collection available now. Order today. #fashion #bangladesh'); const [width,setWidth]=useState('42'); const output=useMemo(()=>text.split(/\s+/).reduce((lines:string[],word)=>{const last=lines.at(-1)||''; if(!last||last.length+word.length+1>n(width))lines.push(word); else lines[lines.length-1]=`${last} ${word}`; return lines},[]).join('\n'),[text,width]); return <Shell inputs={<><Area label="Caption" value={text} onChange={setText}/><Field label="Maximum characters per line" value={width} onChange={setWidth}/></>} result={<><Area label="Formatted caption" value={output} onChange={()=>{}}/><Copy text={output}/></>} />; }

function Teleprompter() {
  const [text,setText]=useState('Welcome. Paste your script here, then start the teleprompter.'); const [speed,setSpeed]=useState('35'); const screen=useRef<HTMLDivElement>(null);
  const start=()=>{screen.current?.requestFullscreen(); const el=screen.current; if(!el)return; const id=setInterval(()=>{el.scrollTop+=1;if(el.scrollTop+el.clientHeight>=el.scrollHeight)clearInterval(id)},Math.max(15,80-n(speed)));};
  return <div className="space-y-4"><Area label="Script" value={text} onChange={setText} rows={8}/><div className="flex gap-3"><Field label="Scroll speed" value={speed} onChange={setSpeed}/><button className={buttonClass} onClick={start}>Start full screen</button></div><div ref={screen} className="h-[460px] overflow-y-auto bg-black px-[10vw] py-[35vh] text-center text-4xl font-semibold leading-relaxed text-white">{text}</div></div>;
}

function UtmBuilder() { const [base,setBase]=useState('https://example.com/product'); const [source,setSource]=useState('facebook'); const [medium,setMedium]=useState('social'); const [campaign,setCampaign]=useState('summer-sale'); const output=useMemo(()=>{try{const u=new URL(base);u.searchParams.set('utm_source',source);u.searchParams.set('utm_medium',medium);u.searchParams.set('utm_campaign',campaign);return u.toString()}catch{return 'Enter a valid URL including https://'}},[base,source,medium,campaign]); return <Shell inputs={<><Field type="url" label="Destination URL" value={base} onChange={setBase}/><Field type="text" label="Campaign source" value={source} onChange={setSource}/><Field type="text" label="Campaign medium" value={medium} onChange={setMedium}/><Field type="text" label="Campaign name" value={campaign} onChange={setCampaign}/></>} result={<><Area label="Tagged campaign URL" value={output} onChange={()=>{}} rows={5}/><Copy text={output}/></>} />; }
function SocialPreview() { const [url,setUrl]=useState('example.com'); const [title,setTitle]=useState('A clear, compelling page title'); const [desc,setDesc]=useState('Write a concise description that tells people what they will find after clicking.'); const [image,setImage]=useState(''); return <Shell inputs={<><Field type="text" label="Domain" value={url} onChange={setUrl}/><Field type="text" label="Share title" value={title} onChange={setTitle}/><Area label="Description" value={desc} onChange={setDesc} rows={4}/><Field type="url" label="Image URL (optional)" value={image} onChange={setImage}/></>} result={<div className="overflow-hidden rounded-xl border border-gray-300 bg-white">{image?<img src={image} alt="Social preview" className="aspect-[1.91/1] w-full object-cover"/>:<div className="aspect-[1.91/1] bg-gradient-to-br from-gray-100 to-gray-200"/>}<div className="p-4"><p className="text-xs uppercase text-gray-500">{url}</p><h3 className="mt-1 font-bold text-gray-950">{title}</h3><p className="mt-1 line-clamp-2 text-sm text-gray-600">{desc}</p></div></div>} />; }

function ImageTool({ tool }: { tool: 'product-photo-cleaner'|'social-image-resizer'|'passport-photo-maker' }) {
  const [src,setSrc]=useState(''); const [preset,setPreset]=useState(tool==='passport-photo-maker'?'600×600':'1080×1080'); const canvas=useRef<HTMLCanvasElement>(null);
  const load=(file?:File)=>{if(!file)return;const reader=new FileReader();reader.onload=()=>setSrc(String(reader.result));reader.readAsDataURL(file)};
  const render=()=>{const c=canvas.current;if(!c||!src)return;const [w,h]=preset.split('×').map(Number);c.width=w;c.height=h;const ctx=c.getContext('2d');if(!ctx)return;const img=new Image();img.onload=()=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);const scale=tool==='passport-photo-maker'?Math.max(w/img.width,h/img.height):Math.min(w/img.width,h/img.height);const dw=img.width*scale,dh=img.height*scale;ctx.drawImage(img,(w-dw)/2,(h-dh)/2,dw,dh);if(tool==='product-photo-cleaner'){const data=ctx.getImageData(0,0,w,h);for(let i=0;i<data.data.length;i+=4){const avg=(data.data[i]+data.data[i+1]+data.data[i+2])/3;if(avg>225){data.data[i]=255;data.data[i+1]=255;data.data[i+2]=255}}ctx.putImageData(data,0,0)} };img.src=src};
  const download=()=>{render();setTimeout(()=>{const a=document.createElement('a');a.download=`${tool}.png`;a.href=canvas.current?.toDataURL('image/png')||'';a.click()},80)};
  return <Shell inputs={<><label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Choose image</span><input className={fieldClass} type="file" accept="image/*" onChange={(e)=>load(e.target.files?.[0])}/></label><Select label="Output size" value={preset} onChange={setPreset} options={tool==='passport-photo-maker'?['600×600','413×531','600×800']:['1080×1080','1080×1350','1080×1920','1200×628']}/><button className={buttonClass} disabled={!src} onClick={render}>Generate preview</button></>} result={<><canvas ref={canvas} className="max-h-[500px] max-w-full border border-gray-200 bg-white"/><button className={buttonClass} disabled={!src} onClick={download}>Download PNG</button><p className="text-xs text-gray-500">Processed locally in your browser. Product cleaning normalizes near-white backgrounds; complex background removal may require manual refinement.</p></>} />;
}
