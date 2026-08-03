import { TOOLS } from '../lib/tools';
import { getToolUrl } from '../lib/domain';

export default function Home() {
  const categories = ['Business', 'Creator', 'Developer & SEO', 'Image & Document', 'Productivity', 'Everyday Calculators'] as const;
  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-8 sm:pt-10">
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden="true" />
              Built for commerce in Bangladesh
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Practical tools for better business decisions.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Free calculators and selling utilities for pricing, profit, delivery, campaigns,
              and everyday commerce operations.
            </p>
          </div>
          <div className="flex items-center gap-8 border-t border-gray-200 pt-6 lg:border-l lg:border-t-0 lg:pb-1 lg:pl-8 lg:pt-0">
            <div>
              <p className="text-2xl font-semibold text-ink">{TOOLS.filter((tool) => tool.ready).length}</p>
              <p className="text-xs text-gray-500">Tools available</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink">Free</p>
              <p className="text-xs text-gray-500">No account needed</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">Directory</p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">Choose a tool</h2>
        </div>
        <p className="hidden text-sm text-gray-500 sm:block">Simple, focused, and ready to use.</p>
      </div>

      <div className="mt-5 space-y-10">
        {categories.map((category) => {
          const tools = TOOLS.filter((tool) => (tool.category || 'Business') === category);
          if (!tools.length) return null;
          return <section key={category}><h3 className="mb-4 border-b border-gray-200 pb-2 text-sm font-semibold uppercase tracking-[0.14em] text-gray-500">{category}</h3><ul className="grid items-stretch gap-4 sm:auto-rows-fr sm:grid-cols-2">{tools.map((t) => (
          <li key={t.slug} className="h-full min-w-0">
            {t.ready ? (
              // Each tool opens on its own subdomain → cross-origin, so an absolute <a>.
              <a
                href={getToolUrl(t.slug)}
                className="group relative flex h-full min-h-32 flex-col justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-[0_0_0_1px_rgba(10,10,11,0.06),0_12px_32px_rgba(10,10,11,0.10)] focus-visible:border-ink focus-visible:shadow-[0_0_0_3px_rgba(10,10,11,0.10)] sm:min-h-36"
              >
                <span
                  className="absolute right-4 top-4 translate-x-1 text-sm text-gray-400 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:text-ink group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:text-ink group-focus-visible:opacity-100"
                  aria-hidden="true"
                >
                  ↗
                </span>
                <p className="pr-6 font-semibold text-gray-900 transition-colors group-hover:text-ink">
                  {t.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-600">{t.desc}</p>
              </a>
            ) : (
              <div className="flex h-full min-h-32 cursor-not-allowed flex-col justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 p-5 sm:min-h-36">
                <p className="font-semibold text-gray-400">{t.title}</p>
                <p className="mt-1 text-sm text-gray-400">{t.desc}</p>
              </div>
            )}
          </li>
          ))}</ul></section>;
        })}
      </div>
    </main>
  );
}
