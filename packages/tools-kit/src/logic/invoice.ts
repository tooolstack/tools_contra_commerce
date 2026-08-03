/** Pure invoice calculations shared by the editor, preview, and print output. */
export type InvoiceItem = {
  name: string;
  description?: string;
  qty: number;
  price: number;
};

export type InvoiceInput = {
  items: InvoiceItem[];
  deliveryCharge?: number;
  discount?: number;
  discountType?: 'fixed' | 'percent';
  taxRate?: number;
};

export type InvoiceLine = InvoiceItem & { total: number };

export type InvoiceResult = {
  lines: InvoiceLine[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  taxableAmount: number;
  tax: number;
  grandTotal: number;
  totalItems: number;
};

const money = (n: number) => Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
const positive = (n: number | undefined) => Math.max(0, Number.isFinite(n) ? Number(n) : 0);

export function calcInvoice(input: InvoiceInput): InvoiceResult {
  const lines = input.items.map((item) => ({
    ...item,
    qty: positive(item.qty),
    price: positive(item.price),
    total: money(positive(item.qty) * positive(item.price)),
  }));
  const subtotal = money(lines.reduce((sum, line) => sum + line.total, 0));
  const requestedDiscount = positive(input.discount);
  const rawDiscount = input.discountType === 'percent'
    ? subtotal * Math.min(requestedDiscount, 100) / 100
    : requestedDiscount;
  const discount = money(Math.min(subtotal, rawDiscount));
  const taxableAmount = money(Math.max(0, subtotal - discount));
  const tax = money(taxableAmount * Math.min(positive(input.taxRate), 100) / 100);
  const deliveryCharge = money(positive(input.deliveryCharge));
  const grandTotal = money(taxableAmount + tax + deliveryCharge);

  return {
    lines,
    subtotal,
    deliveryCharge,
    discount,
    taxableAmount,
    tax,
    grandTotal,
    totalItems: lines.reduce((sum, line) => sum + line.qty, 0),
  };
}
