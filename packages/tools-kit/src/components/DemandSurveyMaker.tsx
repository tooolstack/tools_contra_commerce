'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildSurveyLink, type Survey, type SurveyQuestion } from '../logic/demand-survey';
import {
  CopyField,
  CtaCard,
  InputCard,
  OutputBox,
  ResultsColumn,
  TextField,
  type ToolProps,
} from './ui';

export type DemandSurveyMakerProps = ToolProps & {
  /** Base URL of the poll page (default: current origin + /poll) */
  pollBaseUrl?: string;
};

type Q = { question: string; options: string[] };

const START: Q[] = [
  { question: 'Which colour would you buy?', options: ['Black', 'White', 'Navy', ''] },
  { question: 'What price would you pay?', options: ['৳800', '৳1000', '৳1200', ''] },
];

export function DemandSurveyMaker({
  brand = 'Contra Commerce',
  ctaText = 'Turn demand into pre-orders with Contra Commerce',
  ctaUrl = '#',
  className = '',
  pollBaseUrl,
}: DemandSurveyMakerProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [questions, setQuestions] = useState<Q[]>(START);
  const [base,setBase]=useState(pollBaseUrl??'/poll');
  useEffect(()=>setBase(pollBaseUrl??`${window.location.origin}/poll`),[pollBaseUrl]);

  const survey: Survey = useMemo(
    () => ({
      imageUrl: imageUrl.trim() || undefined,
      questions: questions
        .map((q): SurveyQuestion => ({ question: q.question, options: q.options.filter((o) => o.trim()) }))
        .filter((q) => q.question && q.options.length > 0),
    }),
    [imageUrl, questions],
  );
  const link = useMemo(() => buildSurveyLink(survey, base), [survey, base]);

  const setQ = (qi: number, patch: Partial<Q>) =>
    setQuestions((prev) => prev.map((q, i) => (i === qi ? { ...q, ...patch } : q)));
  const setOpt = (qi: number, oi: number, v: string) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? v : o)) } : q)),
    );
  const addOpt = (qi: number) => setQ(qi, { options: [...questions[qi].options, ''] });
  const addQuestion = () => setQuestions((prev) => [...prev, { question: '', options: ['', ''] }]);
  const removeQuestion = (qi: number) => setQuestions((prev) => prev.filter((_, i) => i !== qi));

  return (
    <div className={`grid items-start gap-6 lg:grid-cols-2 ${className}`}>
      <InputCard title="Build your survey">
        <TextField label="Product image URL (optional)" value={imageUrl} onChange={setImageUrl} placeholder="https://…/product.jpg" />
        {questions.map((q, qi) => (
          <div key={qi} className="rounded-xl border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder={`Question ${qi + 1}`}
                value={q.question}
                onChange={(e) => setQ(qi, { question: e.target.value })}
              />
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(qi)} className="px-1 text-gray-400 hover:text-red-600" aria-label="Remove question">✕</button>
              )}
            </div>
            <div className="mt-2 space-y-1.5">
              {q.options.map((o, oi) => (
                <input
                  key={oi}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                  placeholder={`Option ${oi + 1}`}
                  value={o}
                  onChange={(e) => setOpt(qi, oi, e.target.value)}
                />
              ))}
            </div>
            <button type="button" onClick={() => addOpt(qi)} className="mt-1.5 text-xs font-medium text-blue-600 hover:text-blue-800">+ Add option</button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="text-sm font-medium text-blue-600 hover:text-blue-800">+ Add question</button>
      </InputCard>

      <ResultsColumn>
        <OutputBox title="Your shareable poll link">
          <CopyField value={link} />
          <p className="mt-2 text-xs text-gray-400">
            Share on Facebook or WhatsApp — anyone can open and vote, no login.
          </p>
        </OutputBox>
        <OutputBox title="Preview">
          {survey.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={survey.imageUrl} alt="Product" className="mb-3 max-h-40 rounded-lg" />
          )}
          {survey.questions.map((q, i) => (
            <div key={i} className="mb-3">
              <p className="font-medium text-gray-900">{q.question}</p>
              <div className="mt-1.5 space-y-1">
                {q.options.map((o) => (
                  <div key={o} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700">{o}</div>
                ))}
              </div>
            </div>
          ))}
        </OutputBox>
        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </div>
  );
}
