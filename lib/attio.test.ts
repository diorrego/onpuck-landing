import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { upsertApplication } from './attio';

const application = {
  email: 'cto@acme.dev',
  company: 'https://acme.dev',
  domain: 'acme.dev',
  role: 'CTO',
  change: 'We moved onboarding to one screen and activation did not move.',
  stack: 'Next.js, PostHog, Sentry',
  attribution: { utm_source: 'linkedin', referrer: 'https://www.linkedin.com/' },
  agentInvoked: false,
};

const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });

describe('upsertApplication (Attio)', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('asserts the company by domain, the person by email, then adds a note', async () => {
    fetchMock
      .mockResolvedValueOnce(ok({ data: { id: { record_id: 'company-1' } } }))
      .mockResolvedValueOnce(ok({ data: { id: { record_id: 'person-1' } } }))
      .mockResolvedValueOnce(ok({ data: { id: { note_id: 'note-1' } } }));
    await upsertApplication('key-123', application);

    const [companyCall, personCall, noteCall] = fetchMock.mock.calls;
    expect(companyCall[0]).toBe('https://api.attio.com/v2/objects/companies/records?matching_attribute=domains');
    expect(companyCall[1].method).toBe('PUT');
    expect(companyCall[1].headers.Authorization).toBe('Bearer key-123');
    expect(JSON.parse(companyCall[1].body).data.values.domains).toEqual(['acme.dev']);

    expect(personCall[0]).toBe('https://api.attio.com/v2/objects/people/records?matching_attribute=email_addresses');
    const person = JSON.parse(personCall[1].body).data.values;
    expect(person.email_addresses).toEqual(['cto@acme.dev']);
    expect(person.job_title).toBe('CTO');
    expect(person.company).toEqual([{ target_object: 'companies', target_record_id: 'company-1' }]);

    expect(noteCall[0]).toBe('https://api.attio.com/v2/notes');
    const note = JSON.parse(noteCall[1].body).data;
    expect(note.parent_object).toBe('people');
    expect(note.parent_record_id).toBe('person-1');
    expect(note.content).toContain('activation did not move');
    expect(note.content).toContain('utm_source: linkedin');
  });

  it('throws when Attio answers with an error', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{"message":"nope"}', { status: 401 }));
    await expect(upsertApplication('bad', application)).rejects.toThrow(/Attio 401/);
  });
});
