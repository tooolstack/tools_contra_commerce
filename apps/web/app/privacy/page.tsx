import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Notice — Contra Commerce Free Tools',
  description: 'How Contra Commerce Free Tools handles calculator, contact and courier-risk data.',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-gray-700">
      <h1 className="text-3xl font-bold text-gray-950">Privacy notice</h1>
      <p className="mt-2 text-gray-500">Last updated: 27 July 2026</p>

      <div className="mt-8 space-y-7">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">What the free tools process</h2>
          <p className="mt-2">
            Calculator inputs are used to produce the requested result. Basic usage events may be
            stored to understand which tools are useful. Contact details are collected only when
            you submit the follow-up form with consent. Network identifiers in event logs are
            either one-way hashed with a dedicated secret or not stored.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Courier-risk checks</h2>
          <p className="mt-2">
            A risk check sends the authorised customer number to the connected courier-history
            service. The free-tools analytics database does not store the raw number; when a
            dedicated hashing secret is configured, only a one-way identifier and the resulting
            risk level are retained. Addresses are assessed in memory and are not written to the
            free-tools event log.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Purpose and limitations</h2>
          <p className="mt-2">
            Courier history is used only for operational order verification. It does not prove
            fraud, criminal conduct or identity. Merchants must review the evidence and contact the
            customer before cancelling or withholding an order.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Storage and sharing</h2>
          <p className="mt-2">
            Data is stored only in configured Contra Commerce services and essential infrastructure
            providers. It is not sold. Operational logs should be retained only as long as needed
            for security, fraud prevention and service improvement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Your choices</h2>
          <p className="mt-2">
            Do not submit a customer number unless you are authorised to use it for order
            fulfilment. You may decline the optional marketing follow-up. Contact Contra Commerce
            support to request access, correction or deletion of contact data.
          </p>
        </section>
      </div>
    </main>
  );
}
