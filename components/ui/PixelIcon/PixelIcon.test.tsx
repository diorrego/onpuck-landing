import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PixelIcon from '.';

describe('PixelIcon', () => {
  it('draws the same grid as the scene bubbles, one rect per pixel', () => {
    const { container } = render(<PixelIcon name="check" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg.querySelectorAll('rect').length).toBeGreaterThan(8);
    expect(svg.getAttribute('shape-rendering')).toBe('crispEdges');
  });
});
