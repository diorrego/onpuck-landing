import { describe, expect, it } from 'vitest';
import { experiments } from './experiments';

describe('experiments', () => {
  it('lists exp-01 to exp-04 in order', () => {
    expect(experiments.map((e) => e.id)).toEqual(['exp-01', 'exp-02', 'exp-03', 'exp-04']);
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

  it('shows exp-04 as a registered prediction with the result pending', () => {
    const exp04 = experiments.find((e) => e.id === 'exp-04')!;
    expect(exp04.outcome).toBe('pending');
    expect(exp04.real.toLowerCase()).toContain('pending');
  });
});
