import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { normaliseCompany } from '@/lib/apply';
import { applyDesignPartner } from './actions';

const form = (fields: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
};

const valid = {
  email: 'cto@acme.dev',
  company: 'acme.dev',
  role: 'CTO',
  change: 'We moved onboarding to one screen and activation did not move.',
  stack: 'Next.js, PostHog, Sentry',
};

describe('normaliseCompany', () => {
  it.each([
    ['acme.dev', 'https://acme.dev', 'acme.dev'],
    ['https://www.Acme.dev/about', 'https://www.acme.dev/about', 'acme.dev'],
    ['http://acme.co.uk', 'http://acme.co.uk', 'acme.co.uk'],
  ])('%s', (input, url, domain) => {
    expect(normaliseCompany(input)).toEqual({ url, domain });
  });

  it('rejects things that are not a URL', () => {
    expect(normaliseCompany('acme')).toBeNull();
    expect(normaliseCompany('not a url.com')).toBeNull();
  });
});

describe('applyDesignPartner (server action)', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    vi.stubEnv('ATTIO_API_KEY', 'key-123');
    vi.stubEnv('DISCORD_WEBHOOK_URL', '');
    vi.stubEnv('APPLY_DRY_RUN', '');
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  const attioOk = () =>
    fetchMock.mockImplementation(async (url: string) =>
      new Response(JSON.stringify({ data: { id: { record_id: url.includes('companies') ? 'c1' : 'p1', note_id: 'n1' } } }), { status: 200 }),
    );

  it('returns field errors and keeps the values', async () => {
    const state = await applyDesignPartner({ status: 'idle' }, form({ ...valid, email: 'nope', change: 'short' }));
    if (state.status !== 'invalid') throw new Error(`expected invalid, got ${state.status}`);
    expect(state.errors?.email).toMatch(/email/i);
    expect(state.errors?.change).toMatch(/sentence/i);
    expect(state.values?.company).toBe('acme.dev');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('upserts into Attio and returns success with the email for the calendar', async () => {
    attioOk();
    const state = await applyDesignPartner({ status: 'idle' }, form({ ...valid, utm_source: 'hn' }));
    expect(state).toEqual({ status: 'success', email: 'cto@acme.dev' });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(JSON.parse(fetchMock.mock.calls[2][1].body).data.content).toContain('utm_source: hn');
  });

  it('treats a duplicate email as the same success (upsert)', async () => {
    attioOk();
    await applyDesignPartner({ status: 'idle' }, form(valid));
    const again = await applyDesignPartner({ status: 'idle' }, form(valid));
    expect(again.status).toBe('success');
  });

  it('silently accepts bots that fill the honeypot, without sending anything', async () => {
    const state = await applyDesignPartner({ status: 'idle' }, form({ ...valid, website: 'spam.example' }));
    expect(state.status).toBe('success');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports an error when Attio fails, so the page can offer the mailto fallback', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 500 }));
    const state = await applyDesignPartner({ status: 'idle' }, form(valid));
    expect(state.status).toBe('error');
  });

  it('reports an error when nothing is configured', async () => {
    vi.stubEnv('ATTIO_API_KEY', '');
    const state = await applyDesignPartner({ status: 'idle' }, form(valid));
    expect(state.status).toBe('error');
  });

  it('succeeds without network in dry-run mode (local development)', async () => {
    vi.stubEnv('ATTIO_API_KEY', '');
    vi.stubEnv('APPLY_DRY_RUN', '1');
    const state = await applyDesignPartner({ status: 'idle' }, form(valid));
    expect(state.status).toBe('success');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('also notifies the team channel server side when a webhook is set', async () => {
    attioOk();
    vi.stubEnv('DISCORD_WEBHOOK_URL', 'https://discord.test/hook');
    await applyDesignPartner({ status: 'idle' }, form(valid));
    const discord = fetchMock.mock.calls.find((c) => c[0] === 'https://discord.test/hook');
    expect(JSON.parse(discord![1].body).content).toContain('acme.dev');
  });
});
