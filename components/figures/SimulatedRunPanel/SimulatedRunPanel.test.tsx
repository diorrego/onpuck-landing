import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import SimulatedRunFigure from '@/components/figures/SimulatedRunFigure';

describe('SimulatedRunPanel (through its figure)', () => {
  it('shows the registered prediction next to the real result for both arms', () => {
    render(<SimulatedRunFigure />);
    for (const v of ['7%', '20%', '14%', '26%']) expect(screen.getAllByText(v).length, v).toBeGreaterThan(0);
    expect(screen.getByText(/landed inside the registered interval/)).toBeInTheDocument();
    expect(screen.queryByText(/pending/i)).toBeNull();
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
