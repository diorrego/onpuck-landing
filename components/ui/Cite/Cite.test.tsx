import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Cite from '.';

describe('Cite', () => {
  it('links each id to its reference anchor', () => {
    render(<Cite ids={[5, 6]} />);
    const links = screen.getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['#ref-5', '#ref-6']);
    expect(links[0]).toHaveAccessibleName(/Reference 5/);
  });

  it('shows the reference in a title for hover', () => {
    render(<Cite ids={[32]} />);
    expect(screen.getByRole('link')).toHaveAttribute('title', expect.stringMatching(/^Parry et al\./));
  });

  it('renders as bracketed numbers', () => {
    const { container } = render(<Cite ids={[5, 6]} />);
    expect(container.textContent).toBe('[5, 6]');
  });
});
