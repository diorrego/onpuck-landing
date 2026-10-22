import { describe, expect, it } from 'vitest';
import { citationIds, parseInline } from './inline';

describe('parseInline', () => {
  it('keeps plain text as one text token', () => {
    expect(parseInline('Interviews explain why.')).toEqual([
      { type: 'text', value: 'Interviews explain why.' },
    ]);
  });

  it('turns [n] and [n, m] into citation tokens', () => {
    expect(parseInline('rarely accurate [32]. Both [5, 6].')).toEqual([
      { type: 'text', value: 'rarely accurate ' },
      { type: 'cite', ids: [32] },
      { type: 'text', value: '. Both ' },
      { type: 'cite', ids: [5, 6] },
      { type: 'text', value: '.' },
    ]);
  });

  it('parses `code`, **strong** and [label](href) links', () => {
    expect(parseInline('Run `get_evidence` **now**, see [exp-02](#exp-02).')).toEqual([
      { type: 'text', value: 'Run ' },
      { type: 'code', value: 'get_evidence' },
      { type: 'text', value: ' ' },
      { type: 'strong', value: 'now' },
      { type: 'text', value: ', see ' },
      { type: 'link', value: 'exp-02', href: '#exp-02' },
      { type: 'text', value: '.' },
    ]);
  });

  it('does not treat a bracketed word as a citation', () => {
    expect(parseInline('a [draft] note')).toEqual([{ type: 'text', value: 'a [draft] note' }]);
  });
});

describe('citationIds', () => {
  it('collects every cited id in order of appearance, without duplicates', () => {
    expect(citationIds('x [3] y [1, 3] z [2]')).toEqual([3, 1, 2]);
  });
});
