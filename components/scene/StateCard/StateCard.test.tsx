import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StateCard from '.';

const card = { id: 3, label: 'Simulated user 03', device: 'laptop', task: 'Exporting a report', state: 'using', R: 0.7, F: 0.3, M: 0.4, risk: 'high', firstAction: null } as const;

describe('StateCard', () => {
  it('shows who, what, R F M and the risk of leaving', () => {
    render(<StateCard card={card} />);
    expect(screen.getByText('Simulated user 03')).toBeInTheDocument();
    expect(screen.getByText(/Exporting a report/)).toBeInTheDocument();
    expect(screen.getAllByRole('meter')).toHaveLength(3);
    expect(screen.getByText('Risk high')).toBeInTheDocument();
  });

  it('shows the first action in the A/B replay', () => {
    render(<StateCard card={{ ...card, firstAction: 'writing' }} />);
    expect(screen.getByText(/First action: writing/)).toBeInTheDocument();
  });
});
