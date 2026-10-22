import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TrackerFigure from '.';

describe('TrackerFigure', () => {
  it('resolves four trackers, one contradicted, and shows the resulting spec', () => {
    render(<TrackerFigure />);
    expect(screen.getAllByRole('row')).toHaveLength(5);
    expect(screen.getAllByText('confirmed')).toHaveLength(3);
    expect(screen.getByText('contradicted')).toBeInTheDocument();
    expect(screen.getByText('Make the exported file findable on iOS Safari')).toBeInTheDocument();
  });

  it('is labelled synthetic', () => {
    const { container } = render(<TrackerFigure />);
    expect(container.querySelector('figcaption')).toHaveTextContent(/Synthetic example/);
  });
});
