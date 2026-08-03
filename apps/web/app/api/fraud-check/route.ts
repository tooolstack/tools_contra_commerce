import { NextResponse } from 'next/server';
import {
  assessOperationalOrderRisk,
  type OperationalRiskLevel,
} from '@contra/tools-kit';
import { logEvent, saveFraudCheck } from '../../../lib/db';
import { checkCourierHistory, type CourierHistoryResult } from '../../../lib/courier-adapters';
import { listActiveCourierConnections } from '../../../lib/courier-connection-store';
import { courierWorkspace } from '../../../lib/courier-workspace';
import {
  checkRateLimit,
  cleanText,
  requestWithinSize,
} from '../../../lib/api-security';
import { phoneStorageHash } from '../../../lib/privacy';

export const runtime = 'nodejs';

type AddressCheck = { checked: boolean; suspicious: boolean; reasons: string[] };
type RiskReport = ReturnType<typeof historyReport>;

export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'fraud-check', 20, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfterSeconds: rate.retryAfterSeconds },
      { status: 429, headers: { 'retry-after': String(rate.retryAfterSeconds) } },
    );
  }
  if (!requestWithinSize(req, 16_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }

  const body = await req.json().catch(() => ({}));
  if (body.consent !== true) {
    return NextResponse.json({ error: 'consent_required' }, { status: 400 });
  }

  const phone = cleanText(body.phone, 24).replace(/\D/g, '');
  const address = cleanText(body.address, 500);
  const orderReference = cleanText(body.orderReference, 80);
  if (!/^(?:88)?01\d{9}$/.test(phone)) {
    return NextResponse.json({ error: 'invalid_phone' }, { status: 400 });
  }

  const localPhone = phone.startsWith('88') ? phone.slice(2) : phone;
  const addr = assessAddress(address);
  let result: ReturnType<typeof buildResult>;

  try {
    const workspace = courierWorkspace(req);
    const connections = (await listActiveCourierConnections(workspace.workspaceId)).filter(
      (connection) =>
        connection.connectionType === 'custom_history' ||
        (connection.connectionType === 'builtin' &&
          Boolean(String(connection.credentials.lookupPath || '').trim())),
    );
    if (connections.length) {
      const settled = await Promise.allSettled(
        connections.map((connection) => checkCourierHistory(connection, localPhone)),
      );
      const histories = settled
        .filter(
          (item): item is PromiseFulfilledResult<CourierHistoryResult> =>
            item.status === 'fulfilled',
        )
        .map((item) => item.value);
      if (!histories.length) throw new Error('No connected history provider returned usable data');
      const real = historyReport(histories, settled);
      result = buildResult({
        report: real,
        address: addr,
        orderReference,
        demo: false,
      });
    } else {
      result = buildResult({
        report: mockReport(localPhone),
        address: addr,
        orderReference,
        demo: true,
        fallbackReason:
          'Connect a licensed phone-history API to use live courier history.',
      });
    }
  } catch {
    result = buildResult({
      report: mockReport(localPhone),
      address: addr,
      orderReference,
      demo: true,
      fallbackReason:
        'Connected courier history APIs were unavailable, so this is clearly labelled demo data.',
    });
  }

  await logEvent(
    'fraud-check',
    {
      riskLevel: result.riskLevel,
      verdict: result.assessment.verdict,
      dataMode: result.dataMode,
      hasOrderReference: Boolean(orderReference),
      courierCount: result.byCourier.length,
    },
    { demo: result.demo, req },
  );

  const phoneHash = phoneStorageHash(localPhone);
  if (phoneHash) {
    await saveFraudCheck({
      phone: phoneHash,
      riskLevel: result.riskLevel,
      successRate: result.successRate ?? undefined,
      source: result.dataMode,
    });
  }

  return NextResponse.json(result, {
    headers: {
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

function buildResult({
  report,
  address,
  orderReference,
  demo,
  fallbackReason,
}: {
  report: RiskReport;
  address: AddressCheck;
  orderReference: string;
  demo: boolean;
  fallbackReason?: string;
}) {
  const assessment = assessOperationalOrderRisk({
    riskLevel: report.riskLevelCode,
    riskScore: report.riskScore,
    successRate: report.successRate,
    totalOrders: report.totalOrders,
    delivered: report.delivered,
    cancellations: report.cancelled,
    repeatedAttempts: report.repeatedAttempts,
    addressSuspicious: address.suspicious,
    addressReasons: address.reasons,
  });

  return {
    ...report,
    orderReference,
    address,
    assessment,
    demo,
    dataMode: demo ? 'demo' : 'live',
    fallbackReason,
    legalNote:
      'This is an operational delivery-risk estimate, not proof that a customer or order is fraudulent.',
  };
}

function assessAddress(address: string): AddressCheck {
  const value = address.trim();
  if (!value) return { checked: false, suspicious: false, reasons: [] };
  const reasons: string[] = [];
  if (value.length < 12) reasons.push('Address looks too short');
  if (!/\d/.test(value)) reasons.push('No house, road or holding number was found');
  if (value.split(/[\s,]+/).filter(Boolean).length < 3) {
    reasons.push('Too few address parts');
  }
  return { checked: true, suspicious: reasons.length > 0, reasons };
}

function mockReport(phone: string): RiskReport {
  const seed = phone.split('').reduce((sum, digit) => sum + Number(digit), 0);
  const totalOrders = 5 + (seed % 20);
  const successRate = 40 + (seed % 55);
  const delivered = Math.round((totalOrders * successRate) / 100);
  const cancelled = totalOrders - delivered;
  const repeatedAttempts = seed % 3;
  const riskLevelCode: OperationalRiskLevel =
    totalOrders < 3
      ? 'insufficient_data'
      : successRate >= 75
        ? 'low'
        : successRate >= 50
          ? 'medium'
          : 'high';
  const label = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    insufficient_data: 'Insufficient data',
  } as const;

  return {
    riskLevel: label[riskLevelCode],
    riskLevelCode,
    riskScore: Math.max(0, 100 - successRate),
    confidence: totalOrders >= 10 ? 'high' : totalOrders >= 5 ? 'medium' : 'low',
    successRate,
    totalOrders,
    delivered,
    cancelled,
    repeatedAttempts,
    refused: cancelled,
    unreachable: repeatedAttempts,
    noShow: 0,
    addressIssues: 0,
    byCourier: [
      {
        courier: 'Demo history',
        total: totalOrders,
        delivered,
        failed: cancelled,
        successRate,
      },
    ],
    sources: [{ courier: 'demo', success: true, count: totalOrders, error: undefined }],
    served: 'demo',
    checkedAt: new Date().toISOString(),
    cached: false,
    note: 'Deterministic demonstration only; no courier record was queried.',
  };
}

function historyReport(
  histories: CourierHistoryResult[],
  settled: PromiseSettledResult<CourierHistoryResult>[],
) {
  const totalOrders = histories.reduce((sum, history) => sum + history.total, 0);
  const delivered = histories.reduce((sum, history) => sum + history.delivered, 0);
  const cancelled = histories.reduce((sum, history) => sum + history.failed, 0);
  const successRate =
    totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : null;
  const riskLevelCode: OperationalRiskLevel =
    totalOrders < 3
      ? 'insufficient_data'
      : (successRate ?? 0) >= 75
        ? 'low'
        : (successRate ?? 0) >= 50
          ? 'medium'
          : 'high';
  const label = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    insufficient_data: 'Insufficient data',
  } as const;
  return {
    riskLevel: label[riskLevelCode],
    riskLevelCode,
    riskScore: successRate == null ? null : Math.max(0, 100 - successRate),
    confidence: (totalOrders >= 10 ? 'high' : totalOrders >= 5 ? 'medium' : 'low') as
      | 'low'
      | 'medium'
      | 'high',
    successRate,
    totalOrders,
    delivered,
    cancelled,
    repeatedAttempts: 0,
    refused: cancelled,
    unreachable: 0,
    noShow: 0,
    addressIssues: 0,
    byCourier: histories.map((history) => ({
      courier: history.courier,
      total: history.total,
      delivered: history.delivered,
      failed: history.failed,
      successRate: history.successRate,
    })),
    sources: settled.map((entry, index) => ({
      courier:
        entry.status === 'fulfilled'
          ? entry.value.courier
          : `Provider ${index + 1}`,
      success: entry.status === 'fulfilled',
      count: entry.status === 'fulfilled' ? entry.value.total : undefined,
      error: entry.status === 'rejected' ? 'Provider unavailable or mapping invalid' : undefined,
    })),
    served: 'connected-couriers',
    checkedAt: new Date().toISOString(),
    cached: false,
    note: 'Aggregated from the merchant courier-history APIs connected in this workspace.',
  };
}
