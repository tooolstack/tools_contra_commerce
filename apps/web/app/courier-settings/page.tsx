import type { Metadata } from 'next';
import { CourierSettings } from '../components/CourierSettings';
import { getHubUrl } from '../../lib/domain';

export const metadata: Metadata = {
  title: 'Courier Integrations — Contra Commerce',
  description: 'Securely connect multiple courier merchant APIs.',
};

export default function CourierSettingsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <a href={getHubUrl()} className="hover:text-gray-900">
          Free Tools
        </a>{' '}
        / Courier integrations
      </nav>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Settings</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-950">Courier integrations</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Connect multiple merchant courier accounts so order checks can use your verified
          delivery history. No Contra Commerce account is required.
        </p>
      </header>
      <CourierSettings />
    </main>
  );
}
