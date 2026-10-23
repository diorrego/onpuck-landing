import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PaperSection from '.';

describe('PaperSection', () => {
  it('anchors the section and links its numbered h2 to itself', () => {
    const { container } = render(<PaperSection id="gap" number="1" title="The gap" lede="Lede [32].">body</PaperSection>);
    const section = container.querySelector('section#gap')!;
    expect(section).toHaveAttribute('aria-labelledby', 'gap-title');
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent('1The gap');
    expect(h2.querySelector('a')).toHaveAttribute('href', '#gap');
  });
});
