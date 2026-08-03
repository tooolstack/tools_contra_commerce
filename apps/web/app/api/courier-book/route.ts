import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { checkRateLimit, cleanText, requestWithinSize } from '../../../lib/api-security';
import { createCourierBooking } from '../../../lib/courier-adapters';
import { getCourierConnection } from '../../../lib/courier-connection-store';
import { courierWorkspace } from '../../../lib/courier-workspace';
import { findCourierBooking, saveCourierBooking } from '../../../lib/courier-booking-store';

export const runtime = 'nodejs';

const nonNegative = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'courier-book', 20, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 20_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  const courierId = cleanText(body.courierId, 64).toLowerCase();
  const invoice = cleanText(body.invoice, 100);
  const customerName = cleanText(body.customerName, 100);
  const customerPhone = cleanText(body.customerPhone, 24).replace(/\D/g, '');
  const deliveryAddress = cleanText(body.deliveryAddress, 500);
  const codAmount = nonNegative(body.codAmount);
  const weightKg = nonNegative(body.weightKg);
  const itemQuantity = Math.max(1, Math.trunc(Number(body.itemQuantity) || 1));
  if (
    !/^[a-z0-9][a-z0-9_-]+$/i.test(courierId) ||
    !invoice ||
    !customerName ||
    !/^(?:88)?01\d{9}$/.test(customerPhone) ||
    deliveryAddress.length < 8 ||
    codAmount == null ||
    weightKg == null ||
    weightKg < 0.1
  ) {
    return NextResponse.json({ error: 'invalid_booking_details' }, { status: 400 });
  }

  const suppliedKey = cleanText(req.headers.get('idempotency-key'), 160);
  const idempotencyKey =
    suppliedKey ||
    createHash('sha256')
      .update(`${courierId}:${invoice}:${customerPhone}`)
      .digest('hex');
  try {
    const workspace = courierWorkspace(req);
    const existing = await findCourierBooking(workspace.workspaceId, idempotencyKey);
    if (existing) {
      return NextResponse.json(
        { ...existing, reused: true },
        {
          status: 200,
          headers: {
            'cache-control': 'no-store',
            ...(workspace.setCookie ? { 'set-cookie': workspace.setCookie } : {}),
          },
        },
      );
    }
    const connection = await getCourierConnection(workspace.workspaceId, courierId);
    if (!connection || !connection.enabled) {
      return NextResponse.json({ error: 'courier_connection_required' }, { status: 409 });
    }
    const result = await createCourierBooking(connection, {
      courierId,
      invoice,
      customerName,
      customerPhone,
      deliveryAddress,
      codAmount,
      weightKg,
      itemDescription: cleanText(body.itemDescription, 300),
      itemQuantity,
      note: cleanText(body.note, 300),
    });
    await saveCourierBooking(workspace.workspaceId, idempotencyKey, result);
    return NextResponse.json(result, {
      status: 201,
      headers: {
        'cache-control': 'no-store',
        ...(workspace.setCookie ? { 'set-cookie': workspace.setCookie } : {}),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'booking_failed' },
      { status: 502 },
    );
  }
}
