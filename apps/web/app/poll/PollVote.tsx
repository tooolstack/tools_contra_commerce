'use client';

import { useState } from 'react';
import type { Survey } from '@contra/tools-kit';

export function PollVote({ survey, surveyHash }: { survey: Survey; surveyHash: string }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = survey.questions.every((_, i) => answers[i]);

  const submit = () => {
    setSubmitted(true);
    const payload = survey.questions.map((q, i) => ({ question: q.question, choice: answers[i] }));
    fetch('/api/survey-vote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ surveyHash, answers: payload }),
    }).catch(() => {});
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {survey.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={survey.imageUrl} alt="Product" className="mb-4 max-h-56 w-full rounded-xl object-cover" />
      )}

      {submitted ? (
        <div>
          <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">Thanks for voting! 🎉</p>
          <a
            href="https://app.contracommerce.com/signup"
            className="mt-4 block rounded-xl bg-gray-900 p-4 text-center text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Collect &amp; analyse responses with Contra Commerce →
          </a>
        </div>
      ) : (
        <>
          {survey.questions.map((q, qi) => (
            <div key={qi} className="mb-5">
              <h2 className="text-base font-semibold text-gray-900">{q.question}</h2>
              <div className="mt-2 space-y-2">
                {q.options.map((o) => {
                  const selected = answers[qi] === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [qi]: o }))}
                      className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition ${
                        selected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-800 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={submit}
            disabled={!allAnswered}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            Submit my answers
          </button>
        </>
      )}
    </div>
  );
}
