/**
 * Business QR Code Generator — pure content logic.
 *
 * Builds the string that gets encoded into the QR for each business use-case.
 * The actual QR rendering happens in the component (via the `qrcode` library).
 */

export type QrType = 'url' | 'whatsapp' | 'phone' | 'payment' | 'email' | 'text';

export type QrInput = {
  type: QrType;
  value: string;
};

/** Normalise a Bangladesh number to 8801XXXXXXXXX (no plus). */
function normalizeBdPhone(raw: string): string {
  let d = (raw || '').replace(/\D/g, '');
  if (d.startsWith('880')) return d;
  if (d.startsWith('0')) d = d.slice(1);
  return '880' + d;
}

export function buildQrContent({ type, value }: QrInput): string {
  const v = (value || '').trim();
  switch (type) {
    case 'url':
      if (!v) return '';
      return /^https?:\/\//i.test(v) ? v : `https://${v}`;
    case 'whatsapp':
      return v ? `https://wa.me/${normalizeBdPhone(v)}` : '';
    case 'phone':
      return v ? `tel:${v}` : '';
    case 'payment':
      if (!v) return '';
      // A payment link as-is, or a bKash/Nagad "send money" instruction.
      return /^https?:\/\//i.test(v) ? v : `bKash/Nagad Personal: ${v}`;
    case 'email':
      return v ? `mailto:${v}` : '';
    case 'text':
    default:
      return v;
  }
}

export const QR_TYPE_OPTIONS: { value: QrType; label: string; placeholder: string }[] = [
  { value: 'url', label: 'Website / Product URL', placeholder: 'contracommerce.com' },
  { value: 'whatsapp', label: 'WhatsApp number', placeholder: '01712345678' },
  { value: 'phone', label: 'Phone number', placeholder: '01712345678' },
  { value: 'payment', label: 'Payment (bKash/Nagad/link)', placeholder: '01712345678 or payment URL' },
  { value: 'email', label: 'Email', placeholder: 'hello@shop.com' },
  { value: 'text', label: 'Plain text', placeholder: 'Any text' },
];
