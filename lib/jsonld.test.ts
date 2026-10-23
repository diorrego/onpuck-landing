import { describe, expect, it } from 'vitest';
import { references } from '@/content/references';
import { buildJsonLd, serializeJsonLd } from './jsonld';

const ld = buildJsonLd();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const byType = (t: string) => ld['@graph'].find((n: { '@type': string }) => n['@type'] === t) as any;

describe('JSON-LD graph', () => {
  it('declares Organization, WebSite, TechArticle and FAQPage', () => {
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@graph'].map((n: { '@type': string }) => n['@type'])).toEqual(['Organization', 'WebSite', 'TechArticle', 'FAQPage']);
  });

  it('gives the organisation its public contact and lowercase name', () => {
    const org = byType('Organization');
    expect(org.name).toBe('OnPuck');
    expect(org.contactPoint.email).toBe('paula@onpuck.com');
    expect(org.logo).toMatch(/^https:\/\/www\.onpuck\.com\//);
  });

  it('names both founders as authors, with their LinkedIn profiles', () => {
    const article = byType('TechArticle');
    expect(article.author.map((a: { name: string }) => a.name)).toEqual(['Paula Riquelme', 'Diego Orrego']);
    expect(article.author[1].sameAs).toEqual(['https://www.linkedin.com/in/diorrego']);
  });

  it('cites every reference from the article', () => {
    const article = byType('TechArticle');
    expect(article.citation).toHaveLength(references.length);
    expect(article.citation[0]).toMatchObject({ '@type': 'ScholarlyArticle', url: references[0].url });
    expect(article.dateModified).toBe('2026-10-22');
    expect(article.version).toBe('1.0');
  });

  it('marks up the visible FAQ only', () => {
    const faq = byType('FAQPage');
    expect(faq.mainEntity).toHaveLength(7);
    expect(faq.mainEntity[0]['@type']).toBe('Question');
    expect(faq.mainEntity[0].acceptedAnswer.text).not.toMatch(/`/);
  });

  it('serialises safely for a script tag', () => {
    const out = serializeJsonLd({ x: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('<');
  });
});
