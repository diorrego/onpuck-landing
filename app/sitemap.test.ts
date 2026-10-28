import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';
import { CONTENT_UPDATED } from '@/content/paper';

describe('sitemap.xml', () => {
  it('lists the home page with the content date, not the build time', () => {
    expect(sitemap()).toEqual([{ url: 'https://www.onpuck.com/', lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 1 }]);
  });
});
