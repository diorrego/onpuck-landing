import { describe, expect, it } from 'vitest';
import config from '../next.config';

describe('next.config', () => {
  it('rewrites Accept: text/markdown on / to the Markdown twin', async () => {
    const rewrites = await config.rewrites!();
    const list = Array.isArray(rewrites) ? rewrites : rewrites.beforeFiles ?? [];
    expect(list).toContainEqual({
      source: '/',
      destination: '/index.md',
      has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
    });
  });

  it('sends Vary: Accept on the HTML page', async () => {
    const headers = await config.headers!();
    const home = headers.find((h) => h.source === '/')!;
    expect(home.headers).toContainEqual({ key: 'Vary', value: 'Accept' });
  });
});
