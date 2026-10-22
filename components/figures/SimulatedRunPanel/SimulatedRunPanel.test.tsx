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

  it('switches arms through an accessible radio group', async () => {
    render(<SimulatedRunFigure />);
    const group = screen.getAllByRole('radiogroup', { name: 'Arm of the A/B test' })[0];
    const radios = group.querySelectorAll('[role="radio"]');
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(radios[0] as HTMLElement);
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
  });
});
