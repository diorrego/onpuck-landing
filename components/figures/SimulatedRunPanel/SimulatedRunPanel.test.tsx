import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import SimulatedRunFigure from '@/components/figures/SimulatedRunFigure';

describe('SimulatedRunPanel (through its figure)', () => {
  it('shows the registered prediction for both arms', () => {
    render(<SimulatedRunFigure />);
    expect(screen.getAllByText('7%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('20%').length).toBeGreaterThan(0);
    expect(screen.getByText(/Result pending/)).toBeInTheDocument();
  });

  it('switches arms through a toggle group', async () => {
    render(<SimulatedRunFigure />);
    const group = screen.getAllByRole('group', { name: 'Arm of the A/B test' })[0];
    const buttons = group.querySelectorAll('button');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
  });
});
