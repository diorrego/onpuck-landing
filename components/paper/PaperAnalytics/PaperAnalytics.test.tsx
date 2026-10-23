import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PaperAnalytics from '.';

type Entry = { isIntersecting: boolean; target: Element; intersectionRatio: number };
let observerCallback: ((entries: Entry[]) => void) | null = null;

const events = () => ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? []);

describe('PaperAnalytics', () => {
  beforeEach(() => {
    delete (window as { dataLayer?: unknown }).dataLayer;
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: (entries: Entry[]) => void) {
          observerCallback = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
    document.body.innerHTML = `
      <nav aria-label="Contents"><a href="#gap" data-toc="gap">Gap</a></nav>
      <a id="cta" href="#apply" data-event="cta_click">Apply</a>
      <sup><a id="cite" href="#ref-32" data-event="paper_link_click" data-ref="32">32</a></sup>
      <a id="exp" href="#exp-02">exp-02</a>
      <section id="gap"></section>`;
  });
  afterEach(() => vi.unstubAllGlobals());

  it('tracks clicks on elements that declare an event', () => {
    render(<PaperAnalytics />);
    fireEvent.click(document.getElementById('cta')!);
    fireEvent.click(document.getElementById('cite')!);
    expect(events()).toEqual([
      { event: 'cta_click', target: '#apply', label: 'Apply' },
      { event: 'paper_link_click', target: '#ref-32', label: '32', ref: '32' },
    ]);
  });

  it('tracks experiment links as experiment_expand', () => {
    render(<PaperAnalytics />);
    fireEvent.click(document.getElementById('exp')!);
    expect(events()).toEqual([{ event: 'experiment_expand', experiment: 'exp-02' }]);
  });

  it('reports each section once and marks it current in the contents', () => {
    render(<PaperAnalytics />);
    const section = document.getElementById('gap')!;
    act(() => observerCallback!([{ isIntersecting: true, target: section, intersectionRatio: 0.5 }]));
    act(() => observerCallback!([{ isIntersecting: true, target: section, intersectionRatio: 0.5 }]));
    expect(events()).toEqual([{ event: 'scroll_section', section: 'gap' }]);
    expect(document.querySelector('[data-toc="gap"]')).toHaveAttribute('aria-current', 'location');
  });
});
