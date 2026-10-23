import { describe, expect, it } from 'vitest';
import { parseCalLink } from './cal';

describe('parseCalLink', () => {
  it.each([
    ['onpuck/design-partner-intro', { username: 'onpuck', eventSlug: 'design-partner-intro' }],
    ['https://cal.com/onpuck/intro', { username: 'onpuck', eventSlug: 'intro' }],
    ['/team-onpuck/intro/', { username: 'team-onpuck', eventSlug: 'intro' }],
  ])('%s', (link, expected) => {
    expect(parseCalLink(link)).toEqual(expected);
  });

  it('rejects links without an event', () => {
    expect(parseCalLink('onpuck')).toBeNull();
    expect(parseCalLink('')).toBeNull();
  });
});
