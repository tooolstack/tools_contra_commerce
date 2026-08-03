'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  compareCourierCharges,
  detectCourierZone,
  DISTRICT_OPTIONS,
  ZONE_OPTIONS,
  type CourierChargeResult,
  type CourierZone,
} from '../logic/courier-charge';
import {
  bdt,
  CalculatorShell,
  InputCard,
  NumberField,
  OutputBox,
  ResultsColumn,
  SelectField,
  TextField,
  useResultTracking,
  type ToolProps,
} from './ui';

type RateMode = 'published' | 'live' | 'contract';

type RatesResponse = {
  result: CourierChargeResult;
  mode: RateMode;
  asOf?: string;
  fallbackReason?: string;
};

type BookingStatus = {
  configured: boolean;
  authenticated: boolean;
  directBooking?: boolean;
  bookingUrl?: string;
  loginUrl?: string;
};

type BookingResponse = {
  ok: boolean;
  reused?: boolean;
  booking?: {
    externalId?: string | null;
    trackingCode?: string | null;
    status?: string;
  };
  error?: string;
};

export type CourierChargeComparisonProps = ToolProps & {
  /** Optional host endpoint that can return live/merchant-contract quotes. */
  ratesEndpoint?: string;
  /** Optional host endpoint that checks the current Contra Commerce session. */
  bookingStatusEndpoint?: string;
  /** Optional host endpoint that creates an authenticated courier booking. */
  bookingEndpoint?: string;
};

const zoneLabel = (zone: CourierZone) =>
  ZONE_OPTIONS.find((option) => option.value === zone)?.label ?? zone;

const nonNegativeInput = (value: string, minimum: number, setter: (value: string) => void) => {
  if (value === '') {
    setter(value);
    return;
  }
  const parsed = Number(value);
  setter(Number.isFinite(parsed) && parsed < minimum ? String(minimum) : value);
};

function bookingHref(base: string, values: Record<string, string>) {
  const params = new URLSearchParams(values).toString();
  return `${base}${base.includes('?') ? '&' : '?'}${params}`;
}

export function CourierChargeComparison({
  brand = 'Contra Commerce',
  ctaText = 'Book the cheapest courier in one click',
  ctaUrl = 'https://app.contracommerce.com/login',
  ratesEndpoint,
  bookingStatusEndpoint,
  bookingEndpoint,
  className = '',
}: CourierChargeComparisonProps) {
  const [pickupDistrict, setPickupDistrict] = useState('Dhaka');
  const [destinationDistrict, setDestinationDistrict] = useState('Dhaka');
  const [destinationArea, setDestinationArea] = useState('Dhanmondi');
  const [weight, setWeight] = useState('1');
  const [cod, setCod] = useState('1000');
  const [remoteRates, setRemoteRates] = useState<RatesResponse | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [rateNotice, setRateNotice] = useState('');
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [invoice, setInvoice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const bookingKey = useRef('');

  const zone = useMemo(
    () =>
      detectCourierZone({
        pickupDistrict,
        destinationDistrict,
        destinationArea,
      }),
    [pickupDistrict, destinationDistrict, destinationArea],
  );

  const numericWeight = Number.parseFloat(weight) || 0.1;
  const numericCod = Number.parseFloat(cod) || 0;
  const localResult = useMemo(
    () =>
      compareCourierCharges({
        zone,
        weightKg: numericWeight,
        codAmount: numericCod,
      }),
    [zone, numericWeight, numericCod],
  );

  useEffect(() => {
    if (!ratesEndpoint) {
      setRemoteRates(null);
      setRateNotice('');
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setRatesLoading(true);
      try {
        const response = await fetch(ratesEndpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            pickupDistrict,
            destinationDistrict,
            destinationArea,
            zone,
            weightKg: numericWeight,
            codAmount: numericCod,
          }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Rate service returned ${response.status}`);
        const payload = (await response.json()) as RatesResponse;
        if (!payload.result?.quotes?.length) throw new Error('No courier quotes returned');
        setRemoteRates(payload);
        setRateNotice(payload.fallbackReason ?? '');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setRemoteRates(null);
          setRateNotice('Live rate service unavailable—showing the published-rate fallback.');
        }
      } finally {
        if (!controller.signal.aborted) setRatesLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [
    ratesEndpoint,
    pickupDistrict,
    destinationDistrict,
    destinationArea,
    zone,
    numericWeight,
    numericCod,
  ]);

  useEffect(() => {
    if (!bookingStatusEndpoint) {
      setBookingStatus({
        configured: false,
        authenticated: false,
        loginUrl: ctaUrl,
      });
      return;
    }

    const controller = new AbortController();
    fetch(bookingStatusEndpoint, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Booking status returned ${response.status}`);
        setBookingStatus((await response.json()) as BookingStatus);
      })
      .catch((error) => {
        if ((error as Error).name !== 'AbortError') {
          setBookingStatus({
            configured: false,
            authenticated: false,
            loginUrl: ctaUrl,
          });
        }
      });

    return () => controller.abort();
  }, [bookingStatusEndpoint, ctaUrl]);

  const result = remoteRates?.result ?? localResult;
  const rateMode = remoteRates?.mode ?? 'published';
  const cheapestQuote = result.quotes.find((quote) => quote.courier === result.cheapest);
  const bookingBase = bookingStatus?.authenticated
    ? bookingStatus.bookingUrl
    : bookingStatus?.loginUrl ?? ctaUrl;
  const actionUrl = bookingBase
    ? bookingHref(bookingBase, {
        courier: result.cheapest,
        pickupDistrict,
        destinationDistrict,
        destinationArea,
        weightKg: String(result.weightKg),
        codAmount: String(result.codAmount),
      })
    : '';

  const submitBooking = async (event: FormEvent) => {
    event.preventDefault();
    if (!bookingEndpoint) return;
    setBookingLoading(true);
    setBookingError('');
    setBookingMessage('');
    if (!bookingKey.current) {
      bookingKey.current =
        globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    try {
      const response = await fetch(bookingEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
          'idempotency-key': bookingKey.current,
        },
        body: JSON.stringify({
          courierId: result.cheapest.toLowerCase().replace(/[^a-z0-9_-]+/g, '-'),
          invoice,
          customerName,
          customerPhone,
          deliveryAddress,
          codAmount: result.codAmount,
          weightKg: result.weightKg,
          itemDescription,
          itemQuantity: 1,
        }),
      });
      const payload = (await response.json()) as BookingResponse;
      if (!response.ok) throw new Error(payload.error || 'Courier booking failed');
      const reference =
        payload.booking?.trackingCode ||
        payload.booking?.externalId ||
        invoice;
      setBookingMessage(
        `${payload.reused ? 'Existing booking found' : 'Courier booked'} · reference ${reference}`,
      );
      bookingKey.current = '';
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Courier booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  useResultTracking('courier-charge', {
    pickupDistrict,
    destinationDistrict,
    destinationArea,
    zone,
    weight,
    cod,
  });

  return (
    <CalculatorShell className={className}>
      <InputCard title="Customer location & parcel">
        <SelectField
          label="Pickup district"
          value={pickupDistrict}
          options={DISTRICT_OPTIONS}
          onChange={setPickupDistrict}
        />
        <SelectField
          label="Customer district"
          value={destinationDistrict}
          options={DISTRICT_OPTIONS}
          onChange={setDestinationDistrict}
        />
        <TextField
          label="Customer area / thana (optional)"
          value={destinationArea}
          placeholder="e.g. Dhanmondi, Savar"
          onChange={setDestinationArea}
        />
        <div className="rounded-lg border border-info/20 bg-info/10 px-3 py-2 text-xs text-info">
          Detected rate zone: <b>{zoneLabel(zone)}</b>
        </div>
        <NumberField
          label="Weight"
          suffix="kg"
          value={weight}
          min={0.1}
          step={0.1}
          onChange={(value) => nonNegativeInput(value, 0.1, setWeight)}
        />
        <NumberField
          label="COD amount"
          suffix="৳"
          value={cod}
          min={0}
          step={1}
          onChange={(value) => nonNegativeInput(value, 0, setCod)}
        />
        <p className="text-xs text-gray-400">
          Weight must be at least 0.1 kg and COD cannot be negative. The zone is calculated from
          the pickup district, customer district and nearby-Dhaka area.
        </p>
      </InputCard>

      <ResultsColumn>
        <OutputBox title="Estimated charges by courier">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-full px-2.5 py-1 font-medium ${
                rateMode === 'contract'
                  ? 'bg-emerald-100 text-emerald-800'
                  : rateMode === 'live'
                    ? 'bg-info/10 text-info'
                    : 'bg-amber-100 text-amber-800'
              }`}
            >
              {rateMode === 'contract'
                ? 'Merchant-contract rates'
                : rateMode === 'live'
                  ? 'Live provider rates'
                  : 'Published-rate estimates'}
            </span>
            {ratesLoading && <span className="text-gray-400">Refreshing rates…</span>}
          </div>

          {rateNotice && (
            <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {rateNotice}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-2 font-medium">Courier</th>
                  <th className="pb-2 text-right font-medium">Delivery</th>
                  <th className="pb-2 text-right font-medium">COD</th>
                  <th className="pb-2 text-right font-medium">If delivered</th>
                  <th className="pb-2 text-right font-medium">Return extra</th>
                  <th className="pb-2 text-right font-medium">If returned</th>
                  <th className="pb-2 text-right font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {result.quotes.map((quote) => {
                  const cheapest = quote.courier === result.cheapest;
                  return (
                    <tr
                      key={quote.courier}
                      className={`border-t border-gray-100 ${cheapest ? 'bg-emerald-50' : ''}`}
                    >
                      <td className="py-2 font-medium text-gray-800">
                        {quote.courier}{' '}
                        {cheapest && <span className="text-xs text-emerald-600">· cheapest</span>}
                        {quote.sourceStatus === 'indicative' && (
                          <span className="block text-[10px] font-normal text-amber-600">
                            indicative
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right text-gray-600">{bdt(quote.deliveryCharge)}</td>
                      <td className="py-2 text-right text-gray-600">{bdt(quote.codCharge)}</td>
                      <td
                        className={`py-2 text-right font-semibold ${
                          cheapest ? 'text-emerald-700' : 'text-gray-900'
                        }`}
                      >
                        {bdt(quote.deliveredTotal)}
                      </td>
                      <td className="py-2 text-right text-red-500">{bdt(quote.returnCharge)}</td>
                      <td className="py-2 text-right font-medium text-red-700">
                        {bdt(quote.returnTotal)}
                      </td>
                      <td className="py-2 text-right text-gray-500">{quote.estDays} day(s)</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            <b>If delivered</b> = forward delivery + COD. <b>If returned</b> = forward delivery
            attempt + any additional return charge; COD is not included.
          </p>

          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="text-xs font-medium text-gray-700">Rate sources</p>
            <ul className="mt-1 space-y-1 text-xs text-gray-500">
              {result.quotes.map((quote) => (
                <li key={`${quote.courier}-source`}>
                  <a
                    href={quote.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {quote.courier}: {quote.sourceLabel}
                  </a>{' '}
                  · reviewed {quote.asOf}
                  {quote.note ? ` · ${quote.note}` : ''}
                </li>
              ))}
            </ul>
          </div>
        </OutputBox>

        <div className="rounded-2xl bg-gray-900 p-5 text-white">
          <p className="text-sm font-medium">
            {bookingStatus?.authenticated
              ? `${ctaText}: ${result.cheapest}`
              : 'One-click booking is for Contra Commerce members'}
          </p>
          <p className="mt-1 text-xs text-gray-300">
            {bookingStatus?.authenticated
              ? `${cheapestQuote ? `${bdt(cheapestQuote.deliveredTotal)} estimated delivered cost. ` : ''}Continue with these parcel details prefilled.`
              : bookingStatus?.configured
                ? 'Sign in to detect your merchant session and continue to courier booking.'
                : 'The booking bridge is ready, but this host still needs the Contra Commerce session endpoint configured.'}
          </p>
          {bookingStatus?.authenticated && bookingEndpoint ? (
            <form onSubmit={submitBooking} className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Customer name"
                  maxLength={100}
                  required
                  className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400"
                />
                <input
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value.replace(/\D/g, '').slice(0, 13))}
                  placeholder="01XXXXXXXXX"
                  inputMode="tel"
                  pattern="(?:88)?01[0-9]{9}"
                  required
                  className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400"
                />
                <input
                  value={invoice}
                  onChange={(event) => setInvoice(event.target.value)}
                  placeholder="Unique invoice / order ID"
                  maxLength={100}
                  required
                  className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400"
                />
                <input
                  value={itemDescription}
                  onChange={(event) => setItemDescription(event.target.value)}
                  placeholder="Item description (optional)"
                  maxLength={300}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400"
                />
              </div>
              <textarea
                value={deliveryAddress}
                onChange={(event) => setDeliveryAddress(event.target.value)}
                placeholder="Full delivery address"
                minLength={8}
                maxLength={500}
                required
                rows={2}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400"
              />
              {bookingMessage && (
                <p role="status" className="rounded-lg bg-emerald-900/60 px-3 py-2 text-xs text-emerald-100">
                  {bookingMessage}
                </p>
              )}
              {bookingError && (
                <p role="alert" className="rounded-lg bg-red-900/60 px-3 py-2 text-xs text-red-100">
                  {bookingError}
                </p>
              )}
              <button
                type="submit"
                disabled={bookingLoading}
                className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 disabled:opacity-60"
              >
                {bookingLoading ? 'Booking…' : `Book ${result.cheapest} now →`}
              </button>
              <p className="text-[11px] text-gray-400">
                The booking is idempotent: retrying the same submission will not create a duplicate parcel.
              </p>
            </form>
          ) : actionUrl ? (
            <a
              href={actionUrl}
              className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              {bookingStatus?.authenticated ? 'Book cheapest courier →' : `Sign in with ${brand} →`}
            </a>
          ) : null}
        </div>
      </ResultsColumn>
    </CalculatorShell>
  );
}
