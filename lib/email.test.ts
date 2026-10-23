import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sendApplicationEmail } from './email';

const app = {
  email: 'cto@acme.dev',
  company: 'https://acme.dev',
  domain: 'acme.dev',
  role: 'CTO\r\nBcc: evil@example.com',
  change: 'We moved onboarding to one screen and activation did not move.',
  stack: 'Next.js, PostHog',
  attribution: { utm_source: 'hn', referrer: '' },
  agentInvoked: false,
};

describe('sendApplicationEmail (Resend REST API)', () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('sends the application as plain text to the team, with reply-to the applicant', async () => {
    fetchMock.mockResolvedValue(new Response('{"id":"e1"}', { status: 200 }));
    await sendApplicationEmail('re_key', { from: 'OnPuck <applications@onpuck.com>', to: 'paula@onpuck.com' }, app);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_key');
    const body = JSON.parse(init.body);
    expect(body.to).toEqual(['paula@onpuck.com']);
    expect(body.from).toBe('OnPuck <applications@onpuck.com>');
    expect(body.reply_to).toBe('cto@acme.dev');
    expect(body.subject).toContain('acme.dev');
    expect(body.subject).not.toMatch(/[\r\n]/);
    expect(body.text).toContain('activation did not move');
    expect(body.text).toContain('utm_source: hn');
    expect(body.text).toContain('cto@acme.dev');
    expect(body.html).toBeUndefined();
  });

  it('throws with the status when Resend refuses', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 403 }));
    await expect(sendApplicationEmail('k', { from: 'a@onpuck.com', to: 'b@onpuck.com' }, app)).rejects.toThrow('Resend 403');
  });
});
