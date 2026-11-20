import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PredictionFigure from '.';

describe('PredictionFigure', () => {
  it('exposes every estimate with its interval as table rows', () => {
    render(<PredictionFigure />);
    const table = screen.getByRole('table', { name: /predicted and real change/i });
    expect(table).toBeInTheDocument();
    expect(screen.getAllByRole('rowheader', { name: 'Real change' })).toHaveLength(2);
    expect(screen.getByText('−0.011 [−0.046, +0.025]')).toBeInTheDocument();
    expect(screen.getByText('+0.062')).toBeInTheDocument();
  });

  it('scores exp-04 against its own live A/B, not the backtest', () => {
    render(<PredictionFigure />);
    const group = screen.getByRole('rowgroup', { name: /live A\/B/ });
    expect(group).toHaveTextContent('exp-04 simulator');
    expect(group).toHaveTextContent('−0.017 [−0.031, −0.002]');
    expect(group).toHaveTextContent('−0.020 [−0.074, +0.035]');
  });
});
