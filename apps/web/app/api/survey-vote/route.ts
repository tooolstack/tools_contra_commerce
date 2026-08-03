import { NextResponse } from 'next/server';
import { saveVote } from '../../../lib/db';
import { checkRateLimit, cleanText, requestWithinSize } from '../../../lib/api-security';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const rate = await checkRateLimit(req, 'survey-vote', 60, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  if (!requestWithinSize(req, 24_000)) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  const body = await req.json().catch(() => ({}));
  const surveyHash = cleanText(body.surveyHash, 512);
  if (!surveyHash) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  // Multi-question: answers[]; falls back to a single choice.
  const answers: { question?: string; choice?: string }[] = Array.isArray(body.answers)
    ? body.answers
    : [{ question: body.question, choice: body.choice }];

  let saved = 0;
  for (const a of answers) {
    const choice = cleanText(a.choice, 200);
    if (!choice) continue;
    await saveVote({ surveyHash, question: cleanText(a.question, 200), choice, req });
    saved += 1;
  }

  if (saved === 0) return NextResponse.json({ error: 'no_answers' }, { status: 400 });
  return NextResponse.json({ ok: true, saved });
}
