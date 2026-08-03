import Image from 'next/image';

const COMMERCE_URL = 'https://contradigital.agency/contracommerce';

function AdvertisementCard({ compact = false }: { compact?: boolean }) {
  return (
    <article
      className={
        compact
          ? 'grid overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:grid-cols-[13rem_1fr]'
          : 'overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'
      }
    >
      <a
        href={COMMERCE_URL}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label="Visit Contra Commerce"
        className={`group relative flex overflow-hidden border-b border-gray-200 bg-gray-100 ${
          compact
            ? 'min-h-48 items-center justify-center sm:min-h-60'
            : 'aspect-[4/3] items-center justify-center'
        }`}
      >
        <span className="absolute -right-14 -top-14 h-44 w-44 rounded-full border border-gray-200" />
        <span className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-gray-200" />
        <span className="absolute bottom-5 left-5 h-px w-16 bg-gray-300" />
        <div className="relative grid h-28 w-28 place-items-center rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
          <Image
            src="/images/ads/contra-commerce-mark.png"
            alt="Contra Commerce"
            width={72}
            height={72}
            sizes="72px"
            className="h-16 w-16 object-contain"
          />
        </div>
        <span className="absolute left-3 top-3 rounded-full border border-gray-300 bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-700 backdrop-blur">
          Sponsored
        </span>
      </a>

      <div className={compact ? 'flex flex-col justify-center p-5 sm:p-6' : 'p-5'}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
            Contra Commerce
          </p>
          <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
        </div>
        <h2 className={`font-semibold tracking-tight text-ink ${compact ? 'mt-3 text-xl' : 'mt-3 text-lg'}`}>
          Launch your store. Run everything from one dashboard.
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Storefront, checkout, courier workflow, campaigns, page building, and ad-ready tracking
          built for ecommerce in Bangladesh.
        </p>
        <div className={`flex flex-wrap gap-2 ${compact ? 'mt-4' : 'mt-4'}`} aria-label="Services">
          {['COD + courier', 'Ad-ready', '7-day trial'].map((service) => (
            <span
              key={service}
              className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-medium text-gray-600"
            >
              {service}
            </span>
          ))}
        </div>
        <a
          href={COMMERCE_URL}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="mt-5 inline-flex h-10 w-full items-center justify-between gap-3 whitespace-nowrap rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Explore Contra Commerce
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

export function CommerceAdvertisement() {
  return (
    <>
      <aside
        aria-label="Advertisement"
        className="relative z-30 hidden min-w-0 self-stretch xl:block"
      >
        <div className="sticky top-[6.5rem]">
          <AdvertisementCard />
        </div>
      </aside>

      <aside
        aria-label="Advertisement"
        className="mx-auto mt-12 w-full max-w-[1280px] px-4 xl:hidden"
      >
        <AdvertisementCard compact />
      </aside>
    </>
  );
}
