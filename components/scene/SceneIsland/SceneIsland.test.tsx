import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import SceneIsland from '.';

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
});
