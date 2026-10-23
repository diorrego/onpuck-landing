import { act, render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import SceneIsland from '.';
import { scaleFor } from './SceneIsland';

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
});

const mockMotion = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: reduce && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }));

describe('SceneIsland', () => {
  it('server-renders the poster as the first paint, hidden from assistive tech', () => {
    mockMotion(false);
    const { container } = render(<SceneIsland mode="life" priority label="Illustration of a simulated run" />);
    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('src', '/scene/poster.png');
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(container.querySelector('canvas')).toHaveClass('opacity-0');
  });

  it('places the inspect button under the floor and above the counts, reserving its space before the engine runs', () => {
    mockMotion(false);
    const { container } = render(<SceneIsland mode="life" label="x" statusLabels={{ onFloor: 'a', frustrated: 'b', done: 'c', left: 'd' }} />);
    const scene = container.querySelector('[data-scene] > div[aria-hidden="true"]')!;
    const button = container.querySelector('button')!;
    expect(button).toHaveTextContent('Inspect a person');
    expect(button.closest('.invisible')).not.toBeNull();
    expect(scene.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(button.closest('.justify-center')).not.toBeNull();
  });

  it('renders the state card in a portal on <body>, so the figure box never clips it', () => {
    mockMotion(false);
    const { container } = render(<SceneIsland mode="ab" label="x" arm="control" />);
    const card = document.body.querySelector('[data-scene-card="ab"]')!;
    expect(card).not.toBeNull();
    expect(container.contains(card)).toBe(false);
  });

  it('keeps the poster with labelled callouts under reduced motion', () => {
    mockMotion(true);
    const { container } = render(<SceneIsland mode="life" label="x" />);
    expect(container.textContent).toMatch(/R \d\.\d\d F \d\.\d\d M \d\.\d\d/);
  });

  it('uses the A/B still for Fig. 3', () => {
    mockMotion(false);
    const { container } = render(<SceneIsland mode="ab" label="x" arm="control" />);
    expect(container.querySelector('img')).toHaveAttribute('src', '/scene/poster-ab.png');
    expect(container.querySelector('img')).toHaveAttribute('loading', 'lazy');
  });

  it('rescales when only the window height changes', () => {
    mockMotion(false);
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 1440 });
    vi.stubGlobal('devicePixelRatio', 1);
    vi.stubGlobal('innerHeight', 600);
    const { container } = render(<SceneIsland mode="life" label="x" />);
    const box = () => (container.querySelector('[data-scene] > div') as HTMLElement).style.width;
    expect(parseFloat(box())).toBeCloseTo(592.5, 0); // fitted, no whole-pixel scale close enough
    act(() => {
      vi.stubGlobal('innerHeight', 900);
      window.dispatchEvent(new Event('resize'));
    });
    expect(box()).toBe('864px');
    delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth;
  });

  describe('scaleFor', () => {
    it('fits the box width and snaps to whole device pixels when close', () => {
      expect(scaleFor(880, 1, 1, 2000)).toBe(2); // 2.04 fits, 2 is within 85%
      expect(scaleFor(650, 1, 2, 2000)).toBe(1.5); // 3.01 device px -> 3
    });

    it('keeps the fitted size when snapping would shrink it too much', () => {
      expect(scaleFor(650, 1, 1, 2000)).toBeCloseTo(650 / 432, 5); // 1.5 at dpr 1 stays fractional
    });

    it('never exceeds the height budget', () => {
      expect(scaleFor(2000, 0.5, 1, 1120)).toBe(2); // 560 / 280
    });
  });
});
