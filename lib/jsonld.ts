// One JSON-LD graph for the page: the organisation, the site, the light paper with its
// citations, and the visible FAQ. Rendered in app/page.tsx.

import {
  CONTACT_EMAIL,
  CONTENT_PUBLISHED,
  CONTENT_UPDATED,
  founders,
  paper,
  SITE_URL,
  VERSION,
} from '@/content/paper';
import { references } from '@/content/references';
import { plainText } from './inline';

const ORG = `${SITE_URL}/#org`;

export function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG,
        name: 'onpuck',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon-512.png`,
        description: paper.description,
        slogan: 'We exist to turn stories into evidence, and evidence into better decisions.',
        founder: founders.map((f) => ({ '@type': 'Person', name: f.name })),
        address: { '@type': 'PostalAddress', addressLocality: 'San Francisco', addressRegion: 'CA', addressCountry: 'US' },
        contactPoint: { '@type': 'ContactPoint', email: CONTACT_EMAIL, contactType: 'design partner program' },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'onpuck',
        url: `${SITE_URL}/`,
        inLanguage: 'en',
        publisher: { '@id': ORG },
      },
      {
        '@type': 'TechArticle',
        '@id': `${SITE_URL}/#paper`,
        headline: paper.hero.headline,
        alternativeHeadline: paper.title,
        abstract: paper.abstract,
        description: paper.description,
        version: VERSION,
        datePublished: CONTENT_PUBLISHED,
        dateModified: CONTENT_UPDATED,
        inLanguage: 'en',
        author: founders.map((f) => ({ '@type': 'Person', name: f.name, worksFor: { '@id': ORG } })),
        publisher: { '@id': ORG },
        mainEntityOfPage: `${SITE_URL}/`,
        about: ['User research', 'Product analytics', 'Simulated users', 'Coding agents'],
        citation: references.map((r) => ({
          '@type': 'ScholarlyArticle',
          name: r.title,
          author: r.authors,
          datePublished: String(r.year),
          isPartOf: r.venue,
          url: r.url,
          ...(r.arxiv ? { identifier: `arXiv:${r.arxiv}` } : r.doi ? { identifier: `doi:${r.doi}` } : {}),
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: paper.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a.map(plainText).join(' ') },
        })),
      },
    ],
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
