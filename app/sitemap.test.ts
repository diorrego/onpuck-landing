import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

describe('sitemap.xml', () => {
  it('lists the home page with the content date, not the build time', () => {
    expect(sitemap()).toEqual([{ url: 'https://www.onpuck.com/', lastModified: '2026-10-22', changeFrequency: 'monthly', priority: 1 }]);
  });
});
