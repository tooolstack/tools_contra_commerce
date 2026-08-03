'use client';

import { useMemo, useState } from 'react';
import { generateNames } from '../logic/name-ideas';
import {
  CopyField,
  CtaCard,
  InputCard,
  OutputBox,
  ResultsColumn,
  TextField,
  type ToolProps,
} from './ui';

export type NameCheckerProps = ToolProps & {
  /** API endpoint for domain checks (default: /api/domain-check) */
  endpoint?: string;
};

type DomainResult = { domain: string; available: boolean | null };

export function NameChecker({
  brand = 'Contra Commerce',
  ctaText = 'Found a name? Launch your free store on Contra Commerce',
  ctaUrl = '#',
  className = '',
  endpoint = '/api/domain-check',
}: NameCheckerProps) {
  const [keyword, setKeyword] = useState('shoes');
  const [ideas, setIdeas] = useState(() => generateNames('shoes'));
  const [domains, setDomains] = useState<DomainResult[]>([]);
  const [loading, setLoading] = useState(false);

  const suggestion = useMemo(() => generateNames(keyword), [keyword]);

  const check = async () => {
    setIdeas(suggestion);
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ domains: suggestion.slugs }),
      });
      const data = await res.json();
      setDomains(data.results as DomainResult[]);
    } catch {
      setDomains([]);
    } finally {
      setLoading(false);
    }
  };

  const badge = (a: boolean | null) =>
    a === true ? ['Available', 'text-emerald-700 bg-emerald-50']
      : a === false ? ['Taken', 'text-red-600 bg-red-50']
      : ['—', 'text-gray-500 bg-gray-100'];

  return (
    <div className={`grid items-start gap-6 lg:grid-cols-2 ${className}`}>
      <InputCard title="Brand keyword">
        <TextField label="Your niche / keyword" value={keyword} onChange={setKeyword} placeholder="shoes" />
        <button
          type="button"
          onClick={check}
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Checking domains…' : 'Generate names & check domains'}
        </button>

        <div className="pt-3">
          <p className="mb-1 text-xs text-gray-500">Slogan ideas</p>
          <div className="space-y-1.5">
            {ideas.slogans.map((s) => (
              <CopyField key={s} value={s} />
            ))}
          </div>
        </div>
      </InputCard>

      <ResultsColumn>
        <OutputBox title="Name ideas & domains">
          <div className="space-y-1.5">
            {ideas.names.map((name, i) => {
              const dom = domains.find((d) => d.domain === ideas.slugs[i]);
              const [label, cls] = badge(dom?.available ?? null);
              return (
                <div key={name} className="flex items-center justify-between gap-2 border-b border-gray-100 py-1.5 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{name}</p>
                    <p className="text-xs text-gray-400">{ideas.slugs[i]}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </OutputBox>

        <OutputBox title="Facebook page username ideas">
          <div className="flex flex-wrap gap-2">
            {ideas.fbUsernames.map((u) => (
              <span key={u} className="rounded-lg bg-gray-100 px-2.5 py-1 text-sm text-gray-700">
                @{u}
              </span>
            ))}
          </div>
        </OutputBox>

        <OutputBox title="Recommended brand colours">
          <div className="flex gap-3">
            {ideas.colors.map((c) => (
              <div key={c.hex} className="flex items-center gap-2">
                <span
                  className="h-8 w-8 rounded-lg border border-gray-200"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs text-gray-500">
                  {c.name}
                  <br />
                  {c.hex}
                </span>
              </div>
            ))}
          </div>
        </OutputBox>

        <CtaCard href={ctaUrl} text={ctaText} brand={brand} />
      </ResultsColumn>
    </div>
  );
}
