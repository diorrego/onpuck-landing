import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { bookingText, parseBooking, verifyCalSignature } from './cal-webhook';
import { created } from './cal-webhook.fixture';

describe('verifyCalSignature', () => {
  const raw = JSON.stringify(created);
  const sign = (body: string, secret: string) => createHmac('sha256', secret).update(body).digest('hex');

  it('accepts the HMAC-SHA256 of the raw body with the shared secret', () => {
    expect(verifyCalSignature(raw, sign(raw, 's3cret'), 's3cret')).toBe(true);
  });

  it('rejects a wrong secret, a changed body, a missing header and Cal.com’s no-secret placeholder', () => {
    expect(verifyCalSignature(raw, sign(raw, 'other'), 's3cret')).toBe(false);
    expect(verifyCalSignature(raw + ' ', sign(raw, 's3cret'), 's3cret')).toBe(false);
    expect(verifyCalSignature(raw, null, 's3cret')).toBe(false);
    expect(verifyCalSignature(raw, 'no-secret-provided', 's3cret')).toBe(false);
  });
});

describe('parseBooking', () => {
  it('reads the attendee, the company from the website answer and the other answers', () => {
    const b = parseBooking(created)!;
    expect(b).toMatchObject({ uid: 'bk_123', email: 'diego@woku.app', name: 'Diego Orrego (test)', domain: 'woku.app', startTime: '2026-10-27T02:30:00Z' });
    expect(b.answers).toEqual([
      ['Startup website', 'https://www.woku.app/en'],
      ['Do you run user interviews?', 'Not yet, but planning to'],
    ]);
  });

  it('falls back to the email domain for the company, but not for free mail', () => {
    const noSite = structuredClone(created);
    delete (noSite.payload.responses as Record<string, unknown>)['startup-website'];
    expect(parseBooking(noSite)!.domain).toBe('woku.app');
    noSite.payload.attendees[0].email = 'someone@gmail.com';
    expect(parseBooking(noSite)!.domain).toBeUndefined();
  });

  it('ignores other triggers and payloads without an attendee email', () => {
    expect(parseBooking({ ...created, triggerEvent: 'BOOKING_CANCELLED' })).toBeNull();
    expect(parseBooking({ triggerEvent: 'PING' })).toBeNull();
    expect(parseBooking({ triggerEvent: 'BOOKING_CREATED', payload: { attendees: [] } })).toBeNull();
    expect(parseBooking('nonsense')).toBeNull();
  });

  it('turns the booking into a plain-text note', () => {
    const text = bookingText(parseBooking(created)!);
    expect(text).toContain('Intro call booked on Cal.com for 2026-10-27T02:30:00Z (America/Santiago)');
    expect(text).toContain('Do you run user interviews?: Not yet, but planning to');
    expect(text).toContain('Booking: bk_123');
  });
});
