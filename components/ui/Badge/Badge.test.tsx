import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Badge from '.';

describe('Badge', () => {
  it('shows the label with a tone', () => {
    render(<Badge tone="pending">Registered, result pending</Badge>);
    const chip = screen.getByText('Registered, result pending');
    expect(chip).toHaveAttribute('data-tone', 'pending');
  });
});
