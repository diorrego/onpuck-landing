import { describe, expect, it } from 'vitest';
import { references, referenceById } from './references';

describe('references', () => {
  it('has 30+ references with contiguous, unique ids', () => {
    expect(references.length).toBeGreaterThanOrEqual(30);
    const ids = references.map((r) => r.id).sort((a, b) => a - b);
    expect(ids).toEqual(ids.map((_, i) => i + 1));
  });

  it.each(references.map((r) => [r.id, r] as const))('ref %i is complete', (_, ref) => {
    expect(ref.authors.trim()).not.toBe('');
    expect(ref.title.trim()).not.toBe('');
    expect(ref.finding.trim().length).toBeGreaterThan(20);
    expect(ref.url).toMatch(/^https:\/\//);
    if (ref.arxiv) {
      expect(ref.arxiv).toMatch(/^\d{4}\.\d{4,5}$/);
      expect(ref.url).toBe(`https://arxiv.org/abs/${ref.arxiv}`);
    }
    if (ref.doi) {
      expect(ref.doi).toMatch(/^10\.\d{4,}\//);
      expect(ref.url).toBe(`https://doi.org/${ref.doi}`);
    }
  });

  it('looks references up by id', () => {
    expect(referenceById(32).authors).toMatch(/^Parry/);
    expect(() => referenceById(999)).toThrow();
  });
});
