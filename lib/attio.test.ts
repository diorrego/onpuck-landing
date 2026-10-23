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

  describe('pipeline: the Design Partners list, stage Applied', () => {
    const pipeline = { list: 'design_partners', stage: 'Applied' };
    // Answers by URL, so the order of calls does not matter
    const workspace = ({ parent = 'people', entries = [] as unknown[], listStatus = 200 } = {}) =>
      fetchMock.mockImplementation(async (url: string, init: RequestInit) => {
        if (url.endsWith('/lists/design_partners') && init.method === 'GET')
          return listStatus === 200 ? ok({ data: { id: { list_id: 'L1' }, api_slug: 'design_partners', parent_object: [parent] } }) : new Response('{}', { status: listStatus });
        if (url.includes('/entries') && init.method === 'GET') return ok({ data: entries });
        if (url.endsWith('/lists/design_partners/entries')) return ok({ data: { id: { entry_id: 'E1' } } });
        if (url.includes('/objects/companies/records')) return ok({ data: { id: { record_id: 'company-1' } } });
        if (url.includes('/objects/people/records')) return ok({ data: { id: { record_id: 'person-1' } } });
        return ok({ data: { id: { note_id: 'note-1' } } });
      });
    const created = () => fetchMock.mock.calls.find((c) => c[0].endsWith('/lists/design_partners/entries') && c[1].method === 'POST');

    it('adds the person to a people list at the Applied stage', async () => {
      workspace();
      await upsertApplication('key-123', application, pipeline);
      expect(fetchMock.mock.calls.some((c) => c[0] === 'https://api.attio.com/v2/objects/people/records/person-1/entries')).toBe(true);
      expect(JSON.parse(created()![1].body).data).toEqual({ parent_object: 'people', parent_record_id: 'person-1', entry_values: { stage: 'Applied' } });
    });

    it('adds the company when the list is on companies', async () => {
      workspace({ parent: 'companies' });
      await upsertApplication('key-123', application, pipeline);
      expect(JSON.parse(created()![1].body).data).toMatchObject({ parent_object: 'companies', parent_record_id: 'company-1' });
    });

    it('leaves an existing entry alone, so applying again never moves someone back to Applied', async () => {
      workspace({ entries: [{ list_id: 'L1', list_api_slug: 'design_partners', entry_id: 'E0' }] });
      await upsertApplication('key-123', application, pipeline);
      expect(created()).toBeUndefined();
    });

    it('still adds the entry when the record is only in other lists', async () => {
      workspace({ entries: [{ list_id: 'L9', list_api_slug: 'investors', entry_id: 'E9' }] });
      await upsertApplication('key-123', application, pipeline);
      expect(created()).toBeDefined();
    });

    it('logs a pipeline failure without failing the application (the person and note are saved)', async () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      workspace({ listStatus: 403 });
      await expect(upsertApplication('key-123', application, pipeline)).resolves.toBeUndefined();
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Attio 403'));
      expect(fetchMock.mock.calls.some((c) => c[0] === 'https://api.attio.com/v2/notes')).toBe(true);
      spy.mockRestore();
    });

    it('sends reads without a body', async () => {
      workspace();
      await upsertApplication('key-123', application, pipeline);
      for (const [, init] of fetchMock.mock.calls.filter((c) => c[1].method === 'GET')) expect(init.body).toBeUndefined();
    });
  });
});
