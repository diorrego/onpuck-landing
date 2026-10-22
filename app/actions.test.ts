import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { joinWaitlist } from './actions';

describe('joinWaitlist (server action)', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('DISCORD_WEBHOOK_URL', 'https://discord.test/hook');
    fetchMock.mockReset();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('rejects an invalid email without calling the webhook', async () => {
    expect(await joinWaitlist('not-an-email')).toEqual({ status: 'invalid' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts a valid email to the server-only webhook', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    expect(await joinWaitlist(' cto@example.com ')).toEqual({ status: 'success' });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://discord.test/hook',
      expect.objectContaining({ method: 'POST' }),
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.content).toContain('cto@example.com');
    expect(body.allowed_mentions).toEqual({ parse: [] });
  });

  it('reports an error when the webhook fails', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    expect(await joinWaitlist('cto@example.com')).toEqual({ status: 'error' });
  });

  it('reports an error when the webhook is not configured', async () => {
    vi.stubEnv('DISCORD_WEBHOOK_URL', '');
    expect(await joinWaitlist('cto@example.com')).toEqual({ status: 'error' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
