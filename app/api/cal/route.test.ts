import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { created } from '@/lib/cal-webhook.fixture';
import { POST } from './route';

const sign = (body: string) => createHmac('sha256', 'whsec').update(body).digest('hex');
const post = (body: unknown, signature?: string) => {
  const raw = typeof body === 'string' ? body : JSON.stringify(body);
  return POST(new Request('https://www.onpuck.com/api/cal', { method: 'POST', body: raw, headers: { 'x-cal-signature-256': signature ?? sign(raw) } }));
};

describe('POST /api/cal (Cal.com webhook to Attio)', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    vi.stubEnv('CAL_WEBHOOK_SECRET', 'whsec');
    vi.stubEnv('ATTIO_API_KEY', 'key-123');
    vi.stubEnv('ATTIO_LIST', '');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockImplementation(async (url: string, init: RequestInit) => {
      if (/\/lists\/[^/]+$/.test(url)) return new Response(JSON.stringify({ data: { id: { list_id: 'L1' }, parent_object: ['people'] } }));
      if (url.includes('/entries') && init.method === 'GET') return new Response('{"data":[]}');
      return new Response(JSON.stringify({ data: { id: { record_id: url.includes('companies') ? 'c1' : 'p1' } } }));
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });
  const attio = (suffix: string) => fetchMock.mock.calls.find((c) => String(c[0]).endsWith(suffix));

  it('rejects requests that are not signed with the shared secret, without touching Attio', async () => {
    expect((await post(created, 'bad')).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('puts a booking in Attio: company, person with name, note and the Design Partners list at Applied', async () => {
    const res = await post(created);
    expect(res.status).toBe(200);
    expect(JSON.parse(attio('/objects/companies/records?matching_attribute=domains')![1].body).data.values.domains).toEqual(['woku.app']);
    const person = JSON.parse(attio('/objects/people/records?matching_attribute=email_addresses')![1].body).data.values;
    expect(person.email_addresses).toEqual(['diego@woku.app']);
    expect(person.name).toEqual([{ first_name: 'Diego', last_name: 'Orrego (test)', full_name: 'Diego Orrego (test)' }]);
    expect(person.company).toEqual([{ target_object: 'companies', target_record_id: 'c1' }]);
    const note = JSON.parse(attio('/notes')![1].body).data;
    expect(note.title).toBe('Intro call booked (Cal.com)');
    expect(note.parent_record_id).toBe('p1');
    const entry = fetchMock.mock.calls.find((c) => c[0] === 'https://api.attio.com/v2/lists/design_partners/entries' && c[1].method === 'POST');
    expect(JSON.parse(entry![1].body).data.entry_values).toEqual({ stage: 'Applied' });
  });

  it('skips the company for free-mail bookings without a website', async () => {
    const b = structuredClone(created);
    delete (b.payload.responses as Record<string, unknown>)['startup-website'];
    b.payload.attendees[0].email = 'someone@gmail.com';
    expect((await post(b)).status).toBe(200);
    expect(attio('/objects/companies/records?matching_attribute=domains')).toBeUndefined();
    expect(JSON.parse(attio('/objects/people/records?matching_attribute=email_addresses')![1].body).data.values.company).toBeUndefined();
  });

  it('acknowledges other triggers (and Cal.com’s ping) without writing', async () => {
    expect((await post({ triggerEvent: 'PING' })).status).toBe(200);
    expect((await post({ ...created, triggerEvent: 'BOOKING_CANCELLED' })).status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('answers 400 to signed bodies that are not JSON', async () => {
    expect((await post('not json')).status).toBe(400);
  });

  it('answers 503 and logs when it is not configured, so the setup gap shows in the log', async () => {
    vi.stubEnv('CAL_WEBHOOK_SECRET', '');
    expect((await post(created)).status).toBe(503);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('CAL_WEBHOOK_SECRET'));
  });

  it('answers 502 and logs when Attio fails, so Cal.com can retry', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 500 }));
    expect((await post(created)).status).toBe(502);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Attio 500'));
  });
});
