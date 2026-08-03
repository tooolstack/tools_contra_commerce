import { describe, it, expect } from 'vitest';
import { generateNames } from './name-ideas';
import { encodeSurvey, decodeSurvey, buildSurveyLink } from './demand-survey';

describe('generateNames', () => {
  it('builds names, slugs, slogans, fb usernames and colours', () => {
    const r = generateNames('shoes');
    expect(r.names).toContain('Shoes Shop');
    expect(r.slugs.every((s) => s.endsWith('.com'))).toBe(true);
    expect(r.slogans.length).toBeGreaterThan(0);
    expect(r.fbUsernames.length).toBeGreaterThan(0);
    expect(r.colors).toHaveLength(3);
  });
  it('returns empty for empty input', () => {
    expect(generateNames('').names).toHaveLength(0);
  });
});

describe('demand-survey', () => {
  it('round-trips a multi-question survey', () => {
    const survey = {
      questions: [{ question: 'Which colour?', options: ['Red', 'Blue', 'Black'] }],
    };
    const decoded = decodeSurvey(encodeSurvey(survey));
    expect(decoded?.questions).toEqual(survey.questions);
  });
  it('builds a shareable link', () => {
    const link = buildSurveyLink(
      { questions: [{ question: 'Q', options: ['A', 'B'] }] },
      'https://x.com/poll',
    );
    expect(link.startsWith('https://x.com/poll?s=')).toBe(true);
  });
  it('returns null for garbage', () => {
    expect(decodeSurvey('!!!not-base64')).toBeNull();
  });
});
