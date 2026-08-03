'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { getHubUrl } from '../../lib/domain';

export function LeadCapture() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [consent, setConsent] = useState(false);
  const [contactTouched, setContactTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const contactKind = useMemo<'email' | 'mobile' | null>(() => {
    const value = contact.trim();
    if (!value) return null;
    return value.includes('@') ? 'email' : 'mobile';
  }, [contact]);

  const validContact = useMemo(() => {
    const value = contact.trim();
    const digits = value.replace(/\D/g, '');
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^(?:88)?01\d{9}$/.test(digits);
  }, [contact]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setContactTouched(true);
    if (!validContact || !consent) return;
    setStatus('saving');

    const isEmail = contact.includes('@');
    const params = new URLSearchParams(window.location.search);
    const tool =
      window.location.hostname.split('.')[0] ||
      window.location.pathname.split('/').filter(Boolean)[0] ||
      'tools-hub';

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tool,
          name,
          email: isEmail ? contact.trim() : undefined,
          phone: isEmail ? undefined : contact.replace(/\D/g, ''),
          consent,
          meta: {
            page: window.location.pathname,
            utmSource: params.get('utm_source'),
            utmCampaign: params.get('utm_campaign'),
          },
        }),
      });
      setStatus(response.ok ? 'saved' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer aria-label="Contra Commerce follow-up" className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:py-10">
        <div className="grid overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative overflow-hidden bg-ink p-6 text-white sm:p-8 lg:p-10">
            <div
              className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/10"
              aria-hidden="true"
            />
            <div
              className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-white/10"
              aria-hidden="true"
            />
            <p className="relative text-xs font-medium uppercase tracking-[0.16em] text-gray-300">
              Personal follow-up
            </p>
            <h2 className="relative mt-3 max-w-sm text-2xl font-semibold tracking-tight sm:text-3xl">
              Turn your result into a practical next step.
            </h2>
            <p className="relative mt-3 max-w-md text-sm leading-6 text-gray-300">
              Share one contact and get a free Contra Commerce setup follow-up based on the tool
              you used.
            </p>
          </div>

          <div className="flex min-h-56 items-center p-6 sm:p-8 lg:p-10">
            {status === 'saved' ? (
              <div
                role="status"
                className="w-full rounded-xl border border-emerald-200 bg-emerald-50 p-5"
              >
                <span className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-success text-sm font-semibold text-white">
                  ✓
                </span>
                <p className="font-semibold text-ink">Your request is saved.</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  We’ll use your details only for the requested Contra Commerce follow-up.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="w-full" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-gray-700">
                      Your name <span className="font-normal text-gray-500">(optional)</span>
                    </span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="How should we address you?"
                      maxLength={100}
                      autoComplete="name"
                      className="h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-ink focus:ring-2 focus:ring-gray-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-gray-700">
                      Mobile number or email
                    </span>
                    <input
                      value={contact}
                      onChange={(event) => {
                        setContact(event.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      onBlur={() => setContactTouched(true)}
                      placeholder="01XXXXXXXXX or you@example.com"
                      maxLength={160}
                      autoComplete={contactKind === 'mobile' ? 'tel' : 'email'}
                      inputMode={contactKind === 'mobile' ? 'tel' : 'email'}
                      aria-invalid={contactTouched && !validContact}
                      aria-describedby="follow-up-contact-help"
                      className={`h-11 w-full min-w-0 rounded-lg border bg-white px-3 text-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:ring-2 ${
                        contactTouched && !validContact
                          ? 'border-error focus:border-error focus:ring-red-100'
                          : validContact
                            ? 'border-success focus:border-success focus:ring-emerald-100'
                            : 'border-gray-300 focus:border-ink focus:ring-gray-100'
                      }`}
                    />
                    <span
                      id="follow-up-contact-help"
                      className={`mt-1.5 block min-h-4 text-xs ${
                        contactTouched && !validContact ? 'text-error' : 'text-gray-500'
                      }`}
                    >
                      {contactTouched && !validContact
                        ? `Enter a valid ${contactKind === 'email' ? 'email address' : 'Bangladesh mobile number'}.`
                        : validContact
                          ? `${contactKind === 'email' ? 'Email address' : 'Mobile number'} looks good.`
                          : 'We accept a Bangladesh mobile number or email address.'}
                    </span>
                  </label>
                </div>

                <div className="mt-5 grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-gray-600">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-ink focus:ring-ink"
                      />
                      <span>
                        I agree to receive this follow-up and accept the{' '}
                        <a
                          href={`${getHubUrl()}/privacy`}
                          className="font-medium text-ink underline underline-offset-2"
                        >
                          privacy notice
                        </a>
                        .
                      </span>
                    </label>
                    <div className="mt-1 min-h-4" aria-live="polite">
                      {status === 'error' && (
                        <p className="text-xs text-error">
                          Could not save this request. Please try again.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full sm:w-auto">
                    {status === 'error' && (
                      <span className="sr-only">The previous request failed.</span>
                    )}
                    <button
                      type="submit"
                      disabled={!validContact || !consent || status === 'saving'}
                      className="inline-flex h-11 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-ink px-5 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-gray-800 hover:shadow-sm disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none sm:w-auto"
                    >
                      {status === 'saving'
                        ? 'Sending request…'
                        : !validContact
                          ? 'Enter your contact'
                          : !consent
                            ? 'Accept to continue'
                            : 'Request free follow-up'}
                      {status !== 'saving' && validContact && consent && (
                        <span className="ml-2" aria-hidden="true">
                          →
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
