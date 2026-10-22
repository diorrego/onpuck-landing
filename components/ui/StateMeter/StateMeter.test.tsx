import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StateMeter from '.';

describe('StateMeter', () => {
  it('exposes the value as an accessible meter', () => {
    render(<StateMeter kind="frustration" value={0.42} />);
    const meter = screen.getByRole('meter', { name: 'Frustration R' });
    expect(meter).toHaveAttribute('aria-valuenow', '0.42');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '1');
    expect(screen.getByText('0.42')).toBeInTheDocument();
  });

  it('clamps out-of-range values', () => {
    render(<StateMeter kind="motivation" value={1.7} />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '1');
  });
});
