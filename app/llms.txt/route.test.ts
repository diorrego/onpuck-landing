import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /llms.txt', () => {
  it('follows the llms.txt shape: h1, quote summary, link lists', async () => {
    const res = await GET();
    expect(res.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    const text = await res.text();
    expect(text).toMatch(/^# OnPuck\n\n> /);
    expect(text).toContain('- [The light paper in Markdown](https://www.onpuck.com/index.md)');
    expect(text).toContain('## Apply');
    expect(text).toContain('paula@onpuck.com');
  });
});
