import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Hind_Siliguri, IBM_Plex_Mono, Outfit } from 'next/font/google';
import { CommerceAdvertisement } from './components/CommerceAdvertisement';
import { LeadCapture } from './components/LeadCapture';
import { getHubUrl } from '../lib/domain';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Contra Commerce — Free Business Tools',
  description: 'Free e-commerce calculators and selling tools for online businesses in Bangladesh.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${ibmPlexMono.variable} ${hindSiliguri.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-paper/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-4">
            <a
              href={getHubUrl()}
              className="group inline-flex min-w-0 items-center gap-3"
              aria-label="Contra Commerce tools home"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink text-sm font-semibold text-white">
                C
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold leading-tight text-ink">
                  Contra Commerce
                </span>
                <span className="block text-xs leading-tight text-gray-500">Free business tools</span>
              </span>
            </a>

            <nav aria-label="Primary navigation" className="flex items-center gap-2">
              <a
                href={getHubUrl()}
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-ink sm:inline-flex"
              >
                All tools
              </a>
              <a
                href={`${getHubUrl()}/courier-settings`}
                aria-label="Courier integration settings"
                title="Courier integrations"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-100 hover:text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z" />
                  <path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l2-1.55-2-3.46-2.5 1a7.7 7.7 0 0 0-2.6-1.5L14 2.3h-4l-.4 2.69A7.7 7.7 0 0 0 7 6.49l-2.5-1-2 3.46 2 1.55a7.8 7.8 0 0 0 0 3l-2 1.55 2 3.46 2.5-1a7.7 7.7 0 0 0 2.6 1.5l.4 2.69h4l.4-2.69a7.7 7.7 0 0 0 2.6-1.5l2.5 1 2-3.46-2-1.55Z" />
                </svg>
                <span className="hidden sm:inline">Courier settings</span>
              </a>
            </nav>
          </div>
        </header>
        <div className="relative mx-auto w-full max-w-[1280px] min-w-0 xl:grid xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-start xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">{children}</div>
          <CommerceAdvertisement />
        </div>
        <LeadCapture />
        <footer aria-label="Site information" className="border-t border-gray-200 bg-paper">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 py-7 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={getHubUrl()}
              className="inline-flex items-center gap-2.5 self-start text-ink"
              aria-label="Contra Commerce tools home"
            >
              <span className="grid h-7 w-7 place-items-center rounded-md bg-ink text-[10px] font-semibold text-white">
                C
              </span>
              <span className="text-sm font-semibold">Contra Commerce</span>
            </a>
            <div className="flex flex-col gap-3 text-xs text-gray-500 sm:items-end">
              <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
                <a href={getHubUrl()} className="transition hover:text-ink">
                  All tools
                </a>
                <a
                  href={`${getHubUrl()}/courier-settings`}
                  className="transition hover:text-ink"
                >
                  Courier settings
                </a>
                <a href="/privacy" className="transition hover:text-ink">
                  Privacy notice
                </a>
              </nav>
              <p>© {new Date().getFullYear()} Contra Commerce. Free business tools.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
