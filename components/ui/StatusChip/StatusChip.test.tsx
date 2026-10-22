import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StatusChip from '.';

describe('StatusChip', () => {
  it('shows the label with a tone', () => {
    render(<StatusChip tone="pending">Registered, result pending</StatusChip>);
    const chip = screen.getByText('Registered, result pending');
    expect(chip).toHaveAttribute('data-tone', 'pending');
  });
});
