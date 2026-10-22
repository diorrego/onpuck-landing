import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /index.md', () => {
  it('serves the Markdown twin, varied by Accept and kept out of the index', async () => {
    const res = await GET();
    expect(res.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(res.headers.get('vary')).toBe('Accept');
    expect(res.headers.get('x-robots-tag')).toBe('noindex');
    expect(res.headers.get('link')).toBe('<https://www.onpuck.com/>; rel="canonical"');
    expect(await res.text()).toMatch(/^# Know what your users/);
  });
});
