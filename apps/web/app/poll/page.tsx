import type { Metadata } from 'next';
import { decodeSurvey } from '@contra/tools-kit';
import { PollVote } from './PollVote';

export const metadata: Metadata = {
  title: 'Quick Poll — Contra Commerce',
  description: 'Cast your vote in this quick product poll.',
};

export default async function PollPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const { s } = await searchParams;
  const survey = s ? decodeSurvey(s) : null;

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      {survey && survey.questions.length > 0 ? (
        <PollVote survey={survey} surveyHash={s ?? ''} />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          This poll link is invalid or empty.
        </div>
      )}
      <p className="mt-6 text-center text-xs text-gray-400">Powered by Contra Commerce</p>
    </main>
  );
}
