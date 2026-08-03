'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { calcInvoice, type InvoiceItem } from '../logic/invoice';
import { CtaCard, DropdownControl, useResultTracking, type ToolProps } from './ui';

export type InvoiceGeneratorProps = ToolProps;
type Template = 'editorial' | 'classic' | 'minimal' | 'bold';
type InvoiceFont = 'sans' | 'serif' | 'mono';
type PaperSize = 'A4' | 'A5';
type DiscountType = 'fixed' | 'percent';
type Row = { id: string; name: string; description: string; qty: string; price: string };
type Draft = {
  business: string; businessDetails: string; customer: string; customerDetails: string;
  invoiceNo: string; issueDate: string; currency: string; language: string;
  taxLabel: string; taxRate: string; delivery: string; discount: string; discountType: DiscountType;
  notes: string; terms: string; payment: string; accent: string; template: Template; logo: string;
  documentTitle: string; font: InvoiceFont; logoSize: string; showSignature: boolean;
  paperSize: PaperSize;
  rows: Row[];
};

const STORAGE_KEY = 'contra-invoice-draft-v3';
const today = () => new Date().toISOString().slice(0, 10);
const row = (name = '', qty = '1', price = ''): Row => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name, description: '', qty, price,
});
const initialDraft = (): Draft => ({
  business: 'Contra Digital',
  businessDetails: 'House 57, Road 22, Rupnagar Abashik\nDhaka, Bangladesh\nagencycontradigital@gmail.com',
  customer: 'Norvex',
  customerDetails: 'Sadelmakaregatan 5\n252 48 Helsingborg, Sweden\nekonomi@norvex.se',
  invoiceNo: '00135', issueDate: today(), currency: 'BDT', language: 'bn-BD',
  taxLabel: 'কর', taxRate: '0', delivery: '0', discount: '0', discountType: 'fixed',
  notes: 'আমাদের সঙ্গে ব্যবসা করার জন্য ধন্যবাদ।',
  terms: 'উল্লিখিত তারিখের মধ্যে পেমেন্ট সম্পন্ন করুন এবং পেমেন্টের সঙ্গে ইনভয়েস নম্বরটি উল্লেখ করুন।',
  payment: 'ব্যাংক, মোবাইল ওয়ালেট অথবা পেমেন্টের নির্দেশনা এখানে লিখুন।',
  accent: '#b7965a', template: 'editorial', logo: '',
  documentTitle: 'ইনভয়েস', font: 'sans', logoSize: '64', showSignature: true,
  paperSize: 'A4',
  rows: [row('Preem Website Development', '1', '400')],
});
const currencies = ['BDT', 'USD', 'EUR', 'GBP', 'SEK', 'INR', 'CAD', 'AUD', 'JPY', 'AED'];
const tabs = ['Details', 'Parties', 'Items', 'Payment', 'Design'] as const;
type Tab = typeof tabs[number];
const bnText: Record<string, string> = {
  Details: 'বিবরণ', Parties: 'পক্ষসমূহ', Items: 'পণ্য/সেবা', Payment: 'পেমেন্ট', Design: 'ডিজাইন',
  'Invoice number': 'ইনভয়েস নম্বর', Currency: 'মুদ্রা', 'Invoice date': 'ইনভয়েসের তারিখ', Language: 'ভাষা',
  'Your business / name': 'আপনার ব্যবসা / নাম', 'Your address, email, tax ID': 'আপনার ঠিকানা, ইমেইল ও ট্যাক্স আইডি',
  'Client / company': 'ক্রেতা / প্রতিষ্ঠান', 'Client address and contact': 'ক্রেতার ঠিকানা ও যোগাযোগ',
  Name: 'নাম', 'Description (optional)': 'বিবরণ (ঐচ্ছিক)', Quantity: 'পরিমাণ', Rate: 'দর', Remove: 'মুছুন',
  'Add line item': 'নতুন আইটেম যোগ করুন', 'Discount type': 'ছাড়ের ধরন', fixed: 'নির্দিষ্ট', percent: 'শতাংশ',
  Discount: 'ছাড়', 'Tax label': 'করের নাম', 'Tax rate': 'করের হার', 'Shipping / delivery': 'শিপিং / ডেলিভারি',
  'Payment details': 'পেমেন্টের তথ্য', Notes: 'নোট', Terms: 'শর্তাবলি', 'Design preset': 'ডিজাইন ধরন',
  'Document title': 'ডকুমেন্টের শিরোনাম', 'Paper size': 'কাগজের আকার', Typography: 'ফন্টের ধরন',
  'Logo height': 'লোগোর উচ্চতা', 'Brand accent': 'ব্র্যান্ডের রং', 'Business logo': 'ব্যবসার লোগো',
  'Choose image file': 'ছবির ফাইল বাছাই করুন', 'Replace image': 'ছবি পরিবর্তন করুন',
  'Authorized signature line': 'অনুমোদিত স্বাক্ষরের লাইন', Reset: 'রিসেট', 'Packing slip': 'প্যাকিং স্লিপ',
  'Print preview': 'প্রিন্ট প্রিভিউ', 'Draft saved on this device': 'ড্রাফট এই ডিভাইসে সংরক্ষিত',
  'Saving changes…': 'পরিবর্তন সংরক্ষণ হচ্ছে…', From: 'প্রেরক', 'Bill to': 'প্রাপক', Description: 'বিবরণ',
  Qty: 'পরিমাণ', Amount: 'মোট', Subtotal: 'উপমোট', Tax: 'কর', Shipping: 'শিপিং', Total: 'সর্বমোট',
  'Authorized signature': 'অনুমোদিত স্বাক্ষর', Date: 'তারিখ', Issued: 'তারিখ',
};

const n = (value: string) => Number.parseFloat(value) || 0;
const displayDate = (value: string) => {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}-${month}-${year}` : value;
};
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
}[char] || char));
const lines = (value: string) => escapeHtml(value).replace(/\n/g, '<br>');

export function InvoiceGenerator({
  brand = 'Contra Commerce',
  ctaText = 'Automate invoices with Contra Commerce',
  ctaUrl = '#',
  className = '',
}: InvoiceGeneratorProps) {
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [activeTab, setActiveTab] = useState<Tab>('Details');
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDraft({ ...initialDraft(), ...JSON.parse(stored) });
    } catch { /* use the starter draft */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); setSaved(true); }
      catch { setSaved(false); }
    }, 500);
    setSaved(false);
    return () => clearTimeout(timer);
  }, [draft, ready]);

  const items: InvoiceItem[] = useMemo(() => draft.rows.map((item) => ({
    name: item.name, description: item.description, qty: n(item.qty), price: n(item.price),
  })), [draft.rows]);
  const result = useMemo(() => calcInvoice({
    items, deliveryCharge: n(draft.delivery), discount: n(draft.discount),
    discountType: draft.discountType, taxRate: n(draft.taxRate),
  }), [items, draft.delivery, draft.discount, draft.discountType, draft.taxRate]);
  const bangla = draft.language === 'bn-BD';
  const tx = (key: string) => bangla ? (bnText[key] || key) : key;
  const numberFormat = (value: number) => new Intl.NumberFormat(draft.language, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(value);
  const money = (value: number) => draft.currency === 'BDT'
    ? `৳${numberFormat(value)}`
    : new Intl.NumberFormat(draft.language, { style: 'currency', currency: draft.currency, minimumFractionDigits: 2 }).format(value);
  useResultTracking('invoice-generator', { currency: draft.currency, items: items.length, total: result.grandTotal });

  const patch = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((old) => ({ ...old, [key]: value }));
  const setLanguage = (language: string) => setDraft((old) => {
    const toBangla = language === 'bn-BD';
    return {
      ...old,
      language,
      documentTitle: ['Invoice', 'ইনভয়েস'].includes(old.documentTitle) ? (toBangla ? 'ইনভয়েস' : 'Invoice') : old.documentTitle,
      taxLabel: ['Tax', 'কর'].includes(old.taxLabel) ? (toBangla ? 'কর' : 'Tax') : old.taxLabel,
      notes: ['Thank you for your business.', 'আমাদের সঙ্গে ব্যবসা করার জন্য ধন্যবাদ।'].includes(old.notes) ? (toBangla ? 'আমাদের সঙ্গে ব্যবসা করার জন্য ধন্যবাদ।' : 'Thank you for your business.') : old.notes,
      payment: ['Add bank, mobile wallet, or payment instructions here.', 'ব্যাংক, মোবাইল ওয়ালেট অথবা পেমেন্টের নির্দেশনা এখানে লিখুন।'].includes(old.payment) ? (toBangla ? 'ব্যাংক, মোবাইল ওয়ালেট অথবা পেমেন্টের নির্দেশনা এখানে লিখুন।' : 'Add bank, mobile wallet, or payment instructions here.') : old.payment,
      terms: ['Payment is due by the date shown above. Please reference the invoice number with your payment.', 'উল্লিখিত তারিখের মধ্যে পেমেন্ট সম্পন্ন করুন এবং পেমেন্টের সঙ্গে ইনভয়েস নম্বরটি উল্লেখ করুন।'].includes(old.terms) ? (toBangla ? 'উল্লিখিত তারিখের মধ্যে পেমেন্ট সম্পন্ন করুন এবং পেমেন্টের সঙ্গে ইনভয়েস নম্বরটি উল্লেখ করুন।' : 'Payment is due by the date shown above. Please reference the invoice number with your payment.') : old.terms,
    };
  });
  const patchRow = (id: string, values: Partial<Row>) => patch('rows', draft.rows.map((item) => item.id === id ? { ...item, ...values } : item));
  const addRow = () => patch('rows', [...draft.rows, row()]);
  const removeRow = (id: string) => patch('rows', draft.rows.length === 1 ? [row()] : draft.rows.filter((item) => item.id !== id));
  const reset = () => {
    if (typeof window !== 'undefined' && !window.confirm('Clear this invoice and restore the sample?')) return;
    const fresh = initialDraft(); setDraft(fresh); localStorage.removeItem(STORAGE_KEY);
  };
  const uploadLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 1_500_000) {
      window.alert('Choose a PNG, JPG, WebP, or SVG smaller than 1.5 MB.'); return;
    }
    const reader = new FileReader(); reader.onload = () => patch('logo', String(reader.result || '')); reader.readAsDataURL(file);
  };

  const downloadPdf = async () => {
    const paper = document.querySelector<HTMLElement>('[data-invoice-paper]');
    if (!paper || downloading) return;
    setDownloading(true);
    const previousTransform = paper.style.transform;
    const holder = paper.parentElement;
    const previousOverflow = holder?.style.overflow;
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      paper.style.transform = 'none';
      if (holder) holder.style.overflow = 'visible';
      await document.fonts.ready;
      const canvas = await html2canvas(paper, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: draft.paperSize.toLowerCase() });
      const width = draft.paperSize === 'A5' ? 148 : 210;
      const height = draft.paperSize === 'A5' ? 210 : 297;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height, undefined, 'FAST');
      pdf.save(`invoice-${draft.invoiceNo || 'draft'}.pdf`);
    } catch {
      window.alert('Could not create the PDF. Please try again.');
    } finally {
      paper.style.transform = previousTransform;
      if (holder) holder.style.overflow = previousOverflow ?? '';
      setDownloading(false);
    }
  };

  const printDocument = async (kind: 'invoice' | 'packing' | 'thermal') => {
    if (kind === 'invoice') {
      const popup = window.open('', '_blank', 'width=980,height=900');
      if (!popup) { window.alert('Allow pop-ups to open the print-ready invoice.'); return; }
      popup.document.write('<!doctype html><html><body style="font-family:Arial,sans-serif;padding:24px">Preparing print preview…</body></html>');
      popup.document.close();
      const paper = document.querySelector<HTMLElement>('[data-invoice-paper]');
      if (!paper) { popup.close(); return; }
      const holder = paper.parentElement;
      const previousTransform = paper.style.transform;
      const previousShadow = paper.style.boxShadow;
      const previousOverflow = holder?.style.overflow;
      try {
        const { default: html2canvas } = await import('html2canvas');
        await document.fonts.ready;
        paper.style.transform = 'none';
        paper.style.boxShadow = 'none';
        if (holder) holder.style.overflow = 'visible';
        const canvas = await html2canvas(paper, {
          backgroundColor: '#ffffff',
          scale: 3,
          useCORS: true,
          logging: false,
        });
        const image = canvas.toDataURL('image/png');
        popup.document.open();
        popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${escapeHtml(draft.invoiceNo)}</title><style>@page{size:auto;margin:10mm}*{box-sizing:border-box}html,body{margin:0;padding:0;background:white}main{width:100%;margin:0 auto}img{display:block;width:100%;height:auto;image-rendering:auto;-webkit-print-color-adjust:exact;print-color-adjust:exact}@media print{main{break-inside:avoid}}</style></head><body><main><img src="${image}" alt="Invoice"></main><script>const image=document.querySelector('img');const ready=()=>setTimeout(()=>print(),50);image.complete?ready():image.addEventListener('load',ready)</script></body></html>`);
        popup.document.close();
      } catch {
        popup.close();
        window.alert('Could not prepare the print preview. Please try again.');
      } finally {
        paper.style.transform = previousTransform;
        paper.style.boxShadow = previousShadow;
        if (holder) holder.style.overflow = previousOverflow ?? '';
      }
      return;
    }
    const pricedRows = result.lines.map((item) => `<tr><td><strong>${escapeHtml(item.name || 'Untitled item')}</strong>${item.description ? `<small>${escapeHtml(item.description)}</small>` : ''}</td><td class="number">${item.qty}</td>${kind === 'packing' ? '' : `<td class="number">${money(item.price)}</td><td class="number">${money(item.total)}</td>`}</tr>`).join('');
    const logo = draft.logo ? `<img class="logo" src="${draft.logo}" alt="">` : `<div class="wordmark">${escapeHtml(draft.business).slice(0, 2).toUpperCase()}</div>`;
    const documentTitle = kind === 'packing' ? tx('Packing slip') : bangla && draft.documentTitle === 'Invoice' ? 'ইনভয়েস' : draft.documentTitle || tx('Invoice');
    const fontFamily = bangla ? '"Hind Siliguri",sans-serif' : draft.font === 'serif' ? 'Georgia,serif' : draft.font === 'mono' ? 'Courier New,monospace' : 'Arial,sans-serif';
    const totals = kind === 'packing' ? `<section class="packing-summary"><span><small>${bangla ? 'লাইন আইটেম' : 'Line items'}</small><b>${result.lines.length}</b></span><span><small>${bangla ? 'মোট পরিমাণ' : 'Total quantity'}</small><b>${result.totalItems}</b></span></section>` : `<div class="totals"><p><span>${tx('Subtotal')}</span><b>${money(result.subtotal)}</b></p>${result.discount ? `<p><span>${tx('Discount')}</span><b>−${money(result.discount)}</b></p>` : ''}${result.tax ? `<p><span>${bangla && draft.taxLabel === 'Tax' ? 'কর' : escapeHtml(draft.taxLabel)} (${n(draft.taxRate)}%)</span><b>${money(result.tax)}</b></p>` : ''}${result.deliveryCharge ? `<p><span>${tx('Shipping')}</span><b>${money(result.deliveryCharge)}</b></p>` : ''}<p class="grand"><span>${tx('Total')}</span><b>${money(result.grandTotal)}</b></p></div>`;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${kind === 'packing' ? 'Packing slip' : 'Invoice'} ${escapeHtml(draft.invoiceNo)}</title><style>
      @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');@page{size:${kind === 'thermal' ? '80mm auto' : 'auto'};margin:0}*{box-sizing:border-box}body{margin:0;color:#15171b;font:14px/1.55 ${fontFamily};-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{width:${kind === 'thermal' ? '80mm' : '100%'};min-height:auto;padding:${kind === 'thermal' ? '8mm 5mm' : draft.paperSize === 'A5' ? '12mm' : '18mm'};margin:auto}.header{display:flex;justify-content:space-between;gap:30px;align-items:flex-start;border-bottom:${draft.template === 'minimal' ? `1px solid ${draft.accent}` : `2px solid ${draft.accent}`};padding-bottom:20px;${draft.template === 'bold' ? `background:${draft.accent};padding:18px;color:white;border:0` : ''}}.brand{display:flex;gap:14px;align-items:center}.logo{max-width:180px;max-height:${Math.max(36, Math.min(100, n(draft.logoSize)))}px}.wordmark{width:52px;height:52px;background:${draft.template === 'bold' ? '#17191d' : draft.accent};display:grid;place-items:center;color:white;font-weight:800;font-size:20px}.title{text-align:right}.title h1{margin:0;font-size:${kind === 'thermal' ? '24px' : draft.paperSize === 'A5' ? '26px' : '34px'};font-weight:300;letter-spacing:${bangla ? '.02em' : '.18em'};text-transform:${bangla ? 'none' : 'uppercase'}}.muted,small{display:block;color:#69707d;font-size:11px}.meta{margin-top:10px}.meta b{color:inherit}.parties{display:grid;grid-template-columns:1fr 1fr;gap:${draft.paperSize === 'A5' ? '20px' : '40px'};margin:${draft.paperSize === 'A5' ? '20px' : '28px'} 0}.eyebrow{color:${draft.accent};font-size:10px;text-transform:${bangla ? 'none' : 'uppercase'};letter-spacing:${bangla ? '.02em' : '.2em'};font-weight:700}.party h2{font-size:15px;margin:5px 0 2px}.party p{margin:0;color:#464b55}.items{width:100%;border-collapse:collapse}.items th{background:${draft.template === 'minimal' ? 'transparent' : draft.accent};color:${draft.template === 'minimal' ? draft.accent : 'white'};border-bottom:${draft.template === 'minimal' ? `2px solid ${draft.accent}` : '0'};text-align:left;font-size:10px;text-transform:${bangla ? 'none' : 'uppercase'};letter-spacing:${bangla ? '0' : '.12em'};padding:11px}.items td{border-bottom:1px solid #e5e7eb;padding:11px}.number{text-align:right!important}.totals{width:${draft.paperSize === 'A5' ? '250px' : '300px'};margin:20px 0 0 auto}.totals p{display:flex;justify-content:space-between;margin:0;padding:6px 0;color:#4b515c}.totals .grand{background:${draft.accent};color:white;padding:13px 15px;margin-top:6px;font-size:16px}.totals small{display:inline;color:#ddd;margin-left:4px}.item-count{text-align:right;font-size:16px;margin-top:18px}.footer{margin-top:34px;display:grid;grid-template-columns:1fr 1fr;gap:${draft.paperSize === 'A5' ? '20px' : '30px'}}.panel{background:#f5f6f7;border-left:3px solid ${draft.accent};padding:14px}.panel h3{font-size:10px;text-transform:${bangla ? 'none' : 'uppercase'};letter-spacing:${bangla ? '0' : '.15em'};margin:0 0 5px}.panel p{margin:0;white-space:pre-wrap}.signature{margin-top:45px;border-top:1px solid ${draft.accent};padding-top:5px;width:190px}.powered{text-align:center;color:#999;font-size:9px;margin-top:28px}${kind === 'thermal' ? '.header{display:block}.title{text-align:left;margin-top:15px}.parties{grid-template-columns:1fr;gap:12px;margin:18px 0}.items th:nth-child(n+3),.items td:nth-child(n+3){display:none}.footer{grid-template-columns:1fr}.totals{width:100%}' : ''}
      .packing{padding-left:4mm;padding-right:4mm}.packing .header{grid-template-columns:minmax(60px,1fr) auto;border-bottom:0;padding-bottom:0}.packing .brand,.packing .parties,.packing .items,.packing .signature{margin-left:0}.packing .title{width:auto}.packing .title h1{font-size:clamp(21px,5vw,31px);letter-spacing:.1em;overflow-wrap:normal;white-space:nowrap}.packing .parties{gap:18px;margin-top:24px;margin-bottom:24px}.packing .party{border:1px solid #e3e6ea;border-top:3px solid ${draft.accent};border-radius:4px;padding:15px 17px;min-height:112px}.packing .party h2{margin-top:7px}.packing .items{margin-top:8px}.packing .items th{padding:8px 12px}.packing .items td{padding:12px}.packing .items th:last-child,.packing .items td:last-child{width:110px}.packing-summary{display:flex;justify-content:flex-end;gap:0;margin:20px 0 0 auto}.packing-summary span{display:flex;min-width:135px;align-items:center;justify-content:space-between;gap:20px;border:1px solid #e3e6ea;padding:10px 13px}.packing-summary span+span{border-left:0}.packing-summary small{margin:0;color:#69707d}.packing-summary b{font-size:16px;color:#15171b}
      @media print{@page{size:${kind === 'thermal' ? '80mm auto' : 'auto'};margin:${kind === 'thermal' ? '0' : '10mm'}}html,body{width:100%;margin:0;padding:0;background:#fff}body{font-synthesis:none;text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.page{width:${kind === 'thermal' ? '80mm' : '100%'};max-width:100%;padding:${kind === 'thermal' ? '8mm 5mm' : '7mm'};margin:0 auto;overflow:visible}.header{display:grid;grid-template-columns:minmax(0,1fr) minmax(155px,40%);gap:24px;align-items:start;padding-bottom:15px;page-break-inside:avoid}.brand{min-width:0}.logo{display:block;object-fit:contain}.title{min-width:0;text-align:right;padding-right:1mm}.title h1{max-width:100%;font-size:${kind === 'thermal' ? '24px' : draft.paperSize === 'A5' ? '25px' : '31px'};line-height:1.15;font-weight:400;letter-spacing:${bangla ? '.01em' : '.14em'};overflow-wrap:anywhere}.meta{margin-top:7px;white-space:nowrap}.items{table-layout:fixed}.items th{padding:7px 10px;line-height:1.25}.items td{padding:8px 10px}.totals .grand{padding:9px 13px}.header,.items thead,.totals,.footer,.panel,.packing-summary{break-inside:avoid;page-break-inside:avoid}}
    </style></head><body><main class="page ${kind === 'packing' ? 'packing' : ''}"><header class="header"><div class="brand">${logo}</div><div class="title"><h1>${escapeHtml(documentTitle)}</h1><div class="meta"><div><b>${bangla ? 'নং' : 'No.'}</b> #${escapeHtml(draft.invoiceNo)}</div><div><b>${tx('Date')}:</b> ${escapeHtml(displayDate(draft.issueDate))}</div></div></div></header><section class="parties"><div class="party"><span class="eyebrow">${kind === 'packing' ? (bangla ? 'প্রেরক' : 'Sender') : tx('From')}</span><h2>${escapeHtml(draft.business)}</h2><p>${lines(draft.businessDetails)}</p></div><div class="party"><span class="eyebrow">${kind === 'packing' ? (bangla ? 'প্রাপক' : 'Ship to') : tx('Bill to')}</span><h2>${escapeHtml(draft.customer)}</h2><p>${lines(draft.customerDetails)}</p></div></section><table class="items"><thead><tr><th>${tx('Description')}</th><th class="number">${tx('Qty')}</th>${kind === 'packing' ? '' : `<th class="number">${tx('Rate')}</th><th class="number">${tx('Amount')}</th>`}</tr></thead><tbody>${pricedRows}</tbody></table>${totals}${kind === 'packing' ? '' : `<section class="footer"><div class="panel"><h3>${tx('Payment details')}</h3><p>${lines(draft.payment)}</p></div><div><div class="panel"><h3>${tx('Notes')}</h3><p>${lines(draft.notes)}</p></div><p class="muted" style="margin-top:12px;white-space:pre-wrap">${lines(draft.terms)}</p></div></section>`}${draft.showSignature ? `<div class="signature">${tx('Authorized signature')}</div>` : ''}<div class="powered">${bangla ? 'তৈরি হয়েছে' : 'Created with'} ${escapeHtml(brand)}</div></main><script>addEventListener('load',async()=>{await document.fonts.ready;print()})</script></body></html>`;
    const popup = window.open('', '_blank', 'width=980,height=900');
    if (!popup) { window.alert('Allow pop-ups to open the print-ready invoice.'); return; }
    popup.document.write(html); popup.document.close();
  };

  return (
    <div className={`space-y-5 ${className}`} lang="en">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3"><span className={`h-2 w-2 rounded-full ${saved ? 'bg-emerald-500' : 'bg-amber-400'}`} /><div><p className="text-sm font-semibold text-gray-900">Invoice #{draft.invoiceNo || 'Draft'}</p><p className="text-xs text-gray-500">{saved ? 'Draft saved on this device' : 'Saving changes…'}</p></div></div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={reset} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:border-gray-400">Reset</button><button type="button" onClick={() => printDocument('packing')} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50">Packing slip</button><button type="button" onClick={() => printDocument('invoice')} className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50">Print invoice</button><button type="button" onClick={downloadPdf} disabled={downloading} className="rounded-lg bg-gray-950 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60">{downloading ? 'Creating PDF…' : 'Download PDF'}</button></div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(360px,0.82fr)_minmax(560px,1.18fr)]">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex overflow-x-auto border-b border-gray-200 px-2" role="tablist">{tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 px-3 py-3 text-xs font-semibold ${activeTab === tab ? 'border-gray-950 text-gray-950' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>{tab}</button>)}</div>
          <div className="space-y-4 p-5">
            {activeTab === 'Details' && <><div className="grid grid-cols-2 gap-3"><Field label="Invoice number" value={draft.invoiceNo} onChange={(v) => patch('invoiceNo', v)} /><Select label="Currency" value={draft.currency} options={currencies} onChange={(v) => patch('currency', v)} /></div><Field type="date" label="Invoice date" value={draft.issueDate} onChange={(v) => patch('issueDate', v)} /><Select label="Invoice language" value={draft.language} options={[{ value: 'en-US', label: 'English invoice' }, { value: 'bn-BD', label: 'বাংলা ইনভয়েস' }]} onChange={setLanguage} /></>}
            {activeTab === 'Parties' && <><Field label="Your business / name" value={draft.business} onChange={(v) => patch('business', v)} /><Area label="Your address, email, tax ID" value={draft.businessDetails} onChange={(v) => patch('businessDetails', v)} /><Field label="Client / company" value={draft.customer} onChange={(v) => patch('customer', v)} /><Area label="Client address and contact" value={draft.customerDetails} onChange={(v) => patch('customerDetails', v)} /></>}
            {activeTab === 'Items' && <><div className="space-y-3">{draft.rows.map((item, index) => <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50/70 p-3"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-gray-500">ITEM {index + 1}</span><button type="button" onClick={() => removeRow(item.id)} className="text-xs text-gray-400 hover:text-red-600">Remove</button></div><Field label="Name" value={item.name} placeholder="Product or service" onChange={(v) => patchRow(item.id, { name: v })} /><div className="mt-2"><Field label="Description (optional)" value={item.description} onChange={(v) => patchRow(item.id, { description: v })} /></div><div className="mt-2 grid grid-cols-2 gap-3"><Field type="number" label="Quantity" value={item.qty} onChange={(v) => patchRow(item.id, { qty: v })} /><Field type="number" label={`Rate (${draft.currency})`} value={item.price} onChange={(v) => patchRow(item.id, { price: v })} /></div></div>)}</div><button type="button" onClick={addRow} className="w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:border-gray-700 hover:bg-gray-50">+ Add line item</button></>}
            {activeTab === 'Payment' && <><div className="grid grid-cols-2 gap-3"><Select label="Discount type" value={draft.discountType} options={[{ value: 'fixed', label: 'Fixed' }, { value: 'percent', label: 'Percentage' }]} onChange={(v) => patch('discountType', v as DiscountType)} /><Field type="number" label={draft.discountType === 'percent' ? 'Discount (%)' : `Discount (${draft.currency})`} value={draft.discount} onChange={(v) => patch('discount', v)} /></div><div className="grid grid-cols-2 gap-3"><Field label="Tax label" value={draft.taxLabel} onChange={(v) => patch('taxLabel', v)} /><Field type="number" label="Tax rate (%)" value={draft.taxRate} onChange={(v) => patch('taxRate', v)} /></div><Field type="number" label={`Shipping / delivery (${draft.currency})`} value={draft.delivery} onChange={(v) => patch('delivery', v)} /><Area label="Payment details" value={draft.payment} onChange={(v) => patch('payment', v)} /><Area label="Notes" value={draft.notes} onChange={(v) => patch('notes', v)} /><Area label="Terms" value={draft.terms} onChange={(v) => patch('terms', v)} /></>}
            {activeTab === 'Design' && <>
              <div><span className="mb-2 block text-sm text-gray-700">Design preset</span><div className="grid grid-cols-2 gap-2">{(['editorial', 'classic', 'minimal', 'bold'] as Template[]).map((template) => <button type="button" key={template} onClick={() => patch('template', template)} className={`rounded-xl border p-3 text-xs font-semibold capitalize ${draft.template === template ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{template}</button>)}</div></div>
              <Field label="Document title" value={draft.documentTitle} placeholder="Invoice, Tax Invoice, Receipt…" onChange={(v) => patch('documentTitle', v)} />
              <div className="grid grid-cols-2 gap-3"><Select label="Paper size" value={draft.paperSize} options={['A4', 'A5']} onChange={(v) => patch('paperSize', v as PaperSize)} /><Select label="Typography" value={draft.font} options={['sans', 'serif', 'mono']} onChange={(v) => patch('font', v as InvoiceFont)} /></div>
              <Field type="number" label="Logo height (px)" value={draft.logoSize} onChange={(v) => patch('logoSize', v)} />
              <label className="block"><span className="mb-1 block text-sm text-gray-700">Brand accent</span><div className="flex gap-2"><input type="color" value={draft.accent} onChange={(e) => patch('accent', e.target.value)} className="h-11 w-16 cursor-pointer rounded-lg border border-gray-300 bg-white p-1" /><input value={draft.accent} onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && patch('accent', e.target.value)} className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm uppercase" /></div></label>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3"><span className="mb-2 block text-sm font-medium text-gray-800">Business logo</span><input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={uploadLogo} className="hidden" /><div className="flex items-center gap-3">{draft.logo && <img src={draft.logo} alt="Business logo" className="h-12 w-20 rounded border border-gray-200 bg-white object-contain p-1" />}<div className="flex min-w-0 flex-1 gap-2"><button type="button" onClick={() => fileRef.current?.click()} className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:border-gray-500">{draft.logo ? 'Replace image' : 'Choose image file'}</button>{draft.logo && <button type="button" onClick={() => patch('logo', '')} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">Remove</button>}</div></div><p className="mt-2 text-xs text-gray-400">PNG, JPG, WebP or SVG · maximum 1.5 MB · stored only on this device</p></div>
              <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-2.5"><span className="text-sm text-gray-700">Authorized signature line</span><input type="checkbox" checked={draft.showSignature} onChange={(e) => patch('showSignature', e.target.checked)} className="h-4 w-4 accent-gray-950" /></label>
              <button type="button" onClick={() => printDocument('thermal')} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold">Print compact 80mm receipt</button><p className="-mt-2 text-xs text-gray-400">Compact receipts intentionally omit rate and amount columns. Use the {draft.paperSize} invoice button above for a preview-matched document.</p>
            </>}
          </div>
        </section>

        <section className="sticky top-4 overflow-hidden rounded-2xl border border-gray-200 bg-[#e9eaec] p-3 shadow-sm sm:p-5" aria-label={`${draft.paperSize} invoice preview`}>
          <div className="mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-gray-500"><span>Print preview</span><span>{draft.paperSize} · {draft.paperSize === 'A5' ? '148 × 210 mm' : '210 × 297 mm'}</span></div>
          <InvoicePreview draft={draft} result={result} money={money} />
        </section>
      </div>
      <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
    </div>
  );
}

function InvoicePreview({ draft, result, money }: { draft: Draft; result: ReturnType<typeof calcInvoice>; money: (n: number) => string }) {
  const bangla = draft.language === 'bn-BD';
  const tx = (key: string) => bangla ? (bnText[key] || key) : key;
  const minimal = draft.template === 'minimal';
  const font = draft.font === 'serif' ? 'font-serif' : draft.font === 'mono' ? 'font-mono' : 'font-sans';
  const fontFamily = bangla ? 'var(--font-hind-siliguri), "Hind Siliguri", sans-serif' : draft.font === 'serif' ? 'Georgia, serif' : draft.font === 'mono' ? '"Courier New", monospace' : 'Arial, sans-serif';
  const bold = draft.template === 'bold';
  const isA5 = draft.paperSize === 'A5';
  const paperWidth = isA5 ? 559 : 794;
  const paperHeight = isA5 ? 794 : 1123;
  const paperPadding = isA5 ? 45 : 68;
  const previewHolder = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  useEffect(() => {
    const holder = previewHolder.current;
    if (!holder) return;
    const update = () => setPreviewScale(Math.min(1, holder.clientWidth / paperWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(holder);
    return () => observer.disconnect();
  }, [paperWidth]);
  return <div ref={previewHolder} className="mx-auto w-full overflow-hidden" style={{ height: `${paperHeight * previewScale}px`, maxWidth: `${paperWidth}px` }}><article data-invoice-paper style={{ boxSizing: 'border-box', fontFamily, height: `${paperHeight}px`, padding: `${paperPadding}px`, transform: `scale(${previewScale})`, transformOrigin: 'top left', width: `${paperWidth}px` }} className={`overflow-hidden bg-white text-[#17191d] shadow-[0_12px_45px_rgba(0,0,0,.14)] ${font}`}>
    <header style={bold ? { background: draft.accent, margin: `-${paperPadding}px -${paperPadding}px 0`, padding: `${paperPadding}px` } : { borderColor: draft.accent }} className={`flex items-start justify-between gap-5 pb-5 ${bold ? 'text-white' : minimal ? 'border-b' : 'border-b-2'}`}><div>{draft.logo ? <img src={draft.logo} alt={bangla ? 'ব্যবসার লোগো' : 'Business logo'} style={{ maxHeight: `${Math.max(36, Math.min(100, n(draft.logoSize)))}px` }} className="max-w-44 object-contain" /> : <div style={{ background: bold ? '#17191d' : draft.accent }} className="grid h-14 w-14 place-items-center text-lg font-bold text-white">{draft.business.slice(0, 2).toUpperCase()}</div>}</div><div className="text-right"><h2 className={`${isA5 ? 'text-2xl' : 'text-3xl'} font-light ${bangla ? '' : 'uppercase tracking-[.18em]'}`}>{bangla && draft.documentTitle === 'Invoice' ? 'ইনভয়েস' : draft.documentTitle || (bangla ? 'ইনভয়েস' : 'Invoice')}</h2><dl className={`mt-2 text-xs leading-5 ${bold ? 'text-white/80' : 'text-gray-500'}`}><div><dt className={`inline font-semibold ${bold ? 'text-white' : 'text-gray-800'}`}>{bangla ? 'নং' : 'No.'} </dt><dd className="inline">#{draft.invoiceNo}</dd></div><div><dt className={`inline font-semibold ${bold ? 'text-white' : 'text-gray-800'}`}>{tx('Date')}: </dt><dd className="inline">{displayDate(draft.issueDate)}</dd></div></dl></div></header>
    <div className={`grid grid-cols-2 text-xs leading-5 ${isA5 ? 'my-5 gap-5' : 'my-7 gap-10'}`}><Party label={tx('From')} name={draft.business} details={draft.businessDetails} accent={draft.accent} /><Party label={tx('Bill to')} name={draft.customer} details={draft.customerDetails} accent={draft.accent} /></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-xs"><thead><tr style={minimal ? { borderColor: draft.accent, color: draft.accent } : { background: draft.accent }} className={minimal ? 'border-y-2' : 'text-white'}><th className={`px-3 py-2 text-left font-semibold ${bangla ? '' : 'uppercase tracking-wider'}`}>{tx('Description')}</th><th className={`px-3 py-2 text-right font-semibold ${bangla ? '' : 'uppercase tracking-wider'}`}>{tx('Qty')}</th><th className={`px-3 py-2 text-right font-semibold ${bangla ? '' : 'uppercase tracking-wider'}`}>{tx('Rate')}</th><th className={`px-3 py-2 text-right font-semibold ${bangla ? '' : 'uppercase tracking-wider'}`}>{tx('Amount')}</th></tr></thead><tbody>{result.lines.map((item, i) => <tr key={draft.rows[i]?.id || i} className="border-b border-gray-200"><td className="px-3 py-3"><b className="block">{item.name || (bangla ? 'নামহীন আইটেম' : 'Untitled item')}</b>{item.description && <span className="text-[10px] text-gray-500">{item.description}</span>}</td><td className="px-3 py-3 text-right">{item.qty}</td><td className="px-3 py-3 text-right">{money(item.price)}</td><td className="px-3 py-3 text-right font-medium">{money(item.total)}</td></tr>)}</tbody></table></div>
    <div className="ml-auto mt-5 w-full max-w-[300px] text-xs"><Total label={tx('Subtotal')} value={money(result.subtotal)} />{result.discount > 0 && <Total label={tx('Discount')} value={`−${money(result.discount)}`} />}{result.tax > 0 && <Total label={`${bangla && draft.taxLabel === 'Tax' ? 'কর' : draft.taxLabel} (${n(draft.taxRate)}%)`} value={money(result.tax)} />}{result.deliveryCharge > 0 && <Total label={tx('Shipping')} value={money(result.deliveryCharge)} />}<div style={{ background: draft.accent }} className="mt-2 flex justify-between px-4 py-2.5 text-sm font-bold text-white"><span>{tx('Total')}</span><span>{money(result.grandTotal)}</span></div></div>
    <div className="mt-9 grid grid-cols-2 gap-5 text-[10px] leading-4"><div style={{ borderColor: draft.accent }} className="border-l-[3px] bg-gray-50 p-3"><b className={`mb-1 block ${bangla ? '' : 'uppercase tracking-widest'}`}>{tx('Payment details')}</b><p className="whitespace-pre-line text-gray-600">{draft.payment}</p></div><div><b className={`mb-1 block ${bangla ? '' : 'uppercase tracking-widest'}`}>{tx('Notes')}</b><p className="whitespace-pre-line text-gray-600">{draft.notes}</p><p className="mt-3 whitespace-pre-line text-gray-400">{draft.terms}</p></div></div>
    {draft.showSignature && <div style={{ borderColor: draft.accent }} className="mt-12 w-44 border-t pt-1 text-[10px] text-gray-500">{tx('Authorized signature')}</div>}
  </article></div>;
}

function Party({ label, name, details, accent }: { label: string; name: string; details: string; accent: string }) { return <div><span style={{ color: accent }} className="text-[10px] font-bold uppercase tracking-[.2em]">{label}</span><h3 className="mt-1 text-sm font-bold">{name || '—'}</h3><p className="mt-0.5 whitespace-pre-line text-gray-600">{details}</p></div>; }
function Total({ label, value }: { label: string; value: string }) { return <div className="flex justify-between border-b border-gray-100 py-1.5 text-gray-600"><span>{label}</span><b className="text-gray-800">{value}</b></div>; }
function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) { return <label className="block"><span className="mb-1 block text-sm text-gray-700">{label}</span><input type={type} min={type === 'number' ? '0' : undefined} step={type === 'number' ? 'any' : undefined} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100" /></label>; }
function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) { return <label className="block"><span className="mb-1 block text-sm text-gray-700">{label}</span><textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100" /></label>; }
function Select({ label, value, options, onChange }: { label: string; value: string; options: Array<string | { value: string; label: string }>; onChange: (v: string) => void }) { return <label className="block"><span className="mb-1 block text-sm text-gray-700">{label}</span><DropdownControl ariaLabel={label} value={value} onChange={onChange} options={options} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"/></label>; }
