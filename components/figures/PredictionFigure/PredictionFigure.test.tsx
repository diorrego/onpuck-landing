import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PredictionFigure from '.';

describe('PredictionFigure', () => {
  it('exposes every estimate with its interval as table rows', () => {
    render(<PredictionFigure />);
    const table = screen.getByRole('table', { name: /predicted and real change/i });
    expect(table).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Real change' })).toBeInTheDocument();
    expect(screen.getByText('−0.011 [−0.046, +0.025]')).toBeInTheDocument();
    expect(screen.getByText('+0.062')).toBeInTheDocument();
  });
});
