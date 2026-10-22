import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PixelIcon from '.';

describe('PixelIcon', () => {
  it('draws interface glyphs in the same grammar, recolourable', () => {
    const { container } = render(<PixelIcon name="plus" color="currentColor" />);
    expect(container.querySelector('path')).toHaveAttribute('fill', 'currentColor');
  });

  it('draws the same grid as the scene bubbles, one path per colour', () => {
    const { container } = render(<PixelIcon name="star" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg.querySelectorAll('path')).toHaveLength(2); // ink outline and white fill
    expect(svg.querySelector('path')!.getAttribute('d')).toMatch(/^M4 0h1v1h-1z/);
    expect(svg.getAttribute('shape-rendering')).toBe('crispEdges');
  });
});
