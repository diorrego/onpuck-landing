// Cal.com webhooks: signature check and the BOOKING_CREATED payload, so a call booked without
// the form still reaches the Attio funnel. Server only.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { normaliseCompany } from './apply';

/** Cal.com signs the raw body: X-Cal-Signature-256 = hex HMAC-SHA256 with the webhook secret. */
export function verifyCalSignature(raw: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(raw).digest('hex'));
  const given = Buffer.from(signature.trim().toLowerCase());
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export type Booking = {
  uid: string;
  email: string;
  name: string;
  startTime: string;
  timeZone?: string;
  domain?: string;
  answers: [label: string, value: string][];
};

const FREE_MAIL = new Set(['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'aol.com', 'gmx.com']);
// answers already stored as fields, or empty by design
const SKIP = new Set(['name', 'email', 'guests', 'location', 'rescheduleReason']);

type Answer = { label?: string; value?: unknown };
type Payload = {
  uid?: string;
  startTime?: string;
  attendees?: { email?: string; name?: string; timeZone?: string }[];
  responses?: Record<string, Answer>;
};

const text = (v: unknown): string => {
  if (typeof v === 'string') return v.trim();
  if (Array.isArray(v)) return v.map(text).filter(Boolean).join(', ');
  if (v && typeof v === 'object') return Object.values(v).map(text).filter(Boolean).join(' ');
  return v === undefined || v === null ? '' : String(v);
};

export function parseBooking(body: unknown): Booking | null {
  if (!body || typeof body !== 'object') return null;
  const { triggerEvent, payload } = body as { triggerEvent?: string; payload?: Payload };
  if (triggerEvent !== 'BOOKING_CREATED' || !payload) return null;
  const attendee = payload.attendees?.[0];
  const email = attendee?.email?.trim().toLowerCase();
  if (!email) return null;

  const answers: [string, string][] = Object.entries(payload.responses ?? {})
    .filter(([key]) => !SKIP.has(key))
    .map(([key, a]): [string, string] => [a.label || key, text(a.value)])
    .filter(([, value]) => value);
  const site = answers.find(([label]) => /website|company|url/i.test(label));
  const emailDomain = email.split('@')[1];
  const domain = (site && normaliseCompany(site[1])?.domain) || (FREE_MAIL.has(emailDomain) ? undefined : emailDomain);

  return {
    uid: payload.uid ?? '',
    email,
    name: attendee?.name?.trim() || text(payload.responses?.name?.value),
    startTime: payload.startTime ?? '',
    timeZone: attendee?.timeZone,
    domain,
    answers,
  };
}

/** The booking as the Attio note body. */
export function bookingText(b: Booking): string {
  return [
    `Intro call booked on Cal.com for ${b.startTime}${b.timeZone ? ` (${b.timeZone})` : ''}.`,
    `Name: ${b.name || 'not given'}`,
    '',
    ...b.answers.map(([label, value]) => `${label}: ${value}`),
    '',
    `Booking: ${b.uid}`,
  ]
    .join('\n')
    .trim();
}
