import { describe, expect, it } from 'vitest';
import { assessOperationalOrderRisk, type OrderRiskEvidence } from './order-risk';

const base: OrderRiskEvidence = {
  riskLevel: 'low',
  riskScore: 12,
  successRate: 92,
  totalOrders: 12,
  delivered: 11,
  cancellations: 1,
  repeatedAttempts: 0,
  addressSuspicious: false,
};

describe('assessOperationalOrderRisk', () => {
  it('approves normal fulfilment when verified history is healthy', () => {
    expect(assessOperationalOrderRisk(base).verdict).toBe('approve');
  });

  it('holds a high-risk order for verification without calling it fake', () => {
    const result = assessOperationalOrderRisk({
      ...base,
      riskLevel: 'high',
      riskScore: 82,
      successRate: 25,
      cancellations: 8,
    });
    expect(result.verdict).toBe('hold');
    expect(result.heading.toLowerCase()).not.toContain('fake');
    expect(result.recommendation).toContain('Call the customer');
  });

  it('recommends verification for suspicious addresses', () => {
    const result = assessOperationalOrderRisk({
      ...base,
      addressSuspicious: true,
      addressReasons: ['Address looks too short'],
    });
    expect(result.verdict).toBe('verify');
    expect(result.reasons).toContain('Address looks too short');
  });

  it('reports insufficient history separately', () => {
    const result = assessOperationalOrderRisk({
      ...base,
      riskLevel: 'insufficient_data',
      riskScore: null,
      successRate: null,
      totalOrders: 0,
      delivered: 0,
      cancellations: 0,
    });
    expect(result.verdict).toBe('insufficient_data');
  });
});
