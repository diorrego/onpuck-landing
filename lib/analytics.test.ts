import { afterEach, describe, expect, it, vi } from 'vitest';
import { EVENTS, track } from './analytics';

describe('track', () => {
  afterEach(() => {
    delete (window as { dataLayer?: unknown }).dataLayer;
    delete (window as { clarity?: unknown }).clarity;
  });

  it('pushes the event to the dataLayer and mirrors it to Clarity', () => {
    const clarity = vi.fn();
    Object.assign(window, { clarity });
    track('cta_click', { location: 'hero' });
    expect((window as unknown as { dataLayer: unknown[] }).dataLayer).toEqual([{ event: 'cta_click', location: 'hero' }]);
    expect(clarity).toHaveBeenCalledWith('event', 'cta_click');
  });

  it('knows the funnel events in the plan', () => {
    expect(EVENTS).toEqual([
      'cta_click', 'scroll_section', 'paper_link_click', 'experiment_expand', 'form_start',
      'form_submit_success', 'calendar_booked', 'faq_open',
    ]);
  });

  it('ignores unknown events', () => {
    track('nope' as never);
    expect((window as { dataLayer?: unknown[] }).dataLayer).toBeUndefined();
  });
});
