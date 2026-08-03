/**
 * WhatsApp Order Link Generator — pure logic.
 *
 * Builds a wa.me deep link with a pre-filled order message. Normalises
 * Bangladesh phone numbers to the international format WhatsApp expects.
 */

export type WhatsappInput = {
  /** Business WhatsApp number, any local format (e.g. 01712345678) */
  phone: string;
  /** Product name */
  product: string;
  /** Price shown in the message (৳) — optional */
  price?: string;
  /** Extra fields to prompt the customer for (e.g. Size, Color, Address) */
  fields?: string[];
};

export type WhatsappResult = {
  /** Normalised international number (no +), e.g. 8801712345678 */
  normalizedPhone: string;
  /** The pre-filled message text */
  message: string;
  /** The full wa.me link */
  link: string;
  /** true if the phone looks like a valid BD mobile number */
  valid: boolean;
};

/** Normalise a Bangladesh number to 8801XXXXXXXXX (no plus). */
export function normalizeBdPhone(raw: string): string {
  let digits = (raw || '').replace(/\D/g, '');
  if (digits.startsWith('880')) return digits;
  if (digits.startsWith('0')) digits = digits.slice(1);
  // At this point we expect a 10-digit number starting with 1 (1XXXXXXXXX).
  return '880' + digits;
}

export function buildWhatsappLink(input: WhatsappInput): WhatsappResult {
  const { phone, product, price, fields = ['Size', 'Color', 'Address'] } = input;

  const normalizedPhone = normalizeBdPhone(phone);
  // Valid BD mobile: 880 + 1 + 9 digits = 13 digits total.
  const valid = /^8801\d{9}$/.test(normalizedPhone);

  const lines: string[] = [];
  lines.push(
    `I want to order ${product || '[product]'}${price ? ` (৳${price})` : ''}.`,
  );
  for (const f of fields) lines.push(`${f}: `);
  const message = lines.join('\n');

  const link = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;

  return { normalizedPhone, message, link, valid };
}
