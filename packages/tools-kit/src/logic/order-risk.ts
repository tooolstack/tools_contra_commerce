/**
 * Operational order-risk assessment.
 *
 * Courier history can indicate delivery risk, but it cannot prove that a
 * customer or order is fraudulent. This helper deliberately returns actionable
 * fulfilment recommendations instead of a defamatory "fake/not fake" label.
 */

export type OperationalRiskLevel = 'low' | 'medium' | 'high' | 'insufficient_data';
export type OrderRiskVerdict = 'approve' | 'verify' | 'hold' | 'insufficient_data';

export type OrderRiskEvidence = {
  riskLevel: OperationalRiskLevel;
  riskScore: number | null;
  successRate: number | null;
  totalOrders: number;
  delivered: number;
  cancellations: number;
  repeatedAttempts: number;
  addressSuspicious: boolean;
  addressReasons?: string[];
};

export type OrderRiskAssessment = {
  verdict: OrderRiskVerdict;
  heading: string;
  recommendation: string;
  reasons: string[];
};

export function assessOperationalOrderRisk(
  evidence: OrderRiskEvidence,
): OrderRiskAssessment {
  const reasons: string[] = [];

  if (evidence.successRate != null) {
    reasons.push(
      `${evidence.successRate.toFixed(0)}% delivery success across ${evidence.totalOrders} recorded order(s)`,
    );
  }
  if (evidence.cancellations > 0) {
    reasons.push(`${evidence.cancellations} customer-attributable cancellation/return(s)`);
  }
  if (evidence.repeatedAttempts > 0) {
    reasons.push(`${evidence.repeatedAttempts} unreachable/no-show attempt(s)`);
  }
  if (evidence.addressSuspicious) {
    reasons.push(...(evidence.addressReasons?.length
      ? evidence.addressReasons
      : ['Delivery address needs verification']));
  }

  if (evidence.riskLevel === 'insufficient_data' || evidence.totalOrders < 3) {
    return {
      verdict: 'insufficient_data',
      heading: 'Not enough verified history',
      recommendation: 'Confirm the customer by phone before shipping.',
      reasons: reasons.length ? reasons : ['Fewer than 3 verified delivery attempts are available'],
    };
  }

  if (
    evidence.riskLevel === 'high' ||
    (evidence.riskScore != null && evidence.riskScore >= 70) ||
    (evidence.successRate != null && evidence.successRate < 40)
  ) {
    return {
      verdict: 'hold',
      heading: 'High delivery risk — hold for verification',
      recommendation:
        'Call the customer, confirm product/price/address and consider an advance payment before dispatch.',
      reasons,
    };
  }

  if (
    evidence.riskLevel === 'medium' ||
    evidence.addressSuspicious ||
    (evidence.successRate != null && evidence.successRate < 75)
  ) {
    return {
      verdict: 'verify',
      heading: 'Verification recommended',
      recommendation: 'Confirm the order and address by phone before handing it to the courier.',
      reasons,
    };
  }

  return {
    verdict: 'approve',
    heading: 'Normal delivery risk',
    recommendation: 'The available history supports normal fulfilment. Continue routine verification.',
    reasons: reasons.length ? reasons : [`${evidence.delivered} delivered order(s) recorded`],
  };
}
