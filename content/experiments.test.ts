import { describe, expect, it } from 'vitest';
import { experiments } from './experiments';

describe('experiments', () => {
  it('lists exp-01 to exp-05 in order, the exp-04 replication after exp-04', () => {
    expect(experiments.map((e) => e.id)).toEqual(['exp-01', 'exp-02', 'exp-03', 'exp-04', 'exp-04b', 'exp-05']);
  });

  it('gives every experiment a question, n, prediction, reality and verdict', () => {
    for (const e of experiments) {
      for (const field of [e.question, e.n, e.predicted, e.real, e.verdict]) {
        expect(field.trim()).not.toBe('');
      }
    }
  });

  it('keeps the misses: at least one experiment is not a clean hit', () => {
    expect(experiments.some((e) => e.outcome === 'partial' || e.outcome === 'miss')).toBe(true);
  });

  it('scores exp-04, the blind prediction, against the live A/B', () => {
    const exp04 = experiments.find((e) => e.id === 'exp-04')!;
    expect(exp04.blind).toBe(true);
    expect(exp04.outcome).toBe('hit');
    expect(exp04.real).toContain('+0.116 [+0.052, +0.179]');
    expect(experiments.some((e) => e.outcome === 'pending')).toBe(false);
  });

  it('keeps each row short enough to scan', () => {
    const words = (t: string) => t.split(/\s+/).filter(Boolean).length;
    for (const e of experiments) {
      expect(words(e.question), e.id).toBeLessThanOrEqual(20);
      expect(words(e.verdict), e.id).toBeLessThanOrEqual(30);
      expect(words(e.n), e.id).toBeLessThanOrEqual(14);
    }
  });
});
