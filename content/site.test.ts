import { describe, expect, it } from 'vitest';
import { paper } from './paper';
import { errorCopy, navLinks, scene } from './site';

describe('site-wide copy (nav, footer, scene, error pages)', () => {
  it('links the nav only to sections that exist', () => {
    const ids = paper.sections.map((s) => s.id);
    for (const l of navLinks) expect(ids).toContain(l.id);
  });

  it('is the same scene the hero shows', () => {
    expect(paper.hero.sceneLabel).toBe(scene.label);
    expect(paper.hero.status).toEqual(scene.status);
  });

  it('keeps the error pages short, plain and on brand', () => {
    const text = Object.values(errorCopy).flatMap((v) => (typeof v === 'string' ? [v] : Object.values(v)));
    for (const t of text) {
      expect(t).not.toContain('—');
      expect(t).not.toMatch(/(?<![@.\w])onpuck(?!\.com)/);
      expect(t.split(/\s+/).length).toBeLessThanOrEqual(25);
    }
  });
});
