import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LineagePairs from '.';

describe('LineagePairs', () => {
  it('shows the finding beside what we do today, with an honest status', () => {
    render(<LineagePairs pairs={[{ paper: 'Found X [1].', today: 'We do Y.', status: 'designed' }]} />);
    expect(screen.getByText('We do Y.')).toBeInTheDocument();
    expect(screen.getByText('Designed, not built')).toBeInTheDocument();
  });
});
