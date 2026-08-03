/**
 * Product Demand Survey Maker — pure logic (client-side, self-contained).
 *
 * A survey is one optional product image + one or more questions, each with its
 * own options. The whole thing is base64-encoded into the shareable link, so no
 * backend is needed to create or render a poll. Collecting/storing responses is
 * the one part that uses the SaaS backend (POST /api/survey-vote).
 */

export type SurveyQuestion = { question: string; options: string[] };

export type Survey = {
  /** Optional product image URL shown at the top of the poll */
  imageUrl?: string;
  questions: SurveyQuestion[];
};

const isBrowser = typeof window !== 'undefined';

function toBase64(s: string): string {
  if (isBrowser) return window.btoa(unescape(encodeURIComponent(s)));
  return Buffer.from(s, 'utf-8').toString('base64');
}

function fromBase64(s: string): string {
  if (isBrowser) return decodeURIComponent(escape(window.atob(s)));
  return Buffer.from(s, 'base64').toString('utf-8');
}

function clean(survey: Survey): Survey {
  return {
    imageUrl: survey.imageUrl?.trim() || undefined,
    questions: (survey.questions || [])
      .map((q) => ({
        question: (q.question || '').slice(0, 200),
        options: q.options.map((o) => o.trim()).filter(Boolean).slice(0, 8),
      }))
      .filter((q) => q.question && q.options.length > 0)
      .slice(0, 10),
  };
}

/** URL-safe base64 encode of the survey. */
export function encodeSurvey(survey: Survey): string {
  return toBase64(JSON.stringify(clean(survey)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeSurvey(encoded: string): Survey | null {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const parsed = JSON.parse(fromBase64(b64)) as Survey;
    if (!Array.isArray(parsed.questions)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Build the shareable poll link. `basePollUrl` should point at the poll page. */
export function buildSurveyLink(survey: Survey, basePollUrl: string): string {
  return `${basePollUrl}?s=${encodeSurvey(survey)}`;
}
