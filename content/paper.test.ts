import { describe, expect, it } from 'vitest';
import { citationIds } from '@/lib/inline';
import { references } from './references';
import { experiments } from './experiments';
import { allCopy, paper, CTA_LABEL, CONTACT_EMAIL } from './paper';

const copy = allCopy();
const joined = copy.join('\n');

describe('paper copy', () => {
  it('uses the brief section anchors in order', () => {
    expect(paper.sections.map((s) => s.id)).toEqual([
      'abstract', 'gap', 'model', 'simulation', 'evidence', 'research', 'limits', 'program',
      'apply', 'faq',
    ]);
  });

  it('has exactly one CTA label, "Apply to be a design partner"', () => {
    expect(CTA_LABEL).toBe('Apply to be a design partner');
    expect(paper.hero.primaryCta.label).toBe(CTA_LABEL);
    expect(joined).not.toMatch(/waitlist|get started|sign up|book a demo|request a demo/i);
  });

  it('opens with a citable 40 to 60 word abstract', () => {
    const words = paper.abstract.split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(40);
    expect(words).toBeLessThanOrEqual(60);
  });

  it('never uses em dashes', () => {
    expect(joined).not.toContain('—');
  });

  it('carries no dates in the story', () => {
    expect(joined).not.toMatch(/\b(19|20)\d{2}\b/);
    expect(joined).not.toMatch(
      /\b(January|February|March|April|June|July|August|September|October|November|December)\b/,
    );
  });

  it('avoids hype words', () => {
    expect(joined).not.toMatch(
      /revolutionary|AI-powered|game-chang|cutting-edge|seamless|supercharge|unlock|next-gen|magic/i,
    );
  });

  it('writes the name in lowercase', () => {
    expect(joined).not.toMatch(/\bOnPuck\b|\bOnpuck\b|\bONPUCK\b/);
  });

  it('publishes the contact email', () => {
    expect(CONTACT_EMAIL).toBe('paula@onpuck.com');
    expect(joined).toContain(CONTACT_EMAIL);
  });

  it('never invents customers or testimonials', () => {
    expect(joined).not.toMatch(/testimonial|trusted by|our customers|customers love/i);
  });

  it('resolves every citation and cites every reference at least once', () => {
    const cited = new Set(copy.flatMap(citationIds));
    const known = new Set(references.map((r) => r.id));
    expect([...cited].filter((id) => !known.has(id))).toEqual([]);
    expect([...known].filter((id) => !cited.has(id))).toEqual([]);
  });

  it('links only to experiments that exist', () => {
    const linked = [...joined.matchAll(/\(#(exp-\d{2})\)/g)].map((m) => m[1]);
    const ids = new Set(experiments.map((e) => e.id));
    expect(linked.filter((id) => !ids.has(id))).toEqual([]);
  });

  it('writes 5 to 8 FAQ entries', () => {
    expect(paper.faq.length).toBeGreaterThanOrEqual(5);
    expect(paper.faq.length).toBeLessThanOrEqual(8);
  });

  it('labels synthetic figures as synthetic', () => {
    for (const fig of paper.figures.filter((f) => f.synthetic)) {
      expect(fig.caption.toLowerCase()).toMatch(/synthetic|illustration/);
    }
  });
});
